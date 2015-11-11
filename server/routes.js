var app = require('./server');
var passport = require('passport');
var helpers = require('./helpers.js');
var braintree = require('braintree');

var gateway;

// if running on Heroku
if (process.env.BRAINTREE_MERCHANTID) {
  gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANTID,
    publicKey: process.env.BRAINTREE_PUBLICKEY,
    privateKey: process.env.BRAINTREE_PRIVATEKEY,
  });
} else { // running locally
  var config = require('./config.js');
  gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: config.braintree.merchantId,
    publicKey: config.braintree.publicKey,
    privateKey: config.braintree.privateKey,
  });
}

// Get info of single artist
app.get('/artists/id/:id', function(req, res) {
  var artistId = req.params.id;
  db.artist.findOne({where: {id: artistId}, include: [db.show]})
    .then(function(artist) {

      if (artist === null) {
        res.status(404).end('ArtistID ' + artistId + ' not found.');
      }
      var currentShow = null;
      for(var i = 0; i < artist.Shows.length; i++) {
        var show = artist.Shows[i];
        var now = new Date(Date.now());
        if (show.startTime < now && now < show.stopTime) {
          currentShow = show;
          break;
        }
      }
      var send = {
        id: artist.id,
        name: artist.name,
        pic: artist.imageUrl,
        email: artist.email,
        artistUrl: artist.artistUrl,
        venue: artist.venue,
      }
      if(currentShow) {
        send.position =  {
          lat: show.latitude,
          long: show.longitude,
        }
        send.venue = show.venue;
      } 
      res.status(200).json(send);
    });
});

// Get names and IDs for all artists in db
app.get('/artists', function(req, res) {
  db.artist.findAll({
    attributes: ['id', 'name'],
  }).then(function(artists) {
    res.status(200).json(artists);
  });
});

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

// Get list of nearby artists
app.get('/artists/nearby', function(req, res) {
  console.log(req.query);
  var numArtists = req.query.numberOfArtists || 3;
  var picWidth = req.query.width || 50;
  var picHeight = req.query.height || 50;
  var position = {
    lat: req.query.lat,
    long: req.query.long,
  };

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

app.get('/edit/artist', function(req, res) {
  var user = req.user;
  console.log(user)
  if (!user) {
    res.status(403);
  }
  db.artist.findOne({
    where: {id: user.artistId},
  }).then(function(artist) {
    console.log(artist.artistId)
    res.status(200).json({
      name: artist.name,
      description: artist.description,
      email: artist.email,
      url: artist.artistUrl,
    });
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
      res.end('Success', 200);
    });
  });
});

app.get('/upcomingShows', function(req, res) {
  var artistId = req.session.passport.user.artistId;

  db.artist.findOne({where: {id: artistId}, include: [db.show]})
    .then(function(artist) {

      if (artist === null) {
        res.status(404).end('ArtistID ' + artistId + ' not found.');
      }

      res.status(200).json(artist.Shows);
    });
});

app.get('/rn/edit/artist/id/:id', function(req, res) {
  var artistId = req.params.id;
  db.artist.findOne({
    where: {id: artistId},
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
  req.sanitize('pass').escape();
  var data = req.body;
  db.artist.findOne({
    where: {id: req.user.artistId},
  }).then(function(artist) {
    artist.name = data.name;
    artist.description = data.description;
    artist.password = data.pass;
    artist.email = data.email;

    //Check to see if new url is already used by someone
    artist.artistUrl = data.url;
    if(data.imageUrl) {
      artist.imageUrl = data.imageUrl;
    }

    artist.save().then(function() {
      res.end('Success', 200);
    });
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
      res.end('Success', 200);
    });
  });
});

app.post('/rn/shows/add', function(req, res) {
  var data = req.body;

  if (!data.user) {
    res.status(403);
    return;
  }

  // Show auth and check authed user email instead of sent ID
  db.artist.findOne({where: {id: data.user.id}}).then(function(artist) {
    db.show.create({
      venue: data.venue,
      latitude: data.lat,
      longitude: data.long,
      startTime: data.start,
      stopTime: data.end,
    }).then(function(show) {
      show.setArtist(artist);
      show.save();
      res.end('Success', 200);
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

// react-native android local create artist
app.post('/rn/create/artist',
  passport.authenticate('local-signup', { failureRedirect: '/#/signup' }),
  function(req, res) {
    res.status(200).json({id: req.user.artistId});
  });

// react-native android local login
app.post('/rn/login/artist',
  passport.authenticate('local-login', { failureRedirect: '/#/login' }),
  function(req, res) {
    res.status(200).json({id: req.user.artistId});
  });

// react-native android edit artist
app.post('/rn/edit/artist', function(req, res) {
  var user = req.body.user;
  // Escape dangerous characters from user input
  req.sanitize('name').escape();
  req.sanitize('description').escape();
  req.sanitize('email').escape();
  req.sanitize('url').escape();
  req.sanitize('pass').escape();
  var data = req.body;
  db.artist.findOne({
    where: {id: user.id},
  }).then(function(artist) {
    artist.name = data.name;
    artist.description = data.description;
    artist.password = data.pass;
    artist.email = data.email;

    //Check to see if new url is already used by someone
    artist.artistUrl = data.url;
    if(data.imageUrl) {
      artist.imageUrl = data.imageUrl;
    }

    artist.save().then(function() {
      res.end('Success', 200);
    });
  }).catch(function(err) {
    res.status(400).json({error: err});
  });
});
