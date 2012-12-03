(function() {

	var config = {
		context: 'core',
		baseUrl: 'js',
		//enforceDefine: true,

		// To bypass browser cache uncomment this...
		//urlArgs: "nocache=" +  (new Date()).getTime(),

		paths: {
			'$': 'vendor/jquery',
			'Underscore': 'vendor/underscore',
		},

		shim: {
			'$': { exports: '$' },
			'Underscore': { exports: '_' }
		}
	};

	define('--my-unknown-module', function(require) {
		require('$');
		require('Underscore');
		window.jQuery = undefined;


		// HERE WE ADD THE REQUIREJS MODULES WE WANT OUR APP MODULES TO SEE.


		define('$', function() { return window.$.noConflict() });
		define('Underscore', function() { return window._.noConflict() });

		define('css', function() { return require('css'); });
		define('tmpl', function() { return require('tmpl'); });

		define('core/view', function() { return require('core/view'); });
		define('core/server', function() { return require('core/server'); });
		define('core/emitter', function() { return require('core/emitter'); });
		define('core/promise', function() { return require('core/promise'); });
	});

	requirejs.config(config)([ 'main', '--my-unknown-module' ], function(main) {
		main.init(config);
	});

})();


function debug(key, moduleName) {
	require([moduleName], function(module) {
		window[key] = module
	})
}

