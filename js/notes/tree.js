define(function(require) {
	
	var $ = require('$');
	var _ = require('Underscore');
	var view = require('tmpl!notes/tree');
	var nodeView = require('tmpl!notes/tree-node');

	function Tree() {
		this.view = {
			main: null
		};

		this.events = {
			//'.parent click': 'nada'
		};
	}

	Tree.prototype = {
		constructor: Tree,

		render: function(parent) {
			var main = view()
				.elements(this.view)
				.listen(this.events, this);

			this.render = function(parent) { $(parent).append(main); return this; };
			return this.render(parent);
		},

		addNode: function(data, parent) {
			parent = parent || this.view.main;
			this._addNode(parent, data);
		},

		_addNode: function(parent, data) {
			var node = nodeView(data);
			parent.append(node);

			if (data.children)
				data.children.forEach(this._addNode.bind(this, node.find('.children')));
		}
	};

	return Tree;
});