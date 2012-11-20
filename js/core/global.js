define(function(require) {

	if (window.GlobalModules)
		return GlobalModules;

	return window.GlobalModules = {

		_modules: {},

		register: function(id, obj) {
			this._modules[id] = obj;
			return obj;
		},

		isRegistered: function(id) {
			return this._modules.hasOwnProperty(id);
		},

		get: function(id) {
			return this._modules[id];
		}

	};
});
