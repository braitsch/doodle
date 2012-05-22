
module.exports = function(app) {

	app.get('/', require(app.settings.root + '/routes/canvas').index);
	app.get('*', require(app.settings.root + '/routes/404').index);
	
};