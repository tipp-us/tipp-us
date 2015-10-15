var Sequelize = require('sequelize');

var sequelize = new Sequelize('development', 'Username', null, {
  host: 'localhost',
  dialect: 'postgres',
  define: {
    timestamps: false,
  },
});

module.exports.database = sequelize;
