
/**
 * Node.js Socket Server
 * Author :: Stephen Braitsch
 */

var express = require('express');
var app = module.exports = express.createServer(),
	io = require('socket.io').listen(app);
	io.set('log level', 1);	
	io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
app.settings.root = __dirname;

require('./config/env.js')(app, express);
require('./config/router.js')(app);

app.listen(8080, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

// simple counter recording across multiple clients //
var n = 0;
var t = 0;
io.sockets.on('connection', function (socket) {
	socket.emit('cnt', { val: n });
 	socket.on('cnt', function (data) {
		n = data.val; io.sockets.emit('cnt', data);
  	});
	socket.on('disconnect', function(){
		t--; io.sockets.emit('num-connections', { val: t });
  	});
	t++; io.sockets.emit('num-connections', { val: t });	
});