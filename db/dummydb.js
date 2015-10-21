var dummyArtists = [
  {
    name: 'The Dougs',
    description: 'We are the best band ever',
    email: 'doug@doug.com',
    password: 'dougpass',
    artistUrl: 'https://github.com/dougshamoo',
    imageUrl: 'http://res.cloudinary.com/dd2e2t0fb/image/upload/v1445391525/dougGithub_hxosqq.jpg',
    merchantAccountID: 'dougMerchantAccountId',
  },
  {
    name: 'The Kevins',
    description: 'Sometimes we eat kale salad... it\'s a California thing...',
    email: 'kevin@kevin.com',
    password: 'kevinpass',
    artistUrl: 'https://github.com/LeKeve',
    imageUrl: 'http://res.cloudinary.com/dd2e2t0fb/image/upload/v1445391531/kevinGithub_eizbkb.jpg',
    merchantAccountID: 'kevinMerchantAccountId',
  },
  {
    name: 'The Taylors',
    description: 'Cats and Oauth music... all day long',
    email: 'taylor@taylor.com',
    password: 'taylorpass',
    artistUrl: 'https://github.com/taylorhayduk',
    imageUrl: 'http://res.cloudinary.com/dd2e2t0fb/image/upload/v1445391530/taylorGithub_rrjw6c.jpg',
    merchantAccountID: 'taylorMerchantAccountId',
  },
  {
    name: 'The Joes',
    description: 'Just going with the flow........js.',
    email: 'joe@joe.com',
    password: 'joepass',
    artistUrl: 'https://github.com/Joby890',
    imageUrl: 'http://res.cloudinary.com/dd2e2t0fb/image/upload/v1445391527/joeGithub_sh3tb2.jpg',
    merchantAccountID: 'joeMerchantAccountId',
  },
  {
    name: 'The Rods',
    description: 'I saw Jennifer Aniston the other day... seriously.',
    email: 'rod@rod.com',
    password: 'rodpass',
    artistUrl: 'https://github.com/rodmachen',
    imageUrl: 'http://res.cloudinary.com/dd2e2t0fb/image/upload/v1445391528/rodGithub_abotrq.jpg',
    merchantAccountID: 'rodMerchantAccountId',
  },
];

var positions = [
  [41.89149298, -109.35901575],
  [33.95899073, -115.15500719],
  [39.90416884, -92.45337418],
  [33.21950037, -104.79354014],
  [42.29755619, -83.3433896],
  [34.48904037, -112.59189238],
  [31.32136873, -116.08204764],
  [38.55855265, -107.33866268],
  [34.00503694, -111.15253215],
  [41.40275112, -115.70101893],
];

var dummyShows = [
  {
    venue: 'Burger King',
    latitude: positions[0][0],
    longitude: positions[0][1],
    startTime: '2015-10-19 18:30:00-08',
    stopTime: '2015-10-19 22:00:00-08',
  },
  {
    venue: 'McDonald\'s',
    latitude: positions[1][0],
    longitude: positions[1][1],
    startTime: '2015-10-19 18:30:00-08',
    stopTime: '2015-10-19 22:00:00-08',
  },
  {
    venue: 'Carl\'s Jr.',
    latitude: positions[2][0],
    longitude: positions[2][1],
    startTime: '2015-10-19 18:30:00-08',
    stopTime: '2015-10-19 22:00:00-08',
  },
  {
    venue: 'Jack in the Box',
    latitude: positions[3][0],
    longitude: positions[3][1],
    startTime: '2015-10-19 18:30:00-08',
    stopTime: '2015-10-19 22:00:00-08',
  },
  {
    venue: 'Wendy\'s',
    latitude: positions[4][0],
    longitude: positions[4][1],
    startTime: '2015-10-19 18:30:00-08',
    stopTime: '2015-10-19 22:00:00-08',
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
