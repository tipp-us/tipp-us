var app = require('./server/server.js');
var routes = require('./server/routes.js');
var auth = require('./server/auth.js');

var port = process.env.PORT || 3000;

var server = app.listen(port, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
