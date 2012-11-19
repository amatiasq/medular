var Logger = require('./logger');
var socket = require('./socket');

var apiHandler = require('./api');
var dataHandler = require('./data');
var proxyHandler = require('./proxy');

socket(function(id, connection) {

	Logger.info(id, null, 'CONNECTED');

	connection.on('message', function(event) {
		if (event.type !== 'utf8') return
		var data = JSON.parse(event.utf8Data);

		Logger.info(id, data.requestId, 'RECIVED', event.utf8Data);

		({  'API': apiHandler,
			'DATA': dataHandler,
			'PROXY': proxyHandler
		})[data.type](data.data, function(error, response) {
			var json = JSON.stringify({
				requestId: data.requestId,
				success: !error,
				content: response || undefined,
				error: error || undefined
			});

			if (error)
				Logger.error(id, data.requestId, 'FAILED', error.message);
			else
				Logger.info(id, data.requestId, 'SUCCESS', json);

			connection.sendUTF(json);
		});
	});
});
