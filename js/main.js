define(function(require) {

	require('css!../css/normalize.less')
	require('css!../css/basic.less')
	require('css!../css/main.less')

	var _ = require('Underscore');
	var server = require('core/server')
	var Bus = require('core/bus');

	var defaultManifest = {
		"description": "",
		"server": {
			"shell": "node server/main"
		},

		"client": {
			"root-folder": "client/js",
			"main": "main",
			"requirejs-config": null
		}
	};

	function clone(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	function associativeMap(associative, iterator) {
		_.object(_.keys(associative), _.map(associative, iterator));
	}

	function init(cfg) {
		var modulesBus = new Bus();
		var config = clone(cfg);
		config.paths = associativeMap(config.paths, function(value) { return 'js/' + value });

		modulesBus.listen('core/append-to-screen', function(dom) {
			document.getElementById('main-container').appendChild(dom);
		});

		server.api('core', 'get-initial-data').then(function(data) {
			data.modules.forEach(function(data) {
				if (!data.success)
					return console.error('Cannot load module "' + data.name + '": ' + data.error.message);

				_.each(defaultManifest, function(section, name) {
					_.defaults(data.config[name], section);
				});

				var base = 'mods/' + data.name + '/' + data.config.client['root-folder'];

				if (base[base.length - 1] === '/')
					base.length--;

				var toRoot = new Array(base.split('/').length + 1).join('../');
				var localConfig = _.defaults({
					context: data.name,
					baseUrl: base,
					paths: {}
				}, config);

				_.each(config.paths, function(value, key) {
					localConfig.paths[key] = toRoot + value;
				});

				_.extend(localConfig, data.config.client['requirejs-config']);

				requirejs.config(localConfig)([ data.config.client.main ], function(main) {
					main.init(modulesBus);
				});
			});
		});
	}

	window.server = server;

	return {
		init: init
	};
});
