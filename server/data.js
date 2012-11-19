var mysql = require('mysql');

function database(query, callback) {
	connection = mysql.createConnection({
		user: 'lorelei',
		password: 'lorelei',
		host: 'localhost',
		database: 'lorelei',
		port: '3306'
	});

	connection.connect();

	connection.query(query, function(error, result, fields) {
		if (error)
			callback(error);
		else
			callback(null, result);
		connection.end();
	});
}

module.exports = function(data, callback) {
	database(data.query, callback);
};
