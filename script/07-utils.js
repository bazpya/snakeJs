function log(message) {
    console.log(message);
}

function dasoo() {
    log('dasoo');
}

isDefined = function (variable) {
    return typeof variable !== 'undefined';
}

isUndefined = function (variable) {
    return typeof variable === 'undefined';
}

isFunction = function (variable) {
    return typeof variable === 'function';
}

ifFunctionRun = function (variable) {
    if (isFunction(variable))
        variable();
}

//###########################  Array  ############################################

Array.prototype.takeFirstOut = function () {
    let firstElement = this.shift();
    return firstElement;
}

Array.prototype.pickRandom = function (batchSize = 1) {
    if (batchSize === 1) {
        let randomIndex = Math.floor(Math.random() * this.length);
        return this[randomIndex];
    }
    else {
        let clone = this.clone();
        let rand = new Random();
        for (let i = 1; i < clone.length; i++) {
            let ind = rand.getInt(0, i - 1);
            let temp = clone[ind];
            clone[ind] = clone[i];
            clone[i] = temp;
        }
        return clone.slice(0, batchSize);
    }
}

Array.prototype.clone = function (i = 0, elementCount) {
    if (isUndefined(elementCount))
        elementCount = this.length;
    return this.slice(i, elementCount);
}

Array.prototype.discardElements = function () {
    while (this.hasAny)
        this.takeFirstOut();
}

Array.prototype.getMax = function () {
    let index = this.getIndexOfMax();
    return this[index];
}

Array.prototype.getIndexOfMax = function () {
    let index = 0;
    let max = this[0];
    for (let i = 1; i < this.length; i++) {
        if (this[i] > max) {
            index = i;
            max = this[i];
        }
    }
    return index;
}

Array.prototype.sortAscending = function (valueGetter) {
    this.sort((a, b) => valueGetter(a) - valueGetter(b));
}

Array.prototype.sortDescending = function (valueGetter) {
    this.sort((a, b) => valueGetter(b) - valueGetter(a));
}

Array.prototype.getWithHighest = function (valueGetter, elementCount) {
    let temp = this.clone();
    temp.sortDescending(valueGetter);
    return temp.clone(0, elementCount);
}

Object.defineProperties(Array.prototype, {
    last: { get: function () { return this[this.length - 1] } },
    hasAny: { get: function () { return Boolean(this.length) } },
});

//###########################  Random  ############################################

Random = function () {
    //
}

Random.prototype.getInt = function (lower, upper) {  // Inclusive of boundaries
    return lower + Math.floor(Math.random() * (upper - lower + 1));
}
