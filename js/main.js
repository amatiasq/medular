define(function(require) {

	require('css!../css/normalize.less')
	require('css!../css/basic.less')
	require('css!../css/main.less')

	var _ = require('Underscore');
	var server = require('core/server')
	var Bus = require('core/bus');

	var modules = window.config.modules;
	var defaultManifest = {
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
		return _.object(_.keys(associative), _.map(associative, iterator));
	}

	function init(cfg) {
		var modulesBus = new Bus();
		var config = clone(cfg);
		config.paths = associativeMap(config.paths, function(value) { return 'js/' + value });

		modulesBus.listen('core/append-to-screen', function(dom) {
			document.getElementById('main-container').appendChild(dom);
		});

		if (!modules.length)
			console.info("No modules found");

		modules.forEach(function(data) {
			if (!data.success)
				return console.error('Cannot load module "' + data.name + '": ' + data.error.message);

			var manifest = data.manifest;
			_.each(defaultManifest, function(section, name) {
				_.defaults(manifest[name], section);
			});

			var base = 'mods/' + data.name + '/' + manifest.client['root-folder'];

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

			_.extend(localConfig, manifest.client['requirejs-config']);

			requirejs.config(localConfig)([ manifest.client.main ], function(main) {
				main.init(modulesBus);
			});
		});
	}

	window.server = server;

	return {
		init: init
	};
});
