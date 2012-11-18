define(function(require) {

	var $ = require('$');
	var Presenter = require('notes/presenter');
	var lorelei = require('notes/provider/lorelei')
	var template = require('tmpl!notes/main');

	var providers = {
		'lorelei': lorelei
	};

	function Notes(provider, parent) {
		this.presenter = new Presenter(providers[provider]);
		this.presenter.render(parent);
	}

	return Notes;
});
