"use strict";

class Overlay {
	#element;
	#line1;
	#line2;
	#line3;
	#clickFunc;

	constructor(parent, clickFunc, content) {
		this.#clickFunc = clickFunc;

		this.#element = document.createElement('div');
		this.#element.classList.add("overlay", "overlay-popdown");


		this.#line1 = document.createElement('b');
		this.#line1.classList.add('overlay-line1');
		this.#element.appendChild(this.#line1);
		if (content.line1)
			this.line1 = content.line1;

		this.#line2 = document.createElement('b');
		this.#line2.classList.add('overlay-line2');
		this.#element.appendChild(this.#line2);
		if (content.line2)
			this.line2 = content.line2;

		this.#line3 = document.createElement('b');
		this.#line3.classList.add('overlay-line3');
		this.#element.appendChild(this.#line3);
		if (content.line3)
			this.line3 = content.line3;

		this.bindHandler();
		parent.appendChild(this.#element);
		this.popUp();
	}

	get line1() { return this.#line1.innerText }
	set line1(val) { this.#line1.innerText = val; }
	get line2() { return this.#line2.innerText }
	set line2(val) { this.#line2.innerText = val; }
	get line3() { return this.#line3.innerText }
	set line3(val) { this.#line3.innerText = val; }

	bindHandler() {
		let me = this;
		this.#element.onclick = function () {
			me.#clickFunc();
		};
	}

	unbindHandler() {
		this.#element.onclick = null;
	}

	popUp() {
		this.#element.classList.replace('overlay-popdown', 'overlay-popup');
	}

	popDown() {
		this.#element.classList.replace('overlay-popup', 'overlay-popdown');
	}

	beTranslucent() {
		this.#element.classList.add("overlay-translucent");
	}

	beOpaque() {
		this.#element.classList.remove("overlay-translucent");
	}
}
