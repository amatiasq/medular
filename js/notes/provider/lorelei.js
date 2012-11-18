define(function(require) {

	var ajax = require('core/ajax');
	var Promise = require('core/promise');

	function findNotes() {
		return ajax.db('SELECT * FROM notes');
	}

	function createNote(title, content) {
		return ajax.db('INSERT INTO notes (title,content) VALUES ("' + title + '","' + content + '")');
	}

	function deleteNote(id) {
		return ajax.db('DELETE FROM notes WHERE id=' + id);
	}

	function editNote(id, title, content) {
		return ajax.db('UPDATE notes SET title="' + title + '", content="' + content + '" WHERE id=' + id);
	}

	return {
		find: findNotes,
		create: createNote,
		'delete': deleteNote,
		edit: editNote
	};
});
