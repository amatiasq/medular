define(function(require) {

	var container = require('tmpl!fs/container');
	var itemTemplate = require('tmpl!fs/item');

	var files = [ 'init.sh', 'bash.rc', 'cosa.js' ];

	var nodes = files.map(function(file) {
		return itemTemplate({
			icon: 'http://portal.sat.gob.gt/sitio/components/com_docman/themes/default/images/icons/32x32/generic.png',
			filename: file
		});
	}).join('');

	var dom = container({ files: nodes }).extended().render();

	document.getElementById('main-container').appendChild(dom);

});