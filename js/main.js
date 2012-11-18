define(function(require) {

	//var FS = requie('fs');
	//var fs = new FS('google-drive', document.getElementById('main-container'));

	new (require('notes'))('lorelei', $('#main-container'));
});
