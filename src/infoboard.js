"use strict";

class Infoboard {
	#items = {};

	constructor(parent, items, title) {
		parent.classList.add("infoboard")

		if (title) {
			const titleElem = document.createElement('b');
			titleElem.classList.add('infoboard-title');
			titleElem.innerText = title;
			parent.appendChild(titleElem);
		}

		const me = this;
		for (let key in items) {
			const initialValue = items[key];

			let itemElem = document.createElement('div');
			itemElem.classList.add('infoboard-item');

			let labelElem = document.createElement('span');
			labelElem.classList.add("infoboard-label");
			labelElem.innerText = key + ": ";
			itemElem.appendChild(labelElem);

			let valueElem = document.createElement('span');
			valueElem.classList.add("infoboard-value");
			itemElem.appendChild(valueElem);

			me.#items[key] = {};
			me.#items[key].get = function () { return valueElem.innerText };
			me.#items[key].set = function (val) { valueElem.innerText = val };

			me.#items[key].set(initialValue);
			parent.appendChild(itemElem);
		}
	}

	get(key) {
		return this.#items[key].get();
	}

	set(items) {
		for (let key in items) {
			const val = items[key];
			this.#items[key].set(val);
		}
	}
}
