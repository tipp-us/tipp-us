var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var Artist = sequelize.define('Artist', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    artistUrl: DataTypes.STRING,
    imageUrl: {type: DataTypes.STRING, allowNull: false, defaultValue: 'http://res.cloudinary.com/dalft4dfx/image/upload/v1445395326/default_bz6sxy.png'},
    merchantAccountID: DataTypes.STRING,

  }, {classMethods: {
      associate: function(models) {
        Artist.hasMany(models.show);
      },

      genHash: function(password, cb) {
        return bcrypt.hash(password, null, null, function(err, hash) {
          if (err) console.log(err);
          else return cb(hash);
        });
      },

      verifyPassword: function(artist, password, cb) {
        // TODO: there must be a way to use this or this.instance or something
        // instead of passing in the artist that we found

        return bcrypt.compare(password, artist.get('password'), function(err, res) {
          if (err) console.log('Error:', err);
          else return cb(res);
        });
      },
    },
  });

  return Artist;
};
