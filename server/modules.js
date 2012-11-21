var _ = require('underscore');
var fs = require('fs');
var Promise = require('./promise');

function moduleFail(promise, name, message) {
	promise.done({
		name: name,
		success: false,
		error: { message: message }
	});
}

var mainPromise = new Promise();

fs.readdir('mods', function(error, files) {
	if (error)
		throw error;

	Promise.all(
		files.filter(function(filename) {
			return filename[0] !== '_'
		}).map(function(filename) {
			var prom = new Promise();
			var data = { name: filename };
			var manifest = 'mods/' + filename + '/manifest.json';

			fs.exists(manifest, function(exists) {
				if (!exists)
					return moduleFail(prom, filename, 'No manifest');

				fs.readFile(manifest, function(error, json) {
					if (error)
						return moduleFail(prom, filename, error.message);

					var data;
					try {
						data = JSON.parse(json);
					} catch (err) {
						return moduleFail(prom, filename, 'Invalid JSON: ' + err.message);
					}

					prom.done({
						success: true,
						name: filename,
						manifest: data
					});
				})
			});

			return prom.getFuture();
		})
	).then(function() {
		mainPromise.done(_.flatten(_.toArray(arguments)));
	})
});

exports.ready = function(callback, scope) {
	mainPromise.getFuture().onDone(callback, scope);
};
exports.getManifests = function(callback) {
	// FIXME: modify future to retrieve value;
	return mainPromise.getFuture()._args[0];
};
