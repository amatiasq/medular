define(function(require) {
	
	var $ = require('$');
	var _ = require('Underscore');
	var splitter = /^(?:(.*)\s)?(\w+)$/;

	var original = $.fn.append;
	$.fn.extend({
		append: function() {
			original.apply(this, _.map(arguments, function(child) {
				return child.constructor.name === 'View' ? child.$el : child;
			}));
		}
	});

	function listen(map, scope) {
		_.each(map, function(handler, key) {
			data = key.match(splitter);
			selector = data[1];
			event = data[2];

			if (selector[0] === '$')
				selector = this.ref[selector];

			if (typeof handler === 'string')
				handler = scope[handler];

			if (!handler)
				throw new Error('Handler not found');

			if (selector)
				this.$el.delegate(event, handler.bind(scope));
			else
				this.$el.bind(event, handler.bind(scope));
		}, this);

		return this;
	}

	function elements(map) {
		_.each(map, function(value, name) {
			if (name === 'main')
				return map.main = this.$el;

			var selector = value || ('.' + name);
			map[name] = this.$el.find(selector);

			if (!map[name].length)
				throw new Error('No element found for selector ' + selector);
		}, this);

		this.ref = map;
		return this;
	}

	return function(template) {

		function View(options) {
			if (!(this instanceof View))
				return new View(options);

			this.$el = $(this.template(options || {}));
		}

		View.prototype = {
			constructor: View,
			template: template,
			listen: listen,
			elements: elements
		};

		return View;

	};
});
