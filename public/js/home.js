
$(document).ready(function() {
	
	var socket = io.connect();	
	socket.on('status', function (data) {
		$('#out').val(data.ct);
		$('#connected').text(data.nc + ' People Currently Connected');
	});		
	
	$('#my-btn').click(function(){
		var n = Number($('#out').val()) + 1;
		socket.emit('cnt', { val: n });
	})
	
});