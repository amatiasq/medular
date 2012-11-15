define(function(require) {
	
	require('https://apis.google.com/js/client.js');
	var Promise = require('helper/promise');

	function GoogleDriveAdapter() { }
	GoogleDriveAdapter.prototype = {
		constructor: GoogleDriveAdapter,

		init: function() {
			var promise = new Promise();

			gapi.auth.authorize({
				'client_id': '866102470488.apps.googleusercontent.com',
				'scope': 'https://www.googleapis.com/auth/drive'
			}, function(token) {
				gapi.client.load('drive', 'v2', function(err) {
					if (err)
						promise.fail(err);
					else {
						promise.fulfill();
					}
				});
			});

			GoogleDriveAdapter.prototype.init = function() {
				return promise.getFuture();
			};
			
			return this.init();
		},

		browse: function() {
			var promise = new Promise();

			gapi.client.drive.files.list().execute(function(response) {
				var files = response.items.map(function(file) {
					return {
						icon: 'http://imagination.lancaster.ac.uk/sites/all/themes/imagweb1_zen1/images/_ui/file_icon_PDF.gif',
						name: file.title
					};
				})

				promise.fulfill(files);
			});

			return promise.getFuture();
		},

		createFolder: function() {
			console.log("Creating new folder...");
			return new Promise().getFuture();
		},

		createFile: function() {
			console.log("Creating new file...");
			return new Promise().getFuture();
		}

	};

	return GoogleDriveAdapter;
});