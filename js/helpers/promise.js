define(function(require) {

	var slice = Array.prototype.slice;

	function Promise() {
		this._future = new Future();
	}

	Promise.prototype = {
		constructor: Promise,

		fulfill: function(var_args) {
			var args = slice.call(arguments);
			this.getFuture()._arrived('success', args);
		},

		fail: function(var_args) {
			var args = slice.call(arguments);
			this.getFuture()._arrived('failed', args);
		},

		getFuture: function() {
			return this._future;
		}
	};

	Promise.fulfilled = function() {
		var a = new Promise;
		a.fulfill.apply(a, arguments);
		return a;
	};

	Promise.failed = function() {
		var a = new Promise;
		a.fail.apply(a, arguments);
		return a;
	};


	function Future() {
		this._args = null;
		this._fn = {
			'success': [],
			'failed': [],
			'finally': []
		};
	}

	Future.prototype = {
		constructor: Future,

		_wait: function(type, callback, scope) {
			if (!callback) {
				console.warn("No callback passed");
			} else if (this._fn[type] === true) {
				callback.apply(scope, this._args)
			} else if (this._fn[type]) {
				this._fn[type].push({
					callback: callback,
					scope: scope
				});
			}
			return this;
		},

		_arrived: function(type, args) {
			if (!Array.isArray(this._fn[type]))
				throw new Error('Future already arrived!');

			this._val = args;

			function invoke(i) {
				i.callback.apply(i.scope, args);
			}

			this._fn[type].forEach(invoke);
			this._fn['finally'].forEach(invoke);

			this._fn = {
				'success': false,
				'failed': false,
				'finally': true
			};

			this._fn[type] = true;
		},

		onDone: function(callback, scope) {
			return this._wait('success', callback, scope);
		},

		onError: function(callback, scope) {
			return this._wait('failed', callback, scope);
		},

		onFinally: function(callback, scope) {
			return this._wait('finally', callback, scope);
		},

		then: function(success, error, fin) {
			if (success)
				this.onDone(success);

			if (error)
				this.onError(error);

			if (fin)
				this.onFinally(fin);
		}
	};

	return Promise;
});