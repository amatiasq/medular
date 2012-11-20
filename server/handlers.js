var _ = require('underscore');

var modules = require('fs')
	.readdirSync('server/handlers')
	.filter(function(file) { return file.substr(-3) === '.js' })
	.map(function(file) { return require('./handlers/' + file); });

var handlers = _.object(_.pluck(modules, 'id'), _.pluck(modules, 'handler'));

exports.resolve = function(id, data, callback) {
	handlers[id](data, callback);
};

exports.getApi = function() {
	return _.object(_.pluck(modules, 'id'), _.pluck(modules, 'params'));
};
