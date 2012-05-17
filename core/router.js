module.exports = function(app) {

	var home = require(app.settings.root + '/routes/home');
	app.get('/', home.index);

};