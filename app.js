
/**
 * Node.js Doodle Server
 * Author :: Stephen Braitsch
 */

var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);

global.host = 'localhost';
global.socket = require('socket.io').listen(server);
global.socket.set('log level', 1);
global.socket.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);

app.root = __dirname;

app.configure(function(){
	app.set('port', 8080);
	app.set('views', app.root + '/app/server/views');
	app.set('view engine', 'jade');
	app.locals.pretty = true;
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(require('stylus').middleware({ src: app.root + '/app/public' }));
	app.use(express.static(app.root + '/app/public'));
});

require('./app/server/router')(app);

server.listen(app.get('port'), function(){
	console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});