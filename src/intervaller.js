"use strict";

class Intervaller {
	#func;
	#period;
	#periodStep;
	#periodMin;
	#loopId;

	constructor(func, period = 1000, periodStep = 10, periodMin = 1) {
		this.#func = func;
		this.#period = period;
		this.#periodStep = periodStep;
		this.#periodMin = periodMin;
		this.#loopId = 0;
	}

	get #loopHandle() { return this['#runningLoop' + this.#loopId] }
	set #loopHandle(val) { this['#runningLoop' + this.#loopId] = val }
	get period() { return this.#period };

	run() {
		this.#loopId++;
		let me = this;
		this.#loopHandle = setInterval(() => {
			me.#func();
		}, me.#period);
	}

	stop() {
		clearInterval(this.#loopHandle);
	}

	stepUp() {
		const newPeriod = this.#period - this.#periodStep;
		if (newPeriod >= this.#periodMin) {
			this.stop();
			this.#period = newPeriod;
			this.run();
		}
	}

	stepDown() {
		this.stop();
		this.#period += this.#periodStep;
		this.run();
	}

	setPeriod(p) {
		if (p >= this.#periodMin) {
			this.stop();
			this.#period = p;
			this.run();
		} else {
			throw "Cannot set period below minimum";
		}
	}
}
