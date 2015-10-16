module.exports = function(sequelize, DataTypes) {
  var Artist = sequelize.define('User', {
    id: { type: DataTypes.STRING, primaryKey: true},
    id: DataTypes.STRING,?
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
    },
  });

  return Artist;
};
