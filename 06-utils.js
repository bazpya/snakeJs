function log(message) {
    console.log(message);
}

Object.defineProperties(Array.prototype, {
    last: { get: function () { return this[this.length - 1] } },
    hasAny: { get: function () { return Boolean(this.length) } },
});

Array.prototype.takeFirstOut = function () {
    let firstElement = this.shift();
    return firstElement;
}
