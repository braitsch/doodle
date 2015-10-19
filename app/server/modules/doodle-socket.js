
module.exports = function()
{
	var connections = { };
		
	var nsp = io.of('/doodle');
	nsp.on('connection', function(socket) {
	// give each connected user a random color so it's easier to tell them apart in the chat log //
		socket.on('draw-data', function(data) {
		// append this socket's id so we know who is talking //
			data.id = socket.id;
			socket.broadcast.emit('draw-data', data);
		});
		
		socket.on('user-message', function(data) {
			data.color = socket.color;
			broadcastMessage('user-message', data);
		});

		function dispatchStatus()
		{
			broadcastMessage('status', connections);
		}
	
		function broadcastMessage(message, data)
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