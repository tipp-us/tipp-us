var app = require('./server');
var passport = require('passport');
var helpers = require('./helpers.js');
var braintree = require('braintree');
var cloudinary = require('cloudinary');

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
} else { // running locally
  var config = require('./config.js');
  gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: config.braintree.merchantId,
    publicKey: config.braintree.publicKey,
    privateKey: config.braintree.privateKey,
  });
  cloudinary.config(config.cloudConfig);
}

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
  if (!req.user) {
    res.status(403);
    return;
  }

  db.artist.findOne({where: {id: req.user.artistId}}).then(function(artist) {
    if (!artist) {
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
    });
  });
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
  var picWidth = req.body.width || 50;
  var picHeight = req.body.height || 50;
  var position = req.body.position;

  db.show.findAll({include: [db.artist]}).then(function(shows) {
    var closest = [];
    for (var i = 0; i < shows.length; i++) {
      var show = shows[i].dataValues;
      var artist = show.Artist;
      if (artist) {
        var now = new Date(Date.now());
        if (show.startTime < now && now < show.stopTime) {
          var dist = helpers.getDistanceFromLatLonInKm(position.lat, position.long, show.latitude, show.longitude) / 1.60934;
          var splits = artist.imageUrl.split('/');
          // crops picture to desired width and height
          splits[splits.length - 2] = 'w_' + picWidth + ',h_' + picHeight + ',c_fill';
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
    }

    closest = closest.sort(function(one, two) {
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
  console.log(user)
  if (!user) {
    res.status(403);
  }

  db.artist.findOne({
    where: {id: user.artistId},
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
  // Escape dangerous characters from user input
  req.sanitize('name').escape();
  req.sanitize('description').escape();
  req.sanitize('email').escape();
  req.sanitize('url').escape();
  req.sanitize('pass').escape();
  var data = req.body;
  db.artist.findOne({
    where: {id: req.user.artistId},
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
      if (url) {
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
  if (!user) {
    res.status(403);
    return;
  }

  // Show auth and check authed user email instead of sent ID
  db.artist.findOne({where: {id: user.artistId}}).then(function(artist) {
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
    res.json(result);
  });
});

app.post('/submerchant', function(req, res) {
  gateway.merchantAccount.create(req.body.submerchantInfo, function(err, result) {
    if (err) {
      console.log(err);
    }

    res.json(result);
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
