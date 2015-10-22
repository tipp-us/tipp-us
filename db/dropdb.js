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

// {force: true} drops tables
sequelize.sync({force: true});

// might need to put this in to fix hang... somehow causes
// data not to be loaded right in app though.

// .then(function() {
//   process.exit(0);
// });
