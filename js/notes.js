define(function(require) {
	
	var $ = require('$');
	var Presenter = require('notes/presenter');
	//var Evernote = reqire('notes/provider/evernote')
	var template = require('tmpl!notes/main');

	function Notes(provider, parent) {
		this.presenter = new Presenter();
		this.presenter.render(parent);
	}

	return Notes;
});