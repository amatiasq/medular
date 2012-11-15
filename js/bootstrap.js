require.config({
	baseUrl: 'js/',

	paths: {
		'$': 'vendor/jquery',
		'Underscore': 'vendor/underscore',
		'template': '../tmpl'
	},

	shim: {
		'$': {
			'exports': '$'
		},

		'Underscore': {
			'exports': '_'
		}
	}
});

require([ 'main' ]);


// STRING EXTENSION
(function StringExtension() {

	var hasOwn = Object.prototype.hasOwnProperty;
	var dom = document.createElement('div');
	var cache = {};

	function get(plain) {
		if (hasOwn.call(cache, plain))
			return cache[plain];

		return cache[plain] = new ExtendedString(plain);
	}
	
	function ExtendedString(plain) { this._native = plain; }
	ExtendedString.prototype = {
		render: function() {
			dom.innerHTML = this._native;

			if (dom.children.length > 1)
				throw new Error('String "' + this._native + ' has more than one node.');

			var result = dom.firstChild;
			dom.innerHTML = '';
			return result;
		}
	};

	String.prototype.extended = function() {
		return get(this.toString());
	}

})();

