
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
	var _shape = 'Line';
	var _stroke = {
		color : '#'+Math.floor(Math.random()*16777215).toString(16),
		alpha : 100,
		rainbow : true
	}
	var _fill = {
		color : '#'+Math.floor(Math.random()*16777215).toString(16),
		alpha : 100,
		rainbow : true
	}
	var _size = 25;
	var _wiggle = 10;
	var _onSave = function() {};
	
	Object.defineProperty(this, "shape", 		{get: function() {return _shape;}});
	Object.defineProperty(this, "size", 		{get: function() {return _size;}});
	Object.defineProperty(this, "stroke", 		{get: function() {return _stroke;}});
	Object.defineProperty(this, "fill", 		{get: function() {return _fill;}});
	Object.defineProperty(this, "wiggle", 		{get: function() {return _wiggle;}});
	
	var o = {
		'Draw Style'		: _shape,
		'Stroke Color'	 	: _stroke.color,
		'Stroke Opacity'	: _stroke.alpha,
		'Rainbow Stroke !'	: _stroke.rainbow,
		'Fill Color'	 	: _fill.color,
		'Fill Opacity'	 	: _fill.alpha,
		'Rainbow Fill !'	: _fill.rainbow,
		'Brush Size'		: _size,
		'Wiggle Wobble'		: _wiggle,
		'Clear Canvas'		: function() { stage.clear();},
		'Save as PNG'		: function() { stage.save(); }
	}

	setTimeout(function(){
		var gui = new dat.GUI({ autoPlace: false });
		gui.add(o, 'Draw Style', [ 'Line', 'Circle', 'Square', 'Triangle' ] ).onChange(function(val){_shape=val});	
		gui.addColor(o, 'Stroke Color').onChange(function(val){ _stroke.color = val; });
		gui.add(o, 'Stroke Opacity', 1, 100).onChange(function(val){ _stroke.alpha = val; });
		gui.add(o, 'Rainbow Stroke !').onChange(function(val){ _stroke.rainbow = val; });
		gui.addColor(o, 'Fill Color').onChange(function(val){ _fill.color = val; });
		gui.add(o, 'Fill Opacity', 1, 100).onChange(function(val){ _fill.alpha = val; });
		gui.add(o, 'Rainbow Fill !').onChange(function(val){ _fill.rainbow = val; });
		gui.add(o, 'Brush Size', 1, 100).onChange(function(val){ _size = val; });
		gui.add(o, 'Wiggle Wobble', 0, 20).onChange(function(val){ _wiggle = val; });
		var cl = gui.add(o, 'Clear Canvas');
		var sv = gui.add(o, 'Save as PNG');
		var div = document.getElementById('gui');
		div.appendChild(gui.domElement);
	}, 100);

}

function iniDrawing()
{
	var data = {};
	
	stage = new JS3('cnvs');
	stage.interactive = true;
	stage.drawClean = false;
	stage.windowTitle = 'doodle – made by braitsch';
	
	stage.down = start;
	stage.enter = start;
	stage.up = stop;
	stage.leave = stop;
	
	function start(e)
	{
		if (stage.mousePressed){
			data.x1 = e.x;
			data.y1 = e.y;
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
		data.x2 = e.x;
		data.y2 = e.y;
		data.shape = gui.shape;
		data.fill = gui.fill;
		data.stroke = gui.stroke;
		data.size = gui.size;
		data.wiggle = gui.wiggle;
		if (data.fill.rainbow) data.fill.color = '#'+Math.floor(Math.random()*16777215).toString(16);
		if (data.stroke.rainbow) data.stroke.color = '#'+Math.floor(Math.random()*16777215).toString(16);
		if (data.shape == 'Line'){
			drawLine(data);
		}	else if (gui.shape == 'Circle'){
			drawCircle(data);
		}	else if (gui.shape == 'Square'){
			drawSquare(data);
		}	else if (gui.shape == 'Triangle'){
			drawTriangle(data);
		}
		socket.emit('draw-data', data);
		data.x1 = data.x2;
		data.y1 = data.y2;
	}
}

var drawLine = function(e)
{
	if (e.wiggle == 0){
		stage.drawLine({x1:e.x1,	 y1:e.y1, x2:e.x2, y2:e.y2,
			strokeColor:e.stroke.color, strokeWidth:e.size, alpha:e.stroke.alpha, capStyle:'round'});
	}	else{
		var max = (e.wiggle * 10);
		var min =-(e.wiggle * 10);
		var dir = e.x2 < e.x1 ? - 1 : 1;
		var r = Math.floor(Math.random() * (max - min + 1)) + min;
		stage.drawArc({x1:e.x1, y1:e.y1, xc:e.x2-(25*dir), yc:e.y1+r, x2:e.x2, y2:e.y2,
			strokeColor:e.stroke.color, strokeWidth:e.size, alpha:e.stroke.alpha, capStyle:'round'});
	}
}

var drawCircle = function(e)
{
	stage.drawCircle({x:e.x1-(gui.size/2), y:e.y1-(gui.size/2), size:e.size,
		fillColor:e.fill.color, fillAlpha:e.fill.alpha/100, strokeColor:e.stroke.color, strokeAlpha:e.stroke.alpha/100});
}

var drawSquare = function(e)
{
	stage.drawRect({x:e.x1-(e.size/2), y:e.y1-(e.size/2), size:e.size,
		fillColor:e.fill.color, fillAlpha:e.fill.alpha/100, strokeColor:e.stroke.color, strokeAlpha:e.stroke.alpha/100});
}

var drawTriangle = function(e)
{
	stage.drawTri({x:e.x1-(e.size/2), y:e.y1-(e.size/2), size:e.size,
		fillColor:e.fill.color, fillAlpha:e.fill.alpha/100, strokeColor:e.stroke.color, strokeAlpha:e.stroke.alpha/100});
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
		connections[data.id] = data;
		if (data.x2 && data.y2){
			if (data.shape == 'Line'){
				drawLine(data);
			}	else if (data.shape == 'Circle'){
				drawCircle(data);
			}	else if (data.shape == 'Square'){
				drawSquare(data);
			}	else if (data.shape == 'Triangle'){
				drawTriangle(data);
			}
		}
	});
}

/*
	automation test
*/

// var data = {};
// var pos = {
// 	x : Math.random()*window.innerWidth,
// 	y : Math.random()*window.innerHeight,
// 	dx: 1,
// 	dy: 1,
// }
// setInterval(function(){
// 	if (pos.x < 0 || pos.x > window.innerWidth) pos.dx*=-1;
// 	if (pos.y < 0 || pos.y > window.innerHeight) pos.dy*=-1;
// 	pos.x+=(pos.dx*5);
// 	pos.y+=(pos.dy*5);
// 	data.x2 = pos.x;
// 	data.y2 = pos.y;
// 	data.x1 = data.x1 || data.x2;
// 	data.y1 = data.y1 || data.y2;
// 	data.shape = gui.shape;
// 	data.fill = gui.fill;
// 	data.stroke = gui.stroke;
// 	data.size = gui.size;
// 	data.wiggle = gui.wiggle;
// 	if (data.fill.rainbow) data.fill.color = '#'+Math.floor(Math.random()*16777215).toString(16);
// 	if (data.stroke.rainbow) data.stroke.color = '#'+Math.floor(Math.random()*16777215).toString(16);
// 	if (data.shape == 'Line'){
// 		drawLine(data);
// 	}	else if (gui.shape == 'Circle'){
// 		drawCircle(data);
// 	}	else if (gui.shape == 'Square'){
// 		drawSquare(data);
// 	}	else if (gui.shape == 'Triangle'){
// 		drawTriangle(data);
// 	}
// 	socket.emit('draw-data', data);
// 	data.x1 = data.x2;
// 	data.y1 = data.y2;
// }, .1);
