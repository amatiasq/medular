define(function(require) {

	var GlobalModules = require('core/global');
	var Promise = require('core/promise');

	var clientId = window.config.clientId;
	var log = true;

	function nativeWS() {
		var requests = {};
		var conn = new WebSocket('ws://' + location.hostname + ':8642');

		conn.onopen = function() {};
		conn.onerror = function(error) { console.error("ERROR ON WEBSOCKET:" + error.message); };
		conn.onmessage = function (event) {
			var data = JSON.parse(event.data);
			var promise = requests[data.requestId];

			if (log)
				console.log('[SOCKET][' + data.requestId + '][RESPONSE] ' + event.data);

			if (data.success)
				promise.done(data.content);
			else
				promise.fail(data.error);
		};

		return function(type, data) {
			var id = _.uniqueId('req-');
			var promise = new Promise();
			requests[id] = promise;

			var json = JSON.stringify({
				requestId: id,
				type: type,
				data: data
			});

			if (log)
				console.log('[SOCKET][' + id + '][SEND] ' + json);

			conn.send(json);
			return promise.getFuture();
		};
	}

	function fallback(type, data) {
		var id = _.uniqueId('req-');
		var postData = {
			clientId: clientId,
			data: {
				requestId: id,
				type: type,
				data: data
			}
		};

		console.log('[FAKE-SOCKET][' + id + '][SEND] ' + JSON.stringify(postData));
		var future = post('/', postData);
		future.then(function(result) {
			console.log('[FAKE-SOCKET][' + id + '][RESPONSE] ' + JSON.stringify(result));
		});
		return future;

	}

	if (!GlobalModules.isRegistered('websocket'))
		GlobalModules.register('websocket', typeof WebSocket !== 'undefined' ? nativeWS() : fallback)

	return GlobalModules.get('websocket');
});
