
Worm = function (game) {
    this.game = game;
    this.sections = [];
    this.sections.push(this.game.grid.cells[1][1]);
    this.head.beWorm();
    this.directionQueue = [2];
    this.currentDirection = 2;
    this.previousDirection = 2;
    this.keyMapping = {};
    this.mapKeys();
}

Worm.prototype.update = function () {
    let nextCell = this.getNextCell();

    if (nextCell.isDeadly)
        this.game.gameOver();

    else if (nextCell.isFood) {
        this.moveHeadTo(nextCell);
        this.game.scoreUp(this.length);
    }
    else {
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

Worm.prototype.mapKeys = function () {
    let me = this;
    this.keyMapping[this.game.config.keyCodes.up] = function () {
        if (me.shouldIgnoreDirection(directionEnum.up))
            return;
        me.directionQueue.push(directionEnum.up);
        me.previousDirection = directionEnum.up;
    };
    this.keyMapping[this.game.config.keyCodes.right] = function () {
        if (me.shouldIgnoreDirection(directionEnum.right))
            return;
        me.directionQueue.push(directionEnum.right);
        me.previousDirection = directionEnum.right;
    };
    this.keyMapping[this.game.config.keyCodes.down] = function () {
        if (me.shouldIgnoreDirection(directionEnum.down))
            return;
        me.directionQueue.push(directionEnum.down);
        me.previousDirection = directionEnum.down;
    };
    this.keyMapping[this.game.config.keyCodes.left] = function () {
        if (me.shouldIgnoreDirection(directionEnum.left))
            return;
        me.directionQueue.push(directionEnum.left);
        me.previousDirection = directionEnum.left;
    };
}

Worm.prototype.shouldIgnoreDirection = function (direction) {
    if (direction === this.previousDirection)
        return true;
    if (this.isMulticellular && direction === oppositeDirectionEnum[this.previousDirection]) // No backwards moving
        return true;
}

Object.defineProperties(Worm.prototype, {
    head: { get: function () { return this.sections[0] } },
    tail: { get: function () { return this.sections.last } },
    length: { get: function () { return this.sections.length } },
    isUnicellular: { get: function () { return this.length === 1 } },
    isMulticellular: { get: function () { return this.length !== 1 } },
});
