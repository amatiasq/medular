define(function(require) {

	var _ = require('Underscore');
	var server = require('core/server')

	function init(cfg) {
		var config = _.extend({ }, cfg);

		_.each(config.paths, function(value, key) {
			if (key !== 'template')
				value = '../../js/' + value;

			console.log(key + '=' + value);
			config.paths[key] = value;
		});

		server.api('core', 'get-initial-data').then(function(data) {
			data.forEach(function(module) {
				if (module === 'fs')
					return;

				var modRequire = requirejs.config(_.defaults({
					context: module,
					baseUrl: 'mods/' + module
				}, config));

				modRequire([ 'main' ], function(main) {
					main.init($('#main-container'));
				});

			});
		});
	}

	return {
		init: init
	};




	//new (require('notes/main'))('lorelei', $('#main-container'));

	/*
	require('core/server').api('core', 'get-initial-data').then(function(data) {

	}, function(error) {
		console.error(error)
		alert(error.message);
	});
	*/

	//var FS = requie('fs');
	//var fs = new FS('google-drive', document.getElementById('main-container'));

	/*
	require('notes/provider/lorelei').getTree().then(function(tree) {
		console.log(tree);
	}, function(err) {
		console.log('ERROR');
		console.log(err);
	});
	*/

});
