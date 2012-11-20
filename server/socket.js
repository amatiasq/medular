var _ = require('underscore');
var http = require('http');
var Emitter = require('events').EventEmitter
var WebSocketServer = require('websocket').server;

var emitter = new Emitter();

function openSocket(port, callback) {
	var server = http.createServer(function(request, response) { });
	server.listen(port, function() { });

	new WebSocketServer({ httpServer: server }).on('request', function(request) {
		var id = _.uniqueId('ws-');
		var connection = request.accept(null, request.origin);

		function send(response) {
			if (!response) return;
			connection.sendUTF(JSON.stringify(response));
		}

		emitter.emit('open', id);

		connection.on('close', function() {
			emitter.emit('close', id);
		});

		connection.on('message', function(event) {
			if (event.type !== 'utf8') return
			var data = JSON.parse(event.utf8Data);
			emitter.emit('message', id, data, send);
		});
	});
}

exports.listen = function(port) {
	openSocket(port);
	return this;
};

exports.on = function(signal, listener) {
	emitter.on(signal, listener);
	return this;
};
