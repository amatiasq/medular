var _ = require('underscore');
var http  = require('http');
var Emitter = require('events').EventEmitter;
var StaticServer = require('node-static').Server
var Logger = require('./logger');

var emitter = new Emitter();

var statics = new StaticServer('.', {
	cache: 600,
	headers: {
		'X-Powered-By': 'node-static'
	}
});

function serveIndex(request, response) {
	var clientId = _.uniqueId('srv-');

	emitter.emit('open-index', function(error, html) {
		if (error) {
			Logger.error('STATIC', 'INDEX', 'FAILED', error.message);
			response.writeHead(500, 'Internal server error');
		} else {
			//emitter.emit('open', clientId);
			response.writeHead(200, { 'Content-Type': 'text/html' });
			response.write(html.replace('{{CLIENT_ID}}', clientId));
		}
		response.end();
	});
}

function startServer(port) {
	http.createServer(function (request, response) {
		if (request.method !== 'POST') {
			if (request.url === '/' || request.url.substr(0, 6) === 'index.')
				return serveIndex(request, response);

			return statics.serve(request, response, function(error, result) {
				if (error) {
					response.writeHead(error.status, error.headers);
					response.end();
				}
			});
		}

		var input = '';
		request.setEncoding('utf8');
		request.on('data', function(chunk) { input += chunk });

		request.on('end', function() {
			var data = JSON.parse(input);
			var clientId = data.clientId;

			if (data.close) {
				emitter.emit('close', clientId);
			} else {
				emitter.emit('message', clientId, data.data, function(answer) {
					if (answer) {
						response.writeHead(200, { 'Content-Type': 'text/json' });
						response.write(JSON.stringify({
							clientId: clientId,
							data: answer
						}), 'utf-8');
					} else {
						response.writeHead(200);
					}
					response.end();
				});
			}
		});
	}).listen(port);
}

exports.listen = function(port) {
	startServer(port);
	return this;
};

exports.on = function(signal, listener) {
	emitter.on(signal, listener);
	return this;
};
