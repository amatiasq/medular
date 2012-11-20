define(function(require) {

	var Emitter = require('core/emitter');

	function MessageBus() {
		this._emitter = new Emitter();
	}

	MessageBus.prototype = {
		constructor: MessageBus,

		listen: function(message, callback) {
			this._emitter.on(message, callback);
		},

		post: function() {
			this._emitter.emit.apply(this._emitter, arguments);
		}

	};

	return MessageBus;
});
