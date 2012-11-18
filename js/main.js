define(function(require) {

	//var FS = requie('fs');
	//var fs = new FS('google-drive', document.getElementById('main-container'));

	//new (require('notes'))('lorelei', $('#main-container'));

	require('notes/provider/lorelei').getTree().then(function(tree) {
		console.log(tree);
	}, function(err) {
		console.log('ERROR');
		console.log(err);
	});
});
