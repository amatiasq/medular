var fs = require('fs');

var Logger = require('./logger');
var server = require('./server');
var socket = require('./socket');
var modules = require('./modules');
var handlers = require('./handlers');

function addListeners(srv) {
	srv
	.on('open', function(id) {
		Logger.info(id, null, 'CONNECTED');
	})
	.on('close', function(id) {
		Logger.info(id, null, 'CLOSED');
	})
	.on('message', function(id, data, callback) {
		var requestId = data.requestId;
		Logger.info(id, requestId, 'RECIVED', JSON.stringify(data));

		handlers.resolve(data.type, data.data, function(error, response) {
			var result = {
				requestId: requestId,
				success: !error,
				content: response || undefined,
				error: error || undefined
			};

			if (error)
				Logger.error(id, requestId, 'FAILED', error.message);
			else
				Logger.info(id, requestId, 'SUCCESS', JSON.stringify(result));

			callback(result);
		});
	});
}

addListeners(server);
addListeners(socket);

server.on('open-index', function(callback) {
	fs.readFile('index.mustache', function(err, data) {
		if (err)
			return callback(err);

		modules.ready(function() {
			var html = data && data.toString()
				.replace('{{modules}}', JSON.stringify(modules.getManifests()))
				.replace('{{handlers}}', JSON.stringify(handlers.getApi()))
			callback(null, html);
		});
	});
});

server.listen(8080);
socket.listen(8642);

console.info("Web server listening at 8080");
console.info("WebSocket listening at 8642");
