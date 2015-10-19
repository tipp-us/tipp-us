// express app initialization
var express = require('express');
var app = express();
var path = require('path');
var braintree = require('braintree');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var util = require('util');

var db = require('../db/config.js');

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

/*===========================================================================/
/                             MIDDLEWARE                                     /
/===========================================================================*/

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

// Get names and IDs for all artists in db
app.get('/getAll', function(req, res) {
  var testObj = {
    artists:
      [
        {
          id: '1234',
          name: 'The Joes',
        },
        {
          id: '2345',
          name: 'The Rods',
        },
        {
          id: '3456',
          name: 'The Taylors',
        },
        {
          id: '4567',
          name: 'The Kevins',
        },
      ],
  };
  res.status(200).json(testObj);
});

// Get info of single artist
app.post('/artist', jsonParser, function(req, res) {
  var artistId = req.body.artistId;

  // TODO: replace with real data fetched from db
  var testObj = {
    id: '9999',
    name: 'The Dougs',
    pic: 'http://thecatapi.com/api/images/get',
  };
  res.status(200).json(testObj);
});

// Get list of specified number of nearby artists
app.post('/nearby', jsonParser, function(req, res) {
  var numArtists = req.body.numberOfArtists || 3;
  var position = req.body.position;

  // TODO: replace with real data fetched from db
  var testObj = {
    artists:
      [
        {
          id: '1234',
          name: 'The Joes',
          pic: 'http://thecatapi.com/api/images/get',
          position: {lat: 42.775546, long: -71.309915},
          location: 0.63,
          venue: 'Starbucks',
        },
        {
          id: '2345',
          name: 'The Rods',
          pic: 'http://thecatapi.com/api/images/get',
          position: {lat:  28.43593, long: 69.77992},
          location: 1.5,
          venue: 'The Hollywood Bowl',
        },
        {
          id: '3456',
          name: 'The Taylors',
          pic: 'http://thecatapi.com/api/images/get',
          position: {lat: 11.10532, long: -13.88939},
          location: 7.6,
        },
        {
          id: '4567',
          name: 'The Kevins',
          pic: 'http://thecatapi.com/api/images/get',
          position: {lat: 60.87421, long: 151.17539},
          location: 150.7,
        },
      ],
    numberOfArtists: 4,
    searchPosition: {lat: -7.75113, long: -47.22246},
  };
  res.status(200).json(testObj);
});

app.post('/create/artist', jsonParser, function(req, res) {

  // TODO: fill in necessary fields to create a user
  var artistData = {
    email: req.body.email,
    password: req.body.password,
  };

  // TODO: check if user in db
  //  if not, create
  //    return created user profile from db
  //  else, user already exists
  //    return some obj with error message to be displayed
  //    tell the user to think of a new name or something
  db.artist.findOne({
    where: {email: artistData.email},
  }).then(function(artist) {
    if (artist) {
      res.status(200).end("Sorry, email already registered");
    } else {
      db.artist.create(artistData).then(function(artist) {
        res.status(201).json(artist);
      });
    }
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
