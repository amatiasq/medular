define(function(require) {
	var Notes = require('notes');
	return {
		init: function(parent) {
			new Notes('lorelei', parent);
		}
	};
});
