var fs = require('fs');
var Promise = require('./promise');

exports['get-initial-data'] = function(data, callback) {
	this['modules-data'](null, function(error, data) {
		callback(error, { modules: data });
	});
};

exports['modules-data'] = function(data, callback) {

	function moduleFail(promise, name, message) {
		promise.done({
			name: name,
			success: false,
			error: { message: message }
		});
	}

	fs.readdir('mods', function(error, files) {
		if (error) {
			console.log(error);
			return callback(error);}

		Promise.all(files.map(function(file) {
			var prom = new Promise();
			var data = { name: file };
			var manifest = 'mods/' + file + '/manifest.json';

			if (file[0] == '_')
				return;

			fs.exists(manifest, function(exists) {
				if (!exists)
					return moduleFail(prom, file, 'No manifest');

				fs.readFile(manifest, function(error, json) {
					if (error)
						return moduleFail(prom, file, error.message);

					var data;
					try {
						data = JSON.parse(json);
					} catch (err) {
						return moduleFail(prom, file, 'Invalid JSON: ' + err.message);
					}

					prom.done({
						name: file,
						success: true,
						config: data
					});
				})
			});

			return prom.getFuture();

		}).filter(function(prom) {
			return !!prom;

		})).then(function() {
			callback(null, Array.prototype.map.call(arguments, function(a) {
				return a[0];
			}));
		});
	});
};
