// express app initialization
var express = require('express');
var app = express();

// attach middleware, for example: 
//  app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));


// add routes to handle GETs and POSTs


// export the express app to be used in index.js
module.exports = app;
