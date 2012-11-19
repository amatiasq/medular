var http = require('http');
var WebSocketServer = require('websocket').server;

module.exports = function(callback) {

	var count = 0;
	var server = http.createServer(function(request, response) { });
	server.listen(1337, function() { });

	new WebSocketServer({ httpServer: server }).on('request', function(request) {
		callback(count++, request.accept(null, request.origin))
	});
};
