var http = require('http');
var Logger = require('../logger');

function proxy(method, host, url, post, callback) {
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

	request.on('error', callback);

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

exports.id = 'PROXY';
exports.handler = function(data, callback) {
	proxy(data.method, data.host, data.uri, data.data, callback);
};

