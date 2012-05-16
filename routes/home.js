
// handler for homepage
exports.index = function(req, res) {
	res.render('home', { title: 'Node Socket'});
};