define(function(require) {

	var _ = require('Underscore');
	var Promise = require('core/promise');

	/**********
	 * SOCKET *
	 **********/

	var log = true;
	var requests = {};
	var conn = new WebSocket('ws://' + location.hostname + ':1337');

	conn.onopen = function() {};
	conn.onerror = function(error) { console.error("ERROR ON WEBSOCKET:" + error.message); };
	conn.onmessage = function (event) {
		var data = JSON.parse(event.data);

		if (data.requestId === null)
			return modules(data.modules);

		var promise = requests[data.requestId];

		if (log)
			console.log('[SOCKET][' + data.requestId + '][RESPONSE] ' + event.data);

		if (data.success)
			promise.done(data.content);
		else
			promise.fail(data.error);
	};

	function message(type, data) {
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
	}

	function modules(modules) {
		_.each(modules, function(params, id) {
			server[id.toLowerCase()] = function() {
				_.

				var data = {};
				var args = arguments;
				params.forEach(function(param, index) {
					data[param] = args[index];
				});
			};
		});
	}



	/******************
	 * SOCKET METHODS *
	 ******************/

	function api(module, action, data) {
		return message('API', {
			module: module,
			action: action,
			data: data
		});
	}

	function proxy(method, server, url, data) {
		return message('PROXY', {
			method: method,
			host: server,
			uri: url,
			data: data
		});
	}

	function data(query) {
		return message('DATA', {
			query: query
		});
	}

	/***************
	 * HttpRequest *
	 ***************/

	function serialize(data) {
		return _.map(data, function(value, key) {
			return key + '=' + value;
		}).join('&');
	}

	function requestJson(method, url, headers, data) {
		return request(method, url, headers, data).transform(function(response) {
			return JSON.parse(response);
		});
	}

	function request(method, url, headers, data) {
		var promise = new Promise();
		var request = new XMLHttpRequest();
		request.open(method, url)

		if (headers) {
			_.each(headers, function(value, key) {
				request.setRequestHeader(key, value);
			});
		}

		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				console.log("CONTENT: " + request.responseText);
				promise.done(request.responseText);
			}
		};

		if (method === 'POST')
			request.send(serialize(data));
		else
			request.send();

		return promise.getFuture();
	}

	function get(url, headers) {
		return request('GET', url, headers, null);
	}

	function post(url, data, headers) {
		return request('POST', url, headers, data);
	}

	function json(url, data) {
		return requestJson('POST', url, null, data);
	}


	var server = {
		request: request,
		get: get,
		post: post,
		json: json
	};

	return server;
});
