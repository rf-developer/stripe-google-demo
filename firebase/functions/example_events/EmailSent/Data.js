const uuidv4 = require('uuid/v4');

const Base = require('../Base');

class Data extends Base {
  // This class is auto generated by Cloud Events Generator
  // (https://github.com/michaelawyu/cloud-events-generator).
  //
  // Do not edit the class manually.

  constructor ({ bypassCheck = false, email = null, orderId = null } = {}) {
    // Data - a model defined in Cloud Events Generator
    //
    // Param email: The email of this Data.
    // Type of email: String
    // Param orderId: The orderId of this Data.
    // Type of orderId: String

    super();
    this.paramTypes = {
      email: String,
      orderId: String
    };
    this.attributeMap = {
      email: 'email',
      orderId: 'orderId'
    };

    if (!bypassCheck) {
      this.email = email;
      this.orderId = orderId;
    } else {
      this._email = email;
      this._orderId = orderId;
    }
  }

  static fromObject (obj) {
    const model = new this({ bypassCheck: true });
    Object.keys(model.paramTypes).forEach(function (key) {
      const baseName = model.attributeMap[key];
      const typ = model.paramTypes[key];
      if (Object.prototype.hasOwnProperty.call(obj, baseName) && obj[baseName]) {
        if (Array.isArray(typ)) {
          const itemTyp = typ[0];
          const arr = [];
          obj[baseName].forEach(function (elem) {
            if (itemTyp.fromObject === undefined) {
              arr.push(itemTyp(elem));
            } else {
              arr.push(itemTyp.fromObject(elem));
            }
          });
          model[key] = arr;
        } else {
          if (typ.fromObject === undefined) {
            model[key] = typ(obj[baseName]);
          } else {
            model[key] = typ.fromObject(obj[baseName]);
          }
        }
      } else {
        model[key] = null;
      }
    });
    return model;
  }

  get email () {
    // Gets the email of this Data.
    //
    // email address
    //
    // returns: email
    // returnType: String

    return this._email;
  }

  set email (email) {
    // Sets the email of this Data.
    //
    // email address
    //
    // returns: undefined
    // returnType: undefined

    if (email === undefined) {
      this._email = null;
    } else {
      this._email = email;
    }
  }

  get orderId () {
    // Gets the orderId of this Data.
    //
    // order id
    //
    // returns: orderId
    // returnType: String

    return this._orderId;
  }

  set orderId (orderId) {
    // Sets the orderId of this Data.
    //
    // order id
    //
    // returns: undefined
    // returnType: undefined

    if (orderId === undefined) {
      this._orderId = null;
    } else {
      this._orderId = orderId;
    }
  }
}

module.exports = Data;
