
var io;
var db = require('./db.js');
var connections = {};

module.exports = function(app) 
{
	io = require('socket.io').listen(app);
	io.set('log level', 1);	
  	io.set('transports', ['xhr-polling']);
  	io.set("polling duration", 10);
//	io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
	io.sockets.on('connection', onSocketConnect);
}

function onSocketConnect(socket)
{
	socket.on('draw-data', function(data){
// append this socket's id so we know who is talking //
		data.id = socket.id;
		socket.broadcast.emit('draw-data', data);		
	});
	socket.on('disconnect', function(){
// dispatch connections //
		delete connections[socket.id];
		io.sockets.emit('status', { connections:connections });
	});
// dispatch connections //
	connections[socket.id] = {};
	io.sockets.emit('status', { connections:connections });
}

// database stuff //

db.addListener('database-connected', onDatabaseConnected);
db.addListener('collection-set', onCollectionSet);
db.addListener('record-read', onRecordRead);
db.addListener('record-updated', onRecordUpdated);

function onDatabaseConnected()
{
	db.setCollection('connections');
}

function onCollectionSet()
{
//	db.listCollection();	
}

function onRecordRead(o)
{
//	io.sockets.emit('status', { nc:numConnections });		
}

function onRecordUpdated(o)
{
//	io.sockets.emit('status', { nc:numConnections });		
}