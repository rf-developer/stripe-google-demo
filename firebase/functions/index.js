'use strict';

const admin = require('firebase-admin');

admin.initializeApp();

// A Firebase Function for processing payments via Stripe.
// See firebase/functions/payment.js for the source code.
exports.payment = require('./payment');

// A Firebase Function for delivering receipts via SendGrid.
// See firebase/functions/email.js for the source code.
exports.email = require('./email');

// Firebase Functions for streaming event data to Google BigQuery.
// See firebase/functions/sales.js and firebase/functions/invoices.js for the
// source code.
exports.sales = require('./sales');
exports.invoices = require('./invoices');
