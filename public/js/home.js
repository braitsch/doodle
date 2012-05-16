
$(document).ready(function() {
	
	var n = 0;
	var socket = io.connect();
	socket.on('cnt', function (data) {
		n = data.val;
		$('#out').val(n);
	});	
	
	socket.on('num-connections', function (data) {
		$('#connected').text(data.val + ' People Currently Connected');
	});		
	
	$('#my-btn').click(function(){
		socket.emit('cnt', { val: ++n });
	})
	
});