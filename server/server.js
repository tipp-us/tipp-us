// express app initialization
var express = require('express');
var app = express();
var path = require('path');
var braintree = require('braintree');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var util = require('util');
var db = require('../db/config.js');
// For venmo auth:
// var request = require('request');
// var venmoId, venmoSecret; 
var baseUrl;

var cloudinary = require('cloudinary');

// AUTHENTICATION //
var FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET;
var facebookCB;

var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  // , logger = require('morgan')
  , session = require('express-session')
  , cookieParser = require('cookie-parser')
  // , methodOverride = require('method-override');
// var LocalStrategy = require('passport-local').Strategy;
// END AUTHENTICATION //

// Instantiate the braintree gateway.
// Note: Must change these values for production
var gateway;

// if running on Heroku
if (process.env.BRAINTREE_MERCHANTID) {
  gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANTID,
    publicKey: process.env.BRAINTREE_PUBLICKEY,
    privateKey: process.env.BRAINTREE_PRIVATEKEY,
  });
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
  });
  // For venmo auth:
  // venmoId = process.env.VENMO_CLIENT_ID;
  // venmoSecret = process.env.VENMO_CLIENT_SECRET;
  FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
  FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
  facebookCB = 'http://starvingartists-staging.herokuapp.com/auth/facebook/callback';
} else { // running locally
  var config = require('./config.js');
  gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: config.braintree.merchantId,
    publicKey: config.braintree.publicKey,
    privateKey: config.braintree.privateKey,
  });
  cloudinary.config(config.cloudConfig);
  // For venmo auth:
  // venmoId = config.venmo.client_id;
  // venmoSecret = config.venmo.client_secret;
  FACEBOOK_APP_ID = config.facebook.app_id;
  FACEBOOK_APP_SECRET = config.facebook.app_secret;
  facebookCB = 'http://localhost:3000/auth/facebook/callback';
}

/*===========================================================================/
/                             AUTHENTICATION                                 /
/===========================================================================*/
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: facebookCB
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

// configure Express
  // app.set('views', __dirname + '/views');
  // app.set('view engine', 'ejs');
  // app.use(logger());
  app.use(cookieParser());
  app.use(bodyParser());
  // app.use(methodOverride());
  app.use(session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  // app.use(express.static(__dirname + '/public'));

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('logged in with facebook');
    console.log(req);
    res.redirect('/#/edit');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

//----------------------------------------------------------------------------------
// app.configure(function() {
//   // app.use(express.static('public'));
//   app.use(express.cookieParser());
//   app.use(express.bodyParser());
//   app.use(express.session({ secret: 'keyboard cat' }));
//   app.use(passport.initialize());
//   app.use(passport.session());
//   // app.use(app.router);
// });

// passport.use(new LocalStrategy({
//     usernameField: 'email'
//   },
//   function(username, password, done) {
//     // use correct database call
//     Artist.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));

// app.post('/login', 
//   passport.authenticate('local', { failureRedirect: '/login' }),
//   function(req, res) {
//     //res.redirect('/');
//   });

// app.get('/logout', function(req, res) {
//     req.logout();
//     res.redirect('/');
// });

// function isLoggedIn(req, res, next) {

//     // if user is authenticated in the session, carry on 
//     if (req.isAuthenticated())
//         return next();

//     // if they aren't redirect them to the home page
//     res.redirect('/');
// }

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
  // TODO: Needs to filter for only artists with ids and names
  db.artist.findAll({
    attributes: ['id', 'name'],
  }).then(function(artists) {
    res.status(200).json(artists);
  });
});

// Get info of single artist
app.post('/artist', jsonParser, function(req, res) {
  var artistId = req.body.artistId;

  db.artist.findById(artistId)
    .then(function(artist) {
      if (artist === null) {
        res.status(404).end('ArtistID ' + artistId + ' not found.');
      }

      res.status(200).json({
        id: artist.id,
        name: artist.name,
        pic: artist.imageUrl,
        email: artist.email,
        artistUrl: artist.artistUrl,
      });
    });

  // // TODO: replace with real data fetched from db
  // var testObj = {
  //   id: '9999',
  //   name: 'The Dougs',
  //   pic: 'http://thecatapi.com/api/images/get',
  // };
  // res.status(200).json(testObj);
});

// Get list of specified number of nearby artists
app.post('/nearby', jsonParser, function(req, res) {
  var numArtists = req.body.numberOfArtists || 3;
  var position = req.body.position;

  db.show.findAll({include: [db.artist]}).then(function(shows) {
    var closest = [];
    for (var i = 0; i < shows.length; i++) {
      var show = shows[i].dataValues;
      var artist = show.Artist;
      var dist = getDistanceFromLatLonInKm(position.lat, position.long, show.latitude, show.longitude) / 1.60934;
      var splits = artist.imageUrl.split('/');
      splits[splits.length - 2] = 'w_50,h_50';
      var img = splits.join('/');
      closest.push({
        id: artist.id,
        name: artist.name,
        pic: img,
        position: {
          lat: show.latitude,
          long: show.longitude,
        },
        location: dist,
        venue: show.venue,
      });
    }

    closest =  closest.sort(function(one, two) {
      return one.location > two.location;
    }).splice(0, numArtists);
    res.status(200).json({
      artists: closest,
      numberOfArtists: closest.length,
      searchPosition: position,
    });

  });
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
      res.status(200).end('Sorry, email already registered');
    } else {
      db.artist.create(artistData).then(function(artist) {
        res.status(201).json(artist);
      });
    }
  });
});

//edit an already created artist page
app.post('/edit/artist', jsonParser ,function(req, res) {
  //TODO auth
  var data = req.body;
  db.artist.findOne({
    where: {email: data.email}
  }).then(function(artist) {
    if(data.image) {
      cloudinary.uploader.upload(data.image, function(result) {
       //wait for image to upload!
       finish(result.url);
      });
    } else {
      finish();
    }
    
    function finish(url) {
      artist.name = data.name;
      artist.description = data.description;
      artist.password = data.pass;
      //Check to see if new url is already used by someone
      artist.artistUrl = data.url;
      //
      artist.imageUrl = url;
      artist.save().then(function() {
        res.end("Success", 200);

      });
    }
  }).catch(function(e) {
    res.status(400).json({error: e});
  });
});

app.post('/shows/add', jsonParser, function(req, res) {
  var data = req.body;
  console.log(data)
  db.artist.findById(data.id).then(function(artist) {
    db.show.create({
      venue: data.venue,
      latitude: data.lat,
      longitude: data.long,
      startTime: data.start,
      stopTime: data.end,
    }).then(function(show) {
      show.setArtist(artist);
      show.save();
    })
  })
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

// // Venmo auth and callback for auth token
// app.get('/auth/venmo', jsonParser, function(req, res) {
//   // redirect to auth with venmo, which will redirect back to /auth/venmo/callback with an auth code
//   res.redirect('https://api.venmo.com/v1/oauth/authorize?client_id=' + venmoId + '&scope=make_payments%20access_profile%20access_email&response_type=code');
// });

// app.get('/auth/venmo/callback', jsonParser, function(req, res) {
//   // auth with venmo to get token
//   var authCode = req.param('code');
//   request.post(
//     'https://api.venmo.com/v1/oauth/access_token',
//     {form: {
//       client_id: venmoId,
//       client_secret: venmoSecret,
//       code: authCode,
//     }},
//     function(err, response, body) {
//     if (err) {
//       console.log(err);
//       res.end('Failure!');
//     } else {
//       var data = JSON.parse(body);
//       // console.log('data:', data);
//       // console.log('data.access_token:', data.access_token);
//       var userData = {
//         name: data.user.display_name,
//         imageUrl: data.user.profile_picture_url,
//         email: data.user.email,
//         venmoAccessToken: data.access_token,
//         venmoRefreshToken: data.refresh_token,
//       };
//       // TODO: insert the above information into the database

//       res.end('Success!'); 
//     }
//   });
// });
// app.get('*', function(req, res) {
//   var pat = req.path
//   var a = pat.split("/").slice(2).join("/");
//   res.sendFile(path.resolve("client/" + a));
// })

// export the express app to be used in index.js
module.exports = app;

//Helper functions
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 

  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}
