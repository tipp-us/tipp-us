var app = require('./server.js');
var passport = require('passport');

var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;

var facebookAppId;
var facebookAppSecret;
var facebookCB;

if (process.env.NODE_MODE === 'prod') {
  // Running on Heroku production server
  facebookAppId = process.env.FACEBOOK_APP_ID;
  facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
  facebookCB = 'http://tipp.us/auth/facebook/callback';
} else if (process.env.NODE_MODE === 'staging') {
  // Running on Heroku staging server
  facebookAppId = process.env.FACEBOOK_APP_ID;
  facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
  facebookCB = 'http://tipp-us-staging.herokuapp.com/auth/facebook/callback';
} else {
  // running locally
  var config = require('./config.js');
  facebookAppId = config.facebook.app_id;
  facebookAppSecret = config.facebook.app_secret;
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
    clientID: facebookAppId,
    clientSecret: facebookAppSecret,
    callbackURL: facebookCB,
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      db.artist.findOne({where: {facebookID: profile.id}}).then(function(artist) {
        // If no artist found with this id, create one
        if (!artist) {
          db.artist.create({
            facebookID: profile.id,
          }).then(function(art) {
            profile.artistId = art.id;
            return done(null, profile);
          });
        } else {
          profile.artistId = artist.id;
          return done(null, profile);
        }
      });
    });
  }
));

// Signup strategy for local email and password
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    db.artist.findOne({where: {email: email}}).then(function(artist) {
      if (artist) {
        // Artist with this email already exists
        return done(null, false);
      } else {
        db.artist.genHash(password, function(hash) {
          db.artist.create({
            email: email,
            password: hash,
          }).then(function(newArtist) {
            // Create new artist record
            var recreated = JSON.parse(JSON.stringify(newArtist.dataValues));
            recreated.artistId = recreated.id;
            return done(null, recreated);
          });
        });
      }
    });
  }
));

// Login strategy for local email and password
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, function(req, email, password, done) {
  db.artist.findOne({where:{email: email}}).then(function(artist) {
    if (!artist) {
      // No artist found with this email
      return done(null, false);
    } else {
      db.artist.verifyPassword(artist, password, function(isVerified) {
        if (isVerified) {
          // User credentials matched
          artist.artistId = artist.dataValues.id;
          artist.dataValues.artistId = artist.dataValues.id;
          return done(null, artist);
        } else {
          // Email exists, but password incorrect
          return done(null, false);
        }
      });
    }
  });
}));

// Initialize Passport!  Also use passport.session() middleware, to support
//  persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

// Redirect user to facebook.com. After authorization, Facebook will
//  redirect the user back to this application at /auth/facebook/callback
app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res) {
    // Request will be redirected to Facebook for authentication, so this
    //  function will not be called.
  });

// If authentication fails, the user will be redirected back to the
//  login page.  Otherwise, the primary route function function will be called,
//  which, in this example, will redirect the user to the home page.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/#/login' }),
  function(req, res) {
    res.redirect('/#/edit');
  });

app.post('/rn/auth/facebook', function(req, res) {
  var fbid = req.body.facebookId;
  db.artist.findOne({where: {facebookID: fbid}})
    .then(function(artist) {
      // If no artist found with this id, create one
      if (!artist) {
        db.artist.create({
          facebookID: fbid,
        }).then(function(art) {
          res.status(201).json({id: art.id});
        });
      } else {
        res.status(200).json({id: artist.id});
      }
    });
});
