// The Firebase function for delivering receipts via SendGrid.
'use strict';

const admin = require('firebase-admin');
const functions = require('firebase-functions');
const { PubSub } = require('@google-cloud/pubsub');
const sendgrid = require('@sendgrid/mail');
const utils = require('./utils');
const exampleEvents = require('example_events');

// EVENT_COLLECTION: The Firestore collection for persisting incoming events.
// EVENT_MAX_AGE: The TTL of events.
// DOWNSTREAM_TOPIC: The Cloud Pub/Sub topic for unfulfilled orders.
// DLQ: The DLQ for orders that cannot be fulfilled.
// ENDPOINT_SECRET: A secret for verifying Stripe webhook events.
const EVENT_COLLECTION = 'processedPaymentEvents';
const EVENT_MAX_AGE = 60000;
const UPSTREAM_TOPIC = functions.config().pubsub.fulfillment_downstream_topic;
const DOWNSTREAM_TOPIC = functions.config().pubsub.email_downstream_topic;
const DLQ = functions.config().pubsub.email_dlq;
const SENDGRID_API_KEY = functions.config().sendgrid.api_key;

const firestoreClient = admin.firestore();
const pubSubClient = new PubSub();
sendgrid.setApiKey(SENDGRID_API_KEY);

// A wrapper for rejecting dead-lettered events.
module.exports = functions.pubsub.topic(UPSTREAM_TOPIC).onPublish(async (message, context) => {
  try {
    return await sendEmail(message, context);
  } catch (err) {
    console.log(err.message);
    // Stripe webhook events are delivered via HTTP. Here it is wrapped in
    // a Cloud Event and rejected to DLQ via Cloud Pub/Sub.
    const orderProcessed = exampleEvents.OrderProcessed.Event.fromJSON(message.json);
    await utils.publishEvent(pubSubClient, DLQ, orderProcessed);
  }
});

async function sendEmail (message, context) {
  const orderProcessed = exampleEvents.OrderProcessed.Event.fromJSON(message.json);

  // Rejects stale events.
  utils.checkForExpiredEvents('RFC3339', orderProcessed.time, EVENT_MAX_AGE);
  // Checks if the event is duplicated.
  await utils.guaranteeExactlyOnceDelivery(firestoreClient, EVENT_COLLECTION, orderProcessed.id, JSON.stringify(message.json));

  const orderId = orderProcessed.data.orderId;
  const email = orderProcessed.data.email;
  const paymentErrType = orderProcessed.data.paymenterrtype;
  const paymentErrMessage = orderProcessed.data.paymenterrmessage;
  const emailMessage = utils.prepareEmailMessage(orderId, email, paymentErrType, paymentErrMessage);

  try {
    await sendgrid.send(emailMessage);
  } catch (err) {
    throw Error(`SENDGRID_ERROR: ${err.message}`);
  }

  // Emits an emailSent event.
  const emailSent = utils.createEmailSentEvent(orderId, email);
  await utils.publishEvent(pubSubClient, DOWNSTREAM_TOPIC, emailSent);
}
