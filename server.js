var fs = require('fs');
var http = require('http');
var mysql = require('mysql');
var WebSocketServer = require('websocket').server;

var red = '\033[31m';
var blue = '\033[34m';
var green = '\033[32m';
var reset = '\033[0m';

var count = 0;
var server = http.createServer(function(request, response) { });
server.listen(1337, function() { });

var log = function(id, req, type, data) {
	var fail = type === 'FAILED';

	console.log([
		fail ? red : blue,
		'[' + id + ']',
		req ? '[' + req + ']' : '',
		'[' + type + '] ',
		fail ? red : green,
		data ? data : '',
		reset
	].join(''))
};

new WebSocketServer({ httpServer: server }).on('request', function(request) {
	var id = count++;

	log(id, null, 'CONNECTED');
	var conn = request.accept(null, request.origin);

	conn.on('message', function(event) {
		if (event.type !== 'utf8') return
		var data = JSON.parse(event.utf8Data);

		log(id, data.requestId, 'RECIVED', event.utf8Data);

		({   'API': api,
			'PROXY': proxy,
			'DATABASE': database,
		})[data.type](data.data, function(error, response) {
			var json = JSON.stringify({
				requestId: data.requestId,
				success: !error,
				content: response || undefined,
				error: error || undefined
			});

			if (error)
				log(id, data.requestId, 'FAILED', error.message);
			else
				log(id, data.requestId, 'SUCCESS', json);

			conn.sendUTF(json);
		});
	});
});

function api(data, callback) {
	fs.readdir('mods', callback);
}

function proxy(data, callback) {
	var method = data.method;
	var host = data.host;
	var url = data.uri;
	var post = data.data;

	var request = http.request({
		method: method,
		host: host,
		port: 80,
		path: url
	}, function(response) {
		var data = [];

		response.addListener('data', function(chunk) {
			data.push(chunk);
		});

		response.addListener('end', function() {
			callback(null, {
				status: response.statusCode,
				headers: response.headers,
				data: data
			});
		});
	});

	request.on('error', function(e) {
		fail(id, e);
	});

	if (method === 'POST') {
		var params = [];
		if (post)
			for (var i in post)
				if (post.hasOwnProperty(i))
					params.push(i + '=' + post[i]);

		request.write(params.join('&'));
	}

	request.end();
}

function database(data, callback) {
	var query = data.query;

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


/*
var connection = new WebSocket('ws://localhost:1337');
connection.onopen = function() { console.log('OPEN') };
connection.onerror = function(error) { console.log('ERROR') };
connection.onmessage = function (message) { console.log('MESSAGE') };
connection.send(JSON.stringify({ hola: 'mundo' }))
connection.close()






/*
var http = require('http');
var StaticServer = require('node-static').Server;

var red = '\033[31m';
var blue = '\033[34m';
var green = '\033[32m';
var reset = '\033[0m';

var file = new StaticServer('.', {
	cache: 600,
	headers: {
		'X-Powered-By': 'node-static'
	}
});

function fail(id, error) {
	console.log(
		red + '{{FAILED}} ' + reset + id +
		(error ? '\n\t' + red + error.message + reset : '')
	);
}

function log(type, id, data) {
	var text = blue + '[' + type + '][' + id + '] ' + green + data + reset;
	console.log(text);
	return text;
}

function serveFile(id, request, response) {
	id = log('Static', id, request.url);

	request.addListener('end', function() {
		file.serve(request, response, function(error, result) {
			if (error) {
				fail(id, error);
				response.writeHead(error.status, error.headers);
				response.end();
			}
		});
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

*/
