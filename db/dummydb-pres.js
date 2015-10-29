var dummyArtists = [
  {
    name: 'DJ Kat',
    description: 'M-m-m-m-m-meow',
    email: 'kat@kat.com',
    password: 'katpass',
    artistUrl: 'https://en.wikipedia.org/wiki/Cat',
    imageUrl: 'http://res.cloudinary.com/dd2e2t0fb/image/upload/v1445536688/djCat_t5bugl.jpg',
    merchantAccountID: 'katMerchantAccountId',
  },
  {
    name: 'Piano Dog',
    description: 'I ain\'t nothin but a hound dog',
    email: 'dog@dog.com',
    password: 'dogpass',
    artistUrl: 'https://en.wikipedia.org/wiki/Dog',
    imageUrl: 'http://res.cloudinary.com/dd2e2t0fb/image/upload/v1445536691/pianoDog_lvspck.jpg',
    merchantAccountID: 'dogMerchantAccountId',
  },
  {
    name: 'The String Ferret',
    description: 'I\'m a ferret and I play the violin',
    email: 'ferret@ferret.com',
    password: 'ferretpass',
    artistUrl: 'https://en.wikipedia.org/wiki/Ferret',
    imageUrl: 'http://res.cloudinary.com/dd2e2t0fb/image/upload/v1445536693/ferretViolin_jgsm5j.jpg',
    merchantAccountID: 'ferretMerchantAccountId',
  },
  {
    name: 'Kitty Hendrix',
    description: 'I just want to rock and roll, man',
    email: 'kitty@kitty.com',
    password: 'kittypass',
    artistUrl: 'https://en.wikipedia.org/wiki/kitten',
    imageUrl: 'http://res.cloudinary.com/dd2e2t0fb/image/upload/v1446145375/kitty-hendrix_l3iwv1.jpg',
    merchantAccountID: 'kittyMerchantAccountId',
  },
  {
    name: 'Squirrley Gillespie',
    description: 'Check out my cheeks',
    email: 'squirrley@squirrley.com',
    password: 'squirrleypass',
    artistUrl: 'https://en.wikipedia.org/wiki/squirrel',
    imageUrl: 'http://res.cloudinary.com/dd2e2t0fb/image/upload/v1446145373/squirrley-gillespie_aebwpa.jpg',
    merchantAccountID: 'squirrleyMerchantAccountId',
  },
  {
    name: 'The Sanford Bulldogs',
    description: 'Winning is everything',
    email: 'bulldog@bulldog.com',
    password: 'bulldogpass',
    artistUrl: 'https://en.wikipedia.org/wiki/bulldog',
    imageUrl: 'http://res.cloudinary.com/dd2e2t0fb/image/upload/v1446145377/sanford-stadium-bulldog_q7lxk9.jpg',
    merchantAccountID: 'bulldogMerchantAccountId',
  },
];

var positions = [
  [33.9637373, -83.4096203], // the Foundry
  [33.9582286, -83.3799982], // 40 Watt Club
  [33.958339, -83.377194], // Georgia Theatre
  [33.960426, -83.3730553], // Classic Center
  [33.9582061, -83.3797291], // Flicker Theatre & Bar
  [33.9491796, -83.3734304], // Sanford Stadium
];

// var venues = [
//   'The Foundry',
//   'Watt Club',
//   'Georgia Theatre',
// ];

var dummyShows = [
  {
    venue: 'The Foundry',
    latitude: positions[0][0],
    longitude: positions[0][1],
    startTime: '2015-10-22 08:30:00',
    stopTime: '2015-11-22 22:00:00',
  },
  {
    venue: '40 Watt Club',
    latitude: positions[1][0],
    longitude: positions[1][1],
    startTime: '2015-10-22 08:30:00',
    stopTime: '2015-11-22 22:00:00',
  },
  {
    venue: 'Georgia Theatre',
    latitude: positions[2][0],
    longitude: positions[2][1],
    startTime: '2015-10-22 08:30:00',
    stopTime: '2015-11-22 22:00:00',
  },
  {
    venue: 'Classic Center',
    latitude: positions[3][0],
    longitude: positions[3][1],
    startTime: '2015-10-22 08:30:00',
    stopTime: '2015-11-22 22:00:00',
  },
  {
    venue: 'Flicker Theatre & Bar',
    latitude: positions[4][0],
    longitude: positions[4][1],
    startTime: '2015-10-22 08:30:00',
    stopTime: '2015-11-22 22:00:00',
  },
  {
    venue: 'Sanford Stadium',
    latitude: positions[5][0],
    longitude: positions[5][1],
    startTime: '2015-10-22 08:30:00',
    stopTime: '2015-11-22 22:00:00',
  },
];

var Sequelize = require('sequelize');
var sequelize = null;

if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  // var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres',
  });
} else {
  // the application is executed on the local machine ...
  var config = require('../server/config.js');
  sequelize = new Sequelize(config.db.db, config.db.user, config.db.password, {
    dialect:  'postgres',
    host: '127.0.0.1',
    port: 5432,
  });
}

global.db = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  artist: sequelize.import(__dirname + '/models/artist'),
  show: sequelize.import(__dirname + '/models/show'),

  // add your other models here
};

global.db.artist.associate(global.db);
global.db.show.associate(global.db);

// {force: true} drops tables before recreating them
sequelize.sync({force: true}).then(function() {
  dummyArtists.forEach(function(dummy, index) {
    global.db.artist.create(dummy)
    .then(function(artist) {
      global.db.show.create(dummyShows[index])
      .then(function(show) {
        show.setArtist(artist);
      });
    });
  });
});

// might need to put this somewhere to fix hang... seems to fix but
// somehow causes data not to be loaded right in app though.

// .then(function() {
//   process.exit(0);
// });
