define(function(require) {

    var text = require('vendor/text');
    var Handlebars = require('vendor/handlebars');
    var view = require('core/view');
    var cache = [];

    function load(name, parentRequire, done, config) {
        text.load('template/' + name + '.mustache', parentRequire, function(template) {
            done(cache[name] = view(Handlebars.compile(template)));
        }, config);
    }

    return {
        load: load,
    };
});