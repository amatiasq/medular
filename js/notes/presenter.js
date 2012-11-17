define(function(require) {
	
	var $ = require('$');
	var Tree = require('notes/tree');
	var view = require('tmpl!notes/main');

	function NotesPresenter() {
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
			'$search click': 'search',
		};
	}

	NotesPresenter.prototype = {
		constructor: NotesPresenter,

		render: function(parent) {
			var main = view()
				.elements(this.view)
				.listen(this.events, this);

			var tree = new Tree().render(this.view.sidebar);

			tree.addNode({
				title: 'root',
				children: [{
					title: 'Inbox'
				}, {
					title: 'Programacion',
					children: [{
						title: 'General'
					}, {
						title: 'JS'
					}, {
						title: 'Dart'
					}]
				}]
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
