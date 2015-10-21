module.exports = function(sequelize, DataTypes) {
  var Artist = sequelize.define('Artist', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    artistUrl: DataTypes.STRING,
    imageUrl: {type: DataTypes.STRING, allowNull: false, defaultValue: "http://res.cloudinary.com/dalft4dfx/image/upload/v1445395326/default_bz6sxy.png"},
    merchantAccountID: DataTypes.STRING,

  }, {classMethods: {
      associate: function(models) {
        Artist.hasMany(models.show);
      },
      // verifyPassword: function()......
    },
  });

  return Artist;
};
