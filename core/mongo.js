
module.exports = function(onReady){
	var mongo = require('mongodb');
	var server = new mongo.Server('localhost', 27017, {auto_reconnect: true});
	var db = new mongo.Db('my-first-db', server);

	db.open(function(e, db) {
	  	if (e) {
			console.log(e)
	  	} else {
	    	console.log('Connected to DataBase :: ' + db.databaseName);
			onReady(db);
			db.on("close", function(e){ console.log('Connection to '+db.databaseName+' was closed!') });
		}	
	});
	
}
