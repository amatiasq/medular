var fs = require('fs');
var config = require('./config');
var core = require('./core-api');

var modules = { core: core };

function api(module, action, data, callback) {
	if (!modules.hasOwnProperty(module)) {
		// Load module
	}

	modules[module][action](data, callback);
}

module.exports = function(data, callback) {
	api(data.module, data.action, data.data, callback);
};
