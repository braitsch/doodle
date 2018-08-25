
/**
 * Node.js Doodle Server
 * Author :: Stephen Braitsch
 */

var express = require('express');
var app = express();
var server  = require('http').createServer(app);

// create the single instance of socket.io that will be shared across all applications //
global.io = require('socket.io').listen(server);

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'pug');
app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
app.use(express.static(__dirname + '/app/public'));

require('./app/server/routes')(app);

server.listen(app.get('port'), function(){
	console.log('Express app listening at http://%s:%s', server.address().address, server.address().port);
});
