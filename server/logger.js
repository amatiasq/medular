var red = '\033[31m';
var blue = '\033[34m';
var green = '\033[32m';
var reset = '\033[0m';

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

exports.info = function(id, req, type, data) { log(id, req, type, data); };
exports.error = function(id, req, type, data) { log(id, req, type, data); };
