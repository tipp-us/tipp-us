module.exports = function(sequelize, DataTypes) {
  var Artist = sequelize.define('Artist', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    artistUrl: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
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
