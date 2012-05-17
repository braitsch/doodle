
var stage, socket, connections = {};

$(document).ready(function() {
	iniDrawing();
	initSocket();
});

function iniDrawing()
{
	stage = new JS3('cnvs');
	stage.setSize(800, 400)
	stage.background = '#CCC';
	stage.interactive = true;
	stage.drawClean = false;
		
	stage.down = start;
	stage.enter = start;JS3.js		
	stage.up = stop;
	stage.leave = stop;
	
    var x, y;
	var c = JS3.getRandomColor();
	function start(e)
	{
		if (stage.mousePressed){
		    x = e.x; y = e.y;
	    	stage.move = onMouseMove;			
		}	
	}
	
	function stop()
	{
	    stage.move = null;
		window.document.body.style.cursor = 'default';			
	}	
	
	function onMouseMove(e)
	{
	    stage.drawLine({x1:x, y1:y, x2:e.x, y2:e.y, color:c});
	    x = e.x; y = e.y;
		socket.emit('draw-data', { x: e.x, y:e.y, color:c});
		window.document.body.style.cursor = 'crosshair';
	}	
}

function initSocket()
{
	socket = io.connect();
	socket.on('status', function (data) {
		connections = data.connections;
		var i=0; for (p in connections) i++;
		$('#connected').text(i + ' People Currently Connected');
	});	
	socket.on('draw-data', function (data) {
		var k = connections[data.id];
		if (k.x && k.y){
			stage.drawLine({x1:k.x, y1:k.y, x2:data.x, y2:data.y, color:data.color});			
		}
		k.x = data.x; k.y = data.y;
	});
}
