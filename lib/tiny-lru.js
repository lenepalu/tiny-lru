"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Tiny LRU cache for Client or Server
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2016
 * @license BSD-3-Clause
 * @link https://github.com/avoidwork/tiny-lru
 * @version 1.1.0
 */
(function (global) {
	var LRUItem = function LRUItem(value) {
		_classCallCheck(this, LRUItem);

		this.next = null;
		this.previous = null;
		this.value = value;
	};

	var LRU = function () {
		function LRU(max) {
			_classCallCheck(this, LRU);

			this.cache = {};
			this.max = max;
			this.first = null;
			this.last = null;
			this.length = 0;
		}

		_createClass(LRU, [{
			key: "delete",
			value: function _delete(key) {
				return this.remove(key);
			}
		}, {
			key: "evict",
			value: function evict() {
				if (this.last !== null) {
					this.remove(this.last);
				}

				return this;
			}
		}, {
			key: "get",
			value: function get(key) {
				var cached = this.cache[key],
				    output = undefined;

				if (cached) {
					output = cached.value;
					this.set(key, cached.value);
				}

				return output;
			}
		}, {
			key: "has",
			value: function has(key) {
				return this.cache[key] !== undefined;
			}
		}, {
			key: "remove",
			value: function remove(key) {
				var cached = this.cache[key];

				if (cached) {
					delete this.cache[key];
					this.length--;

					if (cached.previous !== null) {
						this.cache[cached.previous].next = cached.next;
					}

					if (cached.next !== null) {
						this.cache[cached.next].previous = cached.previous;
					}

					if (this.first === key) {
						this.first = cached.previous;
					}

					if (this.last === key) {
						this.last = cached.next;
					}
				}

				return cached;
			}
		}, {
			key: "set",
			value: function set(key, value) {
				var obj = this.remove(key);

				if (!obj) {
					obj = new LRUItem(value);
				} else {
					obj.value = value;
				}

				obj.next = null;
				obj.previous = this.first;
				this.cache[key] = obj;

				if (this.first) {
					this.cache[this.first].next = key;
				}

				this.first = key;

				if (!this.last) {
					this.last = key;
				}

				if (++this.length > this.max) {
					this.evict();
				}

				return this;
			}
		}]);

		return LRU;
	}();

	function factory() {
		var max = arguments.length <= 0 || arguments[0] === undefined ? 1000 : arguments[0];

		return new LRU(max);
	}

	// Node, AMD & window supported
	if (typeof exports !== "undefined") {
		module.exports = factory;
	} else if (typeof define === "function" && define.amd) {
		define(function () {
			return factory;
		});
	} else {
		global.lru = factory;
	}
})(typeof window !== "undefined" ? window : global);
