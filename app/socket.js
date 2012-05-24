
//var db = require('./db.js');

module.exports = function(app) { 

	app.io.set('onConnect', onSocketConnect);
	
};

function onSocketConnect(socket)
{
	socket.on('draw-data', function(data) { onSocketDrawData(socket, data); });		
}
 
function onSocketDrawData(socket, data)
{
// append this socket's id so we know who is talking //
	data.id = socket.id;
	socket.broadcast.emit('draw-data', data);
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