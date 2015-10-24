var app = require('./server.js');
var passport = require('passport');

var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;

var facebookAppId;
var facebookAppSecret;
var facebookCB;


// Instantiate the braintree gateway.
// Note: Must change these values for production

// if running on Heroku
if (process.env.BRAINTREE_MERCHANTID) {

  // For venmo auth:
  // venmoId = process.env.VENMO_CLIENT_ID;
  // venmoSecret = process.env.VENMO_CLIENT_SECRET;
  facebookAppId = process.env.FACEBOOK_APP_ID;
  facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
  facebookCB = 'http://starvingartists-staging.herokuapp.com/auth/facebook/callback';
} else { // running locally
  var config = require('./config.js');
  
  // For venmo auth:
  // venmoId = config.venmo.client_id;
  // venmoSecret = config.venmo.client_secret;
  facebookAppId = config.facebook.app_id;
  facebookAppSecret = config.facebook.app_secret;
  facebookCB = 'http://localhost:3000/auth/facebook/callback';
}

// For venmo auth:
// var request = require('request');
// var venmoId, venmoSecret;

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
      if (!artist) {
        db.artist.create({
          facebookID: req.user.id,
        }).then(function(art) {
          console.log('Created new artist');
        });
      }
    });

    res.redirect('/#/edit');
  });
