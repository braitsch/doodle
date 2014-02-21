
var gui, stage, socket, connections = {};

$(document).ready(function() {
	
	gui = new gui();
	var canvas = document.getElementById('cnvs');
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight - 100;
	iniDrawing();
	initSocket();
});

function gui()
{
	var _color = '#'+Math.floor(Math.random()*16777215).toString(16);
	var _stroke = 3;
	var _wiggle = 10;
	var _rainbow = true;
	var _onSave = function() {};
	
	Object.defineProperty(this, "color", 		{get: function() {return _color;}});
	Object.defineProperty(this, "stroke", 		{get: function() {return _stroke;}});
	Object.defineProperty(this, "wiggle", 		{get: function() {return _wiggle;}});
	Object.defineProperty(this, "rainbow", 		{get: function() {return _rainbow;}});
	
	var o = {
		'Line Color'	 	: _color,
		'Line Thickness'	: _stroke,
		'Line Wiggle'		: _wiggle,
		'Rainbow!'			: _rainbow,
		'Clear Canvas'		: function() { stage.clear();},
		'Save as PNG'		: function() { stage.save(); }
	}
	
	var gui = new dat.GUI({ autoPlace: false });
	var c1 = gui.addColor(o, 'Line Color');
		c1.onChange(function(val){ _color = val; });
	var s1 = gui.add(o, 'Line Thickness', 1, 10);
		s1.onChange(function(val){ _stroke = val; });
	var w1 = gui.add(o, 'Line Wiggle', 0, 20);
		w1.onChange(function(val){ _wiggle = val; });
	var rc = gui.add(o, 'Rainbow!');
		rc.onChange(function(val){_rainbow=val});
	var cl = gui.add(o, 'Clear Canvas');
	var sv = gui.add(o, 'Save as PNG');
	var div = document.getElementById('gui');
	div.appendChild(gui.domElement);
}

function iniDrawing()
{
	stage = new JS3('cnvs');
	stage.interactive = true;
	stage.drawClean = false;
	stage.windowTitle = 'doodle – made by braitsch';
	
	stage.down = start;
	stage.enter = start;
	stage.up = stop;
	stage.leave = stop;
	
    var x, y;
	function start(e)
	{
		if (stage.mousePressed){
			x = e.x; y = e.y;
			stage.move = onMouseMove;
		}
		window.document.body.style.cursor = 'crosshair';
	}
	
	function stop()
	{
		stage.move = null;
		window.document.body.style.cursor = 'default';
	}
	
	function onMouseMove(e)
	{
		var color = gui.rainbow ? '#'+Math.floor(Math.random()*16777215).toString(16) : gui.color;
		if (gui.wiggle == 0){
			stage.drawLine({x1:x, y1:y, x2:e.x, y2:e.y, color:color, strokeWidth:gui.stroke, capStyle:'round'});
		}	else{
			var max = (gui.wiggle * 10);
			var min =-(gui.wiggle * 10);
			var dir = e.x < x ? - 1 : 1 
			var r = Math.floor(Math.random() * (max - min + 1)) + min;
			stage.drawArc({x1:x, y1:y, xc:e.x-(25*dir), yc:y+r, x2:e.x, y2:e.y, color:color, strokeWidth:gui.stroke, capStyle:'round'});
		}
		x = e.x; y = e.y;
		socket.emit('draw-data', { x: e.x, y:e.y, color:gui.color, strokeWidth:gui.stroke});
	}
}

function initSocket()
{
	socket = io.connect('/doodle');
	socket.on('status', function (data) {
		connections = data;
		var i=0; for (p in connections) i++;
		var s = i > 1 ? ' are '+i+' People ' : ' is '+i+' Person ';
		$('#connected').html('There '+s+' Currently Connected');
	});
	socket.on('draw-data', function (data) {
		var k = connections[data.id];
		if (k.x && k.y){
			stage.drawLine({x1:k.x, y1:k.y, x2:data.x, y2:data.y, color:data.color, strokeWidth:data.strokeWidth});
		}
		k.x = data.x; k.y = data.y;
	});
}
