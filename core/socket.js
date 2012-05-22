
//var db = require('./db.js');

var io, clients = {};
var appName = 'doodle';

module.exports = function(sio) { io = sio; io.on('connection', registerSocket); };
module.exports.init = function(){};

// --- events and callbacks unique to this application //

function addEventHandlers(socket)
{
	socket.on('draw-data', function(data) { onCustomEvent(socket, data); });		
}
 
function onCustomEvent(socket, data)
{
// append this socket's id so we know who is talking //
	data.id = socket.id;
	socket.broadcast.emit('draw-data', data);
}


// --- general connection methods used by all applications --- //

function registerSocket(socket)
{
// listen for connections events //
	onSocketConnect(socket);
	socket.on('disconnect', function() { onSocketDisconnect(socket); });
}

function onSocketConnect(socket)
{
	if (socket.handshake.headers.host.indexOf(appName) != -1){
		console.log('connecting ---', socket.handshake.headers.host);
		addEventHandlers(socket);
		// dispatch to clients //		
		clients[socket.id] = {};
		io.sockets.emit(appName + '-status', { connections:clients });
	}
}

function onSocketDisconnect(socket)
{	
	if (socket.handshake.headers.host.indexOf(appName) != -1){
		console.log('disconnecting --- ', socket.handshake.headers.host, socket.id)
		// dispatch to clients //
		delete clients[socket.id];
		io.sockets.emit(appName + '-status', { connections:clients });
	}
}



// database stuff -- todo //

return;

db.addListener('database-connected', onDatabaseConnected);
db.addListener('collection-set', onCollectionSet);
db.addListener('record-read', onRecordRead);
db.addListener('record-updated', onRecordUpdated);

function onDatabaseConnected()
{
	db.setCollection('clients');
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