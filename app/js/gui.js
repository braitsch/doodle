
function gui()
{
	var _color = '#'+Math.floor(Math.random()*16777215).toString(16), _stroke = 4, _onSave = function() {};
	
	Object.defineProperty(this, "color", 		{get: function() {return _color;}});
	Object.defineProperty(this, "stroke", 		{get: function() {return _stroke;}});
	
	var o = {
		'Line Color'	 	: _color,
		'Line Thickness'	: _stroke
	}
	var gui = new dat.GUI({ autoPlace: false });
	var c1 = gui.addColor(o, 'Line Color');
		c1.onChange(function(val){ _color = val; });	
	var s1 = gui.add(o, 'Line Thickness', 1, 10);
		s1.onChange(function(val){ _stroke = val; });
	var div = document.getElementById('gui');
	div.appendChild(gui.domElement);
}