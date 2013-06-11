

module.exports = function()
{
	
	var connections = { };
	
	global.socket.of('/doodle').on('connection', function(socket) {
		socket.on('draw-data', function(data) {
		// append this socket's id so we know who is talking //
			data.id = socket.id;
			socket.broadcast.emit('draw-data', data);
		});

		function dispatchStatus()
		{
			brodcastMessage('status', connections);
		}
		
		function brodcastMessage(message, data)
		{
	//	remove socket.emit if you don't want the sender to receive their own message //
			socket.emit(message, data);
			socket.broadcast.emit(message, data);
		}
		
	// handle connections & disconnections //
		connections[socket.id] = {}; dispatchStatus();
		socket.on('disconnect', function() {
			delete connections[socket.id]; dispatchStatus();
		});

	});
}();