
/**
 * Node.js Socket Server
 * Author :: Stephen Braitsch
 */

var express = require('express');
var app = module.exports = express.createServer();
app.settings.root = __dirname;

require('./core/env.js')(app, express);
require('./core/router.js')(app);
require('./core/socket.js')(app);

app.listen(process.env.PORT || 8080, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});