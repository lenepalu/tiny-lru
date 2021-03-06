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

class LRUItem {
	constructor (value) {
		this.next = null;
		this.previous = null;
		this.value = value;
	}
}

class LRU {
	constructor (max) {
		this.cache = {};
		this.max = max;
		this.first = null;
		this.last = null;
		this.length = 0;
	}

	delete (key) {
		return this.remove(key);
	}

	evict () {
		if (this.last !== null) {
			this.remove(this.last);
		}

		return this;
	}

	get (key) {
		let cached = this.cache[key],
			output;

		if (cached) {
			output = cached.value;
			this.set(key, cached.value);
		}

		return output;
	}

	has (key) {
		return this.cache[key] !== undefined;
	}

	remove (key) {
		let cached = this.cache[key];

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

	set (key, value) {
		let obj = this.remove(key);

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
}

function factory (max = 1000) {
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
}}(typeof window !== "undefined" ? window : global));
