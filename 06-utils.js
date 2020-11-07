function log(message) {
    console.log(message);
}

Object.defineProperties(Array.prototype, {
	last: { get: function () { return this[this.length - 1] } }
});
