

var SM = require('./socket-manager');
	SM.init('doodle')

var onSocketDrawData = function(socket, data)
{
// append this socket's id so we know who is talking //
	data.id = socket.id;
	socket.broadcast.emit('draw-data', data);
}

SM.onConnect = function(socket)
{
	socket.on('draw-data', function(data) { onSocketDrawData(socket, data); });	
}

SM.onDisconnect = function(socket)
{
//	console.log('socket '+socket.id+' disconnected----!!!');
}