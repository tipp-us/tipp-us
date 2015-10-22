// express app initialization
var express = require('express');
var app = express();
var path = require('path');
var braintree = require('braintree');
var bodyParser = require('body-parser');
var util = require('util');
var morgan = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var db = require('../db/config.js');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;

// For venmo auth:
// var request = require('request');
// var venmoId, venmoSecret;

var cloudinary = require('cloudinary');

var facebookAppId;
var facebookAppSecret;
var facebookCB;

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
  facebookAppId = process.env.FACEBOOK_APP_ID;
  facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
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
  facebookAppId = config.facebook.app_id;
  facebookAppSecret = config.facebook.app_secret;
  facebookCB = 'http://localhost:3000/auth/facebook/callback';
}

/*===========================================================================/
/                             MIDDLEWARE                                     /
/===========================================================================*/

// attach middleware
app.use(express.static(__dirname + '/../client'));
app.use(morgan('dev'));
app.use(cookieParser('keyboard cat'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(methodOverride());
app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: false,
  resave: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/**
 * Enable CORS (http://enable-cors.org/server_expressjs.html)
 * to allow different clients to request data from your server
 */
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected. If
// the request is authenticated (typically via a persistent login session),
// the request will proceed. Otherwise, the user will be redirected to the
// login page.
var ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/#/login');
};
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
    clientID: facebookAppId,
    clientSecret: facebookAppSecret,
    callbackURL: facebookCB,
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function() {

      // TODO: associate the Facebook account with a user record in
      // database, and return that user instead.
      return done(null, profile);
    });
  }
));

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    db.artist.findOne({where: {email: email}}).then(function(artist) {
      // TODO: error handling maybe
      if (artist) {
        console.log('This email has already been registered.');
        return done(null, false);
      } else {
        db.artist.genHash(password, function(hash) {
          db.artist.create({
            email: email,
            password: hash,
          }).then(function(newArtist) {
            return done(null, newArtist);
          });
        });
      }
    });
  }
));

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, function(req, email, password, done) {
  db.artist.findOne({where:{email: email}}).then(function(artist) {
    // TODO: error handling maybe
    if (!artist) {
      console.log('No artist with that email found.');
      return done(null, false);
    } else {
      db.artist.verifyPassword(artist, password, function(isVerified) {
        if (isVerified) {
          console.log('User credentials matched locally!');
          return done(null, artist);
        } else {
          console.log('Incorrect password, try again.');
          return done(null, false);
        }
      });
    }

  });
}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

// Redirect user to facebook.com. After authorization, Facebook will
// redirect the user back to this application at /auth/facebook/callback
app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res) {
    // Request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

// If authentication fails, the user will be redirected back to the
// login page.  Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/#/login' }),
  function(req, res) {
    db.artist.findOne({where: {facebookID: req.user.id}}).then(function(artist) {
      //if we did not find a artist with that ID create one
      if(!artist) {
        db.artist.create({
          facebookID: req.user.id,
        }).then(function(art) {
          console.log("Created new artist")
        })
      }
    })
    res.redirect('/#/edit');
  });

// TODO: Get rid of unnecessary redirects maybe, handled by angular
app.post('/create/artist',
  passport.authenticate('local-signup', { failureRedirect: '/#/signup' }),
  function(req, res) {
    res.redirect('/#/edit');
  });

app.post('/login/artist',
  passport.authenticate('local-login', { failureRedirect: '/#/login' }),
  function(req, res) {
    res.redirect('/#/edit');
  });

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
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

app.post('/shows/startNow', function(req, res) {
  var stopTime = new Date();
  stopTime.setHours(stopTime.getHours() + 3);
  if(!req.user) {
    res.status(403);
    return;
  }
  db.artist.findOne({where: {facebookID: req.user.id}}).then(function(artist) {
    if(!artist) {
      res.status(403);
      return;
    }
    db.show.create({
      latitude: req.body.lat,
      longitude: req.body.long,
      startTime: Date.now(),
      stopTime: stopTime,
    }).then(function(show) {
      show.setArtist(artist);
      show.save();
    })
  })
});

// Get info of single artist
app.post('/artist', function(req, res) {
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
});

// Get list of specified number of nearby artists
app.post('/nearby', function(req, res) {
  var numArtists = req.body.numberOfArtists || 3;
  var position = req.body.position;

  db.show.findAll({include: [db.artist]}).then(function(shows) {
    var closest = [];
    for (var i = 0; i < shows.length; i++) {
      var show = shows[i].dataValues;
      var artist = show.Artist;
      if(artist) {
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

// app.post('/create/artist', function(req, res) {

//   // TODO: fill in necessary fields to create a user
//   var artistData = {
//     email: req.body.email,
//     password: req.body.password,
//   };

//   // TODO: Check to see if we need this, probably won't after
//   // implementing local auth strategy
//   db.artist.findOne({
//     where: {email: artistData.email},
//   }).then(function(artist) {
//     if (artist) {
//       res.status(200).end('Sorry, email already registered');
//     } else {
//       db.artist.create(artistData).then(function(artist) {
//         res.status(201).json(artist);
//       });
//     }
//   });
// });
app.get('/edit/artist', function(req, res) {
  var user = req.user;
  if(!user) {
    res.status(403);
  }
  db.artist.findOne({
    where: {facebookID: user.id},
  }).then(function(artist) {
    res.status(200).json({
      name: artist.name,
      description: artist.description,
      email: artist.email,
      url: artist.artistUrl,
    });
  });
});

// Edit an already created artist page
app.post('/edit/artist', function(req, res) {
  var user = req.user;
  console.log(user)
  var data = req.body;
  db.artist.findOne({
    where: {facebookID: req.user.id},
  }).then(function(artist) {
    if (data.image) {
      cloudinary.uploader.upload(data.image, function(result) {

        // wait for image to upload!
        finish(result.url);
      });
    } else {
      finish();
    }

    function finish(url) {
      artist.name = data.name;
      artist.description = data.description;
      artist.password = data.pass;
      artist.email = data.email;
      //Check to see if new url is already used by someone
      artist.artistUrl = data.url;
      if(url) {
        artist.imageUrl = url;
      }
      artist.save().then(function() {
        res.end('Success', 200);
      });
    }
  }).catch(function(err) {
    res.status(400).json({error: err});
  });
});

app.post('/shows/add', function(req, res) {
  var user = req.user;
  var data = req.body;
  if(!user) {
    res.status(403);
    return;
  }
  // Show auth and check authed user email instead of sent ID
  db.artist.findOne({where: {facebookID: user.id}}).then(function(artist) {
    db.show.create({
      venue: data.venue,
      latitude: data.lat,
      longitude: data.long,
      startTime: data.start,
      stopTime: data.end,
    }).then(function(show) {
      show.setArtist(artist);
      show.save();
    });
  });
});

// Send a braintree client token to client
app.get('/client_token', function(req, res) {
  gateway.clientToken.generate({}, function(err, response) {
    res.json({clientToken: response.clientToken});
  });
});

// Receive a braintree payment method nonce from client
app.post('/checkout', function(req, res) {
  var transaction = req.body;

  // For a list of static test nonces, visit:
  //  https://developers.braintreepayments.com/javascript+node/reference/general/testing
  var nonce = transaction.payment_method_nonce;

  // use payment method nonce here, test example below
  gateway.transaction.sale({
    amount: transaction.amount || '5.00', // TODO: remove, default value for testing

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

app.post('/submerchant', function(req, res){
  console.log(req.body);
  gateway.merchantAccount.create(req.body.submerchantInfo, function(err, result){
    if(err){
      console.log(err);
    }
    console.log(result);
  });
});

// // Venmo auth and callback for auth token
// app.get('/auth/venmo', function(req, res) {
//   // redirect to auth with venmo, which will redirect back to /auth/venmo/callback with an auth code
//   res.redirect('https://api.venmo.com/v1/oauth/authorize?client_id=' + venmoId + '&scope=make_payments%20access_profile%20access_email&response_type=code');
// });

// app.get('/auth/venmo/callback', function(req, res) {
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

//Helper functions
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// export the express app to be used in index.js
module.exports = app;
