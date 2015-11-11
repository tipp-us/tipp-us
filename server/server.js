// express app initialization
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var util = require('util');
var morgan = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var db = require('../db/config.js');
var validator = require('express-validator');

/*===========================================================================/
/                             MIDDLEWARE                                     /
/===========================================================================*/

app.use(express.static(__dirname + '/../client'));
app.use(morgan('dev'));
app.use(cookieParser('keyboard cat'));
app.use(bodyParser.json());
app.use(validator([])); // this line must be immediately after express.bodyParser()!
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: false,
  resave: true,
}));

/*
 * Enable CORS (http://enable-cors.org/server_expressjs.html)
 * to allow different clients to request data from your server
 */
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// export the express app to be used in index.js
module.exports = app;
