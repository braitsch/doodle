
/**
 * Node.js Doodle Server
 * Author :: Stephen Braitsch
 */

module.exports = function(){

	var exp = require('express');
	var app = exp.createServer();

	app.root = __dirname;

	require('./app/core/config')(app, exp);
	require('./app/router')(app);
	require('./app/modules/doodle-socket');	

	return app;

}