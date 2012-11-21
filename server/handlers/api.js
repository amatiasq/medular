var fs = require('fs');

var modules = { };

function api(module, action, data, callback) {
	if (!modules.hasOwnProperty(module)) {
		// Load module
	}

	modules[module][action](data, callback);
}

exports.id = 'API';
exports.params = [ 'module', 'action', 'data' ];
exports.handler = function(data, callback) {
	api(data.module, data.action, data.data, callback);
};
