define(function(require) {
	
	var $ = require('$');
	var view = require('tmpl!notes/main');

	function NotesPresenter() {
		this.view = {
			main: null,
			title: null,
			tree: null,
			content: null,

			newNote: '[data-action="new-note"]',
			search: '[data-action="search"]'
		};
	}

	NotesPresenter.prototype = {
		constructor: NotesPresenter,

		events: {
			'$newNote click': 'createNote',
			'$search click': 'search',
		},

		render: function(parent) {
			var main = view()
				.elements(this.view)
				.listen(this.events, this);

			this.render = function(parent) { $(parent).append(main); };
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
