define(function(require) {
	var Notes = require('notes');
	return {
		init: function(bus) {
			bus.post('core/append-to-screen', new Notes('lorelei').getRoot());
		}
	};
});
