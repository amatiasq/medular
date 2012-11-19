define(function(require) {

	var _ = require('Underscore');
	var Promise = require('core/promise');

	/**********
	 * SOCKET *
	 **********/

	var requests = {};
	var conn = new WebSocket('ws://' + location.hostname + ':1337');

	conn.onopen = function() {};
	conn.onerror = function(error) {
		console.log("ERROR ON WEBSOCKET");
	};
	conn.onmessage = function (event) {
		var data = JSON.parse(event.data);
		var promise = requests[data.requestId];

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

		console.log('[SOCKET][' + id + '][SEND] ' + json);
		conn.send(json);

		return promise.getFuture();
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

	function db(query) {
		return message('DATABASE', {
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


	return {
		request: request,
		get: get,
		post: post,
		json: json,
		proxy: proxy,
		db: db,
		api: api
	};
});
