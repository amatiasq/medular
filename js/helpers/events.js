define(function(require) {

	var $ = require('$');
	var hasOwn = Object.prototype.hasOwnProperty;

	function listen(obj, event, handler, scope) {
		obj.bind(event, function(e) {
			handler.call(scope, e || window.e);
		});
	}

	return {
		apply: function(dom, map, scope) {
			var data, selector, event

			for (var i in map) {
				if (hasOwn.call(map, i)) {
					data = i.split(' ');
					selector = data[0];
					event = data[1];

					listen(
						$(selector, dom),
						event,
						map[i],
						scope
					);
				}
			}
		}
	}
})