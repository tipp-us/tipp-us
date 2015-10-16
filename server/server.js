// express app initialization
var express = require('express');
var app = express();
var path = require('path');
var braintree = require('braintree');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var util = require('util');

// Instantiate the braintree gateway.
// Note: Must change these values for production
var gateway;

if (process.env.BRAINTREE_MERCHANTID && process.env.BRAINTREE_PUBLICKEY && process.env.BRAINTREE_PRIVATEKEY) {
  gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANTID,
    publicKey: process.env.BRAINTREE_PUBLICKEY,
    privateKey: process.env.BRAINTREE_PRIVATEKEY,
  });
} else {
  var config = require('./config.js');
  gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: config.braintree.merchantId,
    publicKey: config.braintree.publicKey,
    privateKey: config.braintree.privateKey,
  });
}

// attach middleware
app.use(express.static(__dirname + '/../client'));
/**
 * Enable CORS (http://enable-cors.org/server_expressjs.html)
 * to allow different clients to request data from your server
 */
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/*===========================================================================/
/                               ROUTES                                       /
/===========================================================================*/

// Get info of single artist
app.get('/artist', jsonParser, function(req, res) {
  var searchTerm = req.body.searchTerm;

  // TODO: replace with real data fetched from db
  var testObj = {
    name: 'The Dougs',
    location: 'Huntington Beach, CA',
    pic: 'super/sweet/pic/uri',
  };
  res.status(200).json(testObj);
});

// Get list of specified number of nearby artists
app.get('/nearby', jsonParser, function(req, res) {
  var numArtists = req.body.numberOfArtists || 1;
  var searchLocation = req.body.searchLocation;

  // TODO: replace with real data fetched from db
  var testObj = {
    artists:
      [
        {
          name: 'The Joes',
          location: 'Boston MA',
          pic: 'picture/of/joes',
        },
        {
          name: 'The Rods',
          location: 'Rome',
          pic: 'picture/of/rods',
        },
        {
          name: 'The Taylors',
          location: 'Athens',
          pic: 'picture/of/taylors',
        },
        {
          name: 'The Kevins',
          location: 'L.A.',
          pic: 'picture/of/kevins',
        }
      ],
    numberOfArtists: 4,
    searchLocation: 'some search location',
  };
  res.status(200).json(testObj);
});

app.post('/create/artist', jsonParser, function(req, res) {

  // TODO: fill in necessary fields to create a user
  var artistData = {
    email: req.body.email,
    name: req.body.name,

    // additional fields...
  };

  // TODO: check if user in db
  //  if not, create
  //    return created user profile from db
  //  else, user already exists
  //    return some obj with error message to be displayed
  //    tell the user to think of a new name or something

  // TODO: replace this test data, which assumes that a new user was created
  res.status(201).json({
    name: 'The Dougs',
    location: 'Huntington Beach, CA',
    pic: 'super/sweet/pic/uri',
  });
});

// Send a braintree client token to client
app.get('/client_token', function(req, res) {
  gateway.clientToken.generate({}, function(err, response) {
    res.json({clientToken: response.clientToken});
  });
});

// Receive a braintree payment method nonce from client
app.post('/checkout', jsonParser, function(req, res) {
  var transaction = req.body;

  // TODO: replace with req.body.payment_method_nonce after testing
  // var nonce = transaction.payment_method_nonce;
  // For a list of static test nonces, visit:
  //  https://developers.braintreepayments.com/javascript+node/reference/general/testing
  var nonce = transaction.payment_method_nonce;

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

// app.get('*', function(req, res) {
//   var pat = req.path
//   var a = pat.split("/").slice(2).join("/");
//   res.sendFile(path.resolve("client/" + a));
// })

// export the express app to be used in index.js
module.exports = app;
