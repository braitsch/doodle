
/**
 * Node.js Doodle Server
 * Author :: Stephen Braitsch
 */

module.exports = function(){

	var exp = require('express');
	var app = exp.createServer();

	app.name = 'doodle';
	app.io = require('./app/core/socket');
	app.io.init(app.name);

	app.root = __dirname;
	
	require('./app/core/config')(app, exp);
	require('./app/socket')(app);
	require('./app/router')(app);
	
	return app;
	
}