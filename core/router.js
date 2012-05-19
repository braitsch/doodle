module.exports = function(app) {

	var cnvs = require(app.settings.root + '/routes/canvas');
	var nfnd = require(app.settings.root + '/routes/404');	
	app.get('/', cnvs.index);
	app.get('*', nfnd.index);	

};