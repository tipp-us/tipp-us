var config = require('../server/config.js');

if (!global.hasOwnProperty('db')) {
  var Sequelize = require('sequelize');
  var sequelize = null;

  if (process.env.DATABASE_URL) {
    // the application is executed on Heroku ... use the postgres database
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect:  'postgres',
      protocol: 'postgres',
      port:     match[4],
      host:     match[3],
      logging:  true, //false
    });
  } else {
    // the application is executed on the local machine ...
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

  // global.db.artist.hasMany(global.db.show);
  // global.db.show.belongsTo(global.db.artist);

  global.db.artist.associate(global.db);
  global.db.show.associate(global.db);


  sequelize.sync().then(function() {
    // global.db.artist.create({
    //   name: "Joebo",
    //   email: "joe@joe.com",
    //   password: "asdf",
    //   imageUrl: "http://res.cloudinary.com/dalft4dfx/image/upload/h_300,w_300/l3TcPFO_yyjcr2.jpg",
    // })
    // global.db.show.create({
    //   venue: "somefLfsdocaftion",
    //   latitude: 360.7761589,
    //   longitude: -71.3090285,
    //   ArtistId: 5,
    // })
  });

  /*
    Associations can be defined here. E.g. like this:
    global.db.User.hasMany(global.db.SomethingElse)
  */

}

module.exports = global.db;

// var Sequelize = require('sequelize');

// var sequelize = new Sequelize('tipdb', 'postgres', 'postgres', {
//   dialect: 'postgress',
//   protocol: 'postgres',
//   host: '127.0.0.1',
//   port: 5432,
// });

// var User = sequelize.define('user', {
//   firstName: {
//     type: Sequelize.STRING,
//     field: 'first_name', // Will result in an attribute that is firstName when user facing but first_name in the database
//   },
//   lastName: {
//     type: Sequelize.STRING,
//   },
// }, {
//   freezeTableName: true, // Model tableName will be the same as the model name
// });

// User.sync({force: true}).then(function() {
//   // Table created
//   return User.create({
//     firstName: 'John',
//     lastName: 'Hancock',
//   });
// });

// var db = {
//   Sequelize: Sequelize,
//   sequelize: sequelize,
//   user: User,
// };

// module.exports = db;
