module.exports = function(app) {

	var cnvs = require(app.settings.root + '/routes/canvas');
	app.get('/', cnvs.index);

};