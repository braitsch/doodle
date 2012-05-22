
/**
 * Node.js Doodle Server
 * Author :: Stephen Braitsch
 */

module.exports = function(sio){

	var exp = require('express');
	var app = exp.createServer();
	app.settings.root = __dirname;

	require('./core/env.js')(app, exp);
	require('./core/router.js')(app);
	require('./core/socket.js')(sio);
	
	return app;
}