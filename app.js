
/**
 * Node.js Doodle Server
 * Author :: Stephen Braitsch
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);

// create the single instance of socket.io that will be shared across all applications //
global.io = require('socket.io')(http);

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'jade');
app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
app.use(express.static(__dirname + '/app/public'));

require('./app/server/routes')(app);

http.listen(app.get('port'), function()
{
	console.log('Express server listening on port', app.get('port'));
});
