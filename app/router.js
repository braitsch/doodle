
module.exports = function(app) {

	app.get('/', canvas);
	app.get('*', nfnd);
	
};

function canvas(req, res){
	res.render('canvas', { title: 'Node Canvas'});
}

function nfnd(req, res) {
	res.render('404', { title: 'Page Not Found'});
};