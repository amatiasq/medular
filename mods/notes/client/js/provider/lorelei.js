define(function(require) {

	var ajax = require('core/server');
	var Promise = require('core/promise');

	function CRUD(table, fields) {
		this.table = table;
		this.fields = fields;
	}

	CRUD.prototype = {
		constructor: CRUD,

		create: function(data) {
			var values;

			if (typeof data === 'object') {
				values = this.fields.map(function(field) {
					return field in data ? data[field] : 'NULL';
				});
			} else {
				values = Array.prototype.slice.call(arguments);
				for (var i = values.length; i < this.fields.length; i++)
					values.push('NULL');
			}

			return ajax.data(
				'INSERT INTO ' + this.table + ' (' + this.fields.join(',') +
				') VALUES ("' + values.join('","') + '")'
			).transform(function(data) {
				return data.insertId;
			});
		},

		retrieve: function() {
			return ajax.data('SELECT * FROM ' + this.table);
		},

		update: function(data) {
			var set;

			if (typeof data === 'object') {
				set = this.fields.filter(function(field) {
					return field in data;
				}).map(function(field) {
					return field + '="' + data[field] + '"'
				});
			} else {
				set = Array.prototype.slice.call(arguments).map(function(val, index) {
					return this.fields[index] + '="' + val + '"';
				}, this);
			}

			return ajax.data('UPDATE ' + this.table + ' SET ' + set.join(',') + ' WHERE id=' + data.id);
		},

		delete: function(id) {
			if (typeof id !== 'number')
				id = id.id;

			return ajax.data('DELETE FROM ' + this.table + ' WHERE id=' + id);
		}
	};

	CRUD.prototype.remove = CRUD.prototype['delete'];
	CRUD.prototype.find = CRUD.prototype.retrieve;

	return {
		notes: new CRUD('notes', [ 'title', 'content' ]),
		notebooks: new CRUD('notes_notebook', [ 'title', 'parent' ]),

		getTree: function() {

			return Promise.parallel(
				this.notebooks.find(),
				this.notes.find()
			).transform(function(books, notes) {

				var byId = {};
				var tree = {
					title: 'root',
					books: [],
					notes: []
				};

				books[0].forEach(function(data) {
					var book = byId[data.id] = {
						id: data.id,
						title: data.title,
						books: [],
						notes: []
					};

					if (data.parent)
						byId[data.parent].books.push(book);
					else
						tree.books.push(book);
				});

				notes[0].forEach(function(data) {
					var note = {
						id: data.id,
						title: data.title
					};

					if (data.parent)
						byId[data.parent].notes.push(note);
					else
						tree.notes.push(note);
				});

				return tree;
			});
		}
	};
});
