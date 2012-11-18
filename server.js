var http = require('http');
var mysql = require('mysql');
var StaticServer = require('node-static').Server;

var file = new StaticServer('.', {
	cache: 600,
	headers: {
		'X-Powered-By': 'node-static'
	}
});

function serveFile(id, request, response) {
	id = '[Static][' + id + '] ' + request.url;
	console.log(id);

	request.addListener('end', function() {
		file.serve(request, response, function(error, result) {
			if (error) {
				console.log('{{FAILED}} ' + id);
				response.writeHead(error.status, error.headers);
				response.end();
			}
		});
	});
}

function proxy(id, request, response) {
	var url = request.url.substr('/proxy'.length);
	id = '[Proxy][' + id + '] http://' + request.headers['x-proxy-host'] + url;
	console.log(id);

	var proxy_request = http.request({
		method: 'POST',
		host: request.headers['x-proxy-host'],
		port: 80,
		path: url
	}, function(proxy_response) {
		proxy_response.addListener('data', function(chunk) {
			response.write(chunk, 'binary');
		});
		proxy_response.addListener('end', function() {
			response.end();
		});
		response.writeHead(proxy_response.statusCode, proxy_response.headers);
	});

	proxy_request.on('error', function(e) {
		console.log('{{FAILED}} ' + id);
	});

	request.addListener('data', function(chunk) {
		proxy_request.write(chunk, 'binary');
	});

	request.addListener('end', function() {
		proxy_request.end();
	});
}

function database(id, request, response) {
	var query = request.headers['x-query'];
	id = '[DB][' + id + '] ' + query;
	console.log(id)

	connection = mysql.createConnection({
		user: 'lorelei',
		password: 'lorelei',
		host: 'localhost',
		database: 'lorelei',
		port: '3306'
	});

	connection.connect();

	connection.query(query, function selectPlayers(err, rows, fields) {
		if (err) {
			console.log('{{FAILED}} ' + id);
		} else {
			response.write(JSON.stringify(rows), 'utf8');
		}

		response.end();
		connection.end();
	});
}

var i = 0;
http.createServer(function(request, response) {
	var id = i++;

	switch (request.url.split('/')[1]) {

		case 'proxy':
			proxy(id, request, response);
			break;

		case 'db':
			database(id, request, response);
			break;

		default:
			serveFile(id, request, response);

	}

}).listen(8080);
