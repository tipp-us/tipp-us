// express app initialization
var express = require('express');
var app = express();

var braintree = require('braintree');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var util = require('util');
var config = require('./config.js');

// Instantiate the braintree gateway.
// Note: Must change these values for production
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: config.braintree.merchantId,
  publicKey: config.braintree.publicKey,
  privateKey: config.braintree.privateKey,
});

// attach middleware
app.use(express.static(__dirname + '/../client'));

// Send a client token to client
app.get('/client_token', function(req, res) {
  gateway.clientToken.generate({}, function(err, response) {
    res.send(response.clientToken);
  });
});

// Receive a payment method nonce from client
app.post('/checkout', jsonParser, function(req, res) {
  var transaction = req.body;

  // TODO: replace with req.body.payment_method_nonce after testing
  // var nonce = transaction.payment_method_nonce;
  // For a list of static test nonces, visit:
  //  https://developers.braintreepayments.com/javascript+node/reference/general/testing
  var nonce = 'fake-valid-nonce';

  // use payment method nonce here, test example below
  gateway.transaction.sale({
    amount: transaction.amount || '5.00', // TODO: remove default value for testing

    // TODO: specify merchantAccountId of the artist,
    // defaults to starvingartists default merchantAccountId if not specified

    paymentMethodNonce: nonce,
  }, function(err, result) {
    if (err) {
      throw error;
    }

    console.log(util.inspect(result));
    res.json(result);
  });
});

// export the express app to be used in index.js
module.exports = app;
