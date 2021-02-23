'use strict';
const https = require('https');
console.log("STRIPE_KEY" + process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  httpAgent: new https.Agent({ keepAlive: false }),
});

module.exports = {
  //create product
  charge: async function (event, context, callback) {
    const requestBody = JSON.parse(event.body);
    const token = requestBody.token.id;
    const amount = requestBody.charge.amount;
    const currency = requestBody.charge.currency;

    return stripe.charges
      .create({
        // Create Stripe charge with token
        amount,
        currency,
        description: 'Serverless Stripe Test charge',
        source: token,
      })
      .then((charge) => {
        // Success response
        const response = {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: `Charge processed succesfully!`,
            charge,
          }),
        };
        callback(null, response);
      })
      .catch((err) => {
        // Error response
        const response = {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            error: err.message,
          }),
        };
        callback(null, response);
      });
  },
};
