//	var Drive = require('provider/google_drive');
//	var Presenter = require('presenter');
define(function(require) {


	var providers = {
		'google-drive': Drive
	};

	function FileSystem(type, container) {
		var provider = new providers[type]();
		this.presenter = new Presenter(provider);

		this.presenter.render(container);
		provider.init()
			.onDone(function() {
				this.presenter.browse();
			}, this)
			.onError(function(err) {
				console.log(err);
			});
	}

	return FileSystem;
});
