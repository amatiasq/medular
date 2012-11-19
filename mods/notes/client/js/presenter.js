define(function(require) {

	require('css!../css/main.less');

	var $ = require('$');
	var Tree = require('tree');
	var view = require('tmpl!main');

	function NotesPresenter(provider) {
		this.provider = provider;

		this.view = {
			main: null,
			title: null,
			sidebar: null,
			content: null,

			newNote: '[data-action="new-note"]',
			search: '[data-action="search"]'
		};

		this.events = {
			'$newNote click': 'createNote',
			'$search click': 'search'
		};
	}

	NotesPresenter.prototype = {
		constructor: NotesPresenter,

		render: function(parent) {
			var main = view()
				.extract(this.view)
				.listen(this.events, this);

			var tree = new Tree().render(this.view.sidebar);

			this.provider.notes.find().then(function(list) {
				tree.addNode({
					title: 'root',
					children: list
				});
			});

			this.render = function(parent) { $(parent).append(main); return this; };
			return this.render(parent);
		},

		createNote: function() {
			console.log("Create Note");
		},

		search: function() {
			console.log("Search");
		}
	};

	return NotesPresenter;
});
