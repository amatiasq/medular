define(function(require) {

	var $ = require('$');
	var events = require('helpers/events');
	var template = require('tmpl!fs/container');
	var itemTemplate = require('tmpl!fs/item');

	function FSPresenter(provider) {
		this.provider = provider;
		this.dom = {
			container: null,
			content: null
		};
	}

	FSPresenter.prototype = {

		constructor: FSPresenter,

		events: {
			'.toolbar click': function(event) {
				var type = (event.target || event.srcElement).getAttribute('data-click');
				if (this.toolbar[type])
					this.toolbar[type].call(this);
			}
		},

		toolbar: {
			'create-folder': function() {
				this.provider.createFolder().then(function() { '...' });
			},
			'create-file': function() {
				this.provider.createFile().then(function() { '...' });
			}
		},

		render: function(parent) {

			var main = this.dom.container = template({}).extended().render();
			this.dom.content = $('.content', main);
			events.apply(main, this.events, this);

			this.render = function(parent) {
				if (parent)
					parent.appendChild(main);
			};

			return this.render(parent);
		},

		browse: function() {
			this.provider.browse('/').onDone(this.setItems, this);
		},

		setItems: function(files) {
			var nodes = files.map(function(file) {
				return itemTemplate({
					icon: file.icon,
					filename: file.name
				});
			});

			console.log(nodes);
			this.dom.content.html(nodes.join(''));
		},

		clear: function() {
			this.dom.content.html('');
		}
	};

	return FSPresenter;
});