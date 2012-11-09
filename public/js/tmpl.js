define(function(require) {

    var text = require('vendor/text'),
    	Handlebars = require('vendor/handlebars'),
        cache = [];

    function load(name, parentRequire, done, config) {
        text.load('../tmpl/' + name + '.mustache', parentRequire, function(template) {
            done(cache[name] = Handlebars.compile(template));
        }, config);
    }

    return {
        load: load,
    };
});