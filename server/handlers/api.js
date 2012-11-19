var fs = require('fs');
var core = require('./api/core');

var modules = { core: core };

function api(module, action, data, callback) {
	if (!modules.hasOwnProperty(module)) {
		// Load module
	}

	modules[module][action](data, callback);
}

exports.id = 'API';
exports.handler = function(data, callback) {
	api(data.module, data.action, data.data, callback);
};