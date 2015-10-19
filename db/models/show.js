module.exports = function(sequelize, DataTypes) {
  var Show = sequelize.define('Show', {
    venue: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    startTime: DataTypes.DATE,
    stopTime: DataTypes.DATE,

  }, {classMethods: {
      associate: function(models) {
        Show.belongsTo(models.artist);
      },
    },
  });

  return Show;
};
