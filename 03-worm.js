
Worm = function (game) {
    this.game = game;
    this.sections = [];
    this.sections.push(this.game.grid.cells[1][1]);
    this.head.beWorm();
    this.directionQueue = [2];
    this.currentDirection = 2;
    this.previousDirection = 2;
    this.keyMapping = [];
    this.mapKeysUnicellular();
}

Worm.prototype.update = function () {
    let nextCell = this.getNextCell();

    if (nextCell.isDeadly)
        this.game.gameOver();

    else if (nextCell.isFood) {
        if (this.isUnicellular)
            this.mapKeysMulticellular();
        this.moveHeadTo(nextCell);
        this.game.scoreUp(this.length);
    }
    else {    // Blank cell
        this.moveHeadTo(nextCell);
        this.moveTail();
    }
}

Worm.prototype.moveHeadTo = function (nextHeadCell) {
    this.sections.unshift(nextHeadCell);
    this.head.beWorm();
}

Worm.prototype.moveTail = function () {
    this.tail.beBlank();
    this.sections.splice(-1, 1);
}

Worm.prototype.getNextCell = function () {
    if (this.directionQueue.hasAny)
        this.currentDirection = this.directionQueue.takeFirstOut();
    return this.game.grid.getNextCell(this);
}

Worm.prototype.die = function () {
    this.sections.forEach(function (section) { section.beObstacle(); });
}

Worm.prototype.mapKeysUnicellular = function () {
    let me = this;
    this.keyMapping[this.game.config.keyCodeForUp] = function () { me.directionQueue.push(0); me.previousDirection = 0; };
    this.keyMapping[this.game.config.keyCodeForRight] = function () { me.directionQueue.push(1); me.previousDirection = 1; };
    this.keyMapping[this.game.config.keyCodeForDown] = function () { me.directionQueue.push(2); me.previousDirection = 2; };
    this.keyMapping[this.game.config.keyCodeForLeft] = function () { me.directionQueue.push(3); me.previousDirection = 3; };
}

Worm.prototype.mapKeysMulticellular = function () {
    let me = this;
    this.keyMapping[this.game.config.keyCodeForUp] = function () { if (!Boolean(me.previousDirection % 2)) return; me.directionQueue.push(0); me.previousDirection = 0; };
    this.keyMapping[this.game.config.keyCodeForRight] = function () { if (Boolean(me.previousDirection % 2)) return; me.directionQueue.push(1); me.previousDirection = 1; };
    this.keyMapping[this.game.config.keyCodeForDown] = function () { if (!Boolean(me.previousDirection % 2)) return; me.directionQueue.push(2); me.previousDirection = 2; };
    this.keyMapping[this.game.config.keyCodeForLeft] = function () { if (Boolean(me.previousDirection % 2)) return; me.directionQueue.push(3); me.previousDirection = 3; };
}

Object.defineProperties(Worm.prototype, {
    head: { get: function () { return this.sections[0] } },
    tail: { get: function () { return this.sections.last } },
    length: { get: function () { return this.sections.length } },
    isUnicellular: { get: function () { return this.length === 1 } }
});
