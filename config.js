
module.exports = function(app) {

	require(__dirname + '/server/routes')(app);
	app.set('views', __dirname + '/server/views');
	app.use(require('stylus').middleware({ src: __dirname + '/public' }));
	app.use(require('express').static(__dirname + '/public'));
}