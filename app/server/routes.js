
require('./modules/doodle-socket');

module.exports = function(app) {

	app.get('/', function(req, res){
		res.render('canvas', { title: 'Socket.IO Doodle'});
	});

};
