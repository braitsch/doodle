
var io;
var db = require('./db.js');
var numConnections = 0;

module.exports = function(app) 
{
	io = require('socket.io').listen(app);
	io.set('log level', 1);	
	io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
	io.sockets.on('connection', onSocketConnect);
}

function onSocketConnect(socket)
{
	numConnections++; 
// add listeners //
	socket.on('cnt', onSocketData);
	socket.on('disconnect', onSocketDisconnect);
// dispatch current state //	
	dispatchStatus();
}

function onSocketDisconnect(socket)
{
	numConnections--;
	dispatchStatus();
}

function onSocketData(data)
{
	db.updateRecord({id:1}, {counter:data.val});
}

function dispatchStatus()
{
	db.readRecord({id:1});
}

// database stuff //

db.addListener('database-connected', onDatabaseConnected);
db.addListener('collection-set', onCollectionSet);
db.addListener('record-read', onRecordRead);
db.addListener('record-updated', onRecordUpdated);

function onDatabaseConnected()
{
	db.setCollection('table-1');
}

function onCollectionSet()
{
	db.listCollection();	
}

function onRecordRead(o)
{
	io.sockets.emit('status', { ct: o.counter, nc:numConnections });		
}

function onRecordUpdated(o)
{
	io.sockets.emit('status', { ct: o.counter, nc:numConnections });		
}