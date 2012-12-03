define(function(require) {

	require('css!../css/normalize.less')
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

	function init() {
		var modulesBus = new Bus();
		modulesBus.listen('core/append-to-screen', function(dom) {
			document.getElementById('main-container').appendChild(dom);
		});

		if (!modules.length)
			console.info("No modules found");

		modules.forEach(function(data) {
			if (!data.success)
				return console.error('Cannot load module "' + data.name + '": ' + data.error.message);

			var manifest = data.manifest;
			manifest.server = _.defaults(manifest.server, defaultManifest.server);
			manifest.client = _.defaults(manifest.client, defaultManifest.client);

			var config = _.defaults({
				context: data.name,
				baseUrl: 'mods/' + data.name + '/' + manifest.client['root-folder']
			}, manifest.client['requirejs-config']);

			requirejs.config(config)([ manifest.client.main ], function(main) {
				main.init(modulesBus);
			});
		});
	}

	return {
		init: init
	};
});
