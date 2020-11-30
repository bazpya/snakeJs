Worm = function (game) {
    this.game = game;
    this.sections = [];
    let origin = this.game.grid.getStartCell();
    let originIsFood = origin.isFood;
    this.sections.push(origin);
    this.head.beWorm();
    if (originIsFood)
        this.game.feeder.dropFood();
    this.direction = {
        queue: [directionEnum.right],
        current: directionEnum.right,
        lastInput: directionEnum.right,
        funcs: {},
    };
    this.age = 0;
    this.mapKeys();
    this.game.infoboard.updateScore(this.length);
}

Worm.prototype.step = function () {
    this.age++;
    let nextCell = this.getNextCell();

    if (nextCell.isDeadly) {
        this.game.wormDied();
        this.sections.forEachInterval(s => s.beObstacle(), this.game.intervaller.period);
    }
    else if (nextCell.isFood) {
        this.moveHeadTo(nextCell);
        this.game.foodEaten();
    }
    else {
        this.moveHeadTo(nextCell);
        this.moveTail();
    }
}

Worm.prototype.getNextCell = function () {
    if (this.direction.queue.hasAny)
        this.direction.current = this.direction.queue.takeFirstOut();
    return this.game.grid.getNextCell(this.head, this.direction.current);
}

Worm.prototype.moveHeadTo = function (nextHeadCell) {
    this.sections.addToFront(nextHeadCell);
    this.head.beWorm();
}

Worm.prototype.moveTail = function () {
    this.tail.beBlank();
    this.sections.takeLastOut();
}

Worm.prototype.disappear = function () {
    this.sections.forEach(s => s.beBlank());
}

Worm.prototype.mapKeys = function () {
    let me = this;
    for (let directionName in directionEnum) {
        let directionCode = directionEnum[directionName];
        this.direction.funcs[directionCode] = function () {
            if (me.shouldIgnoreDirection(directionCode))
                return;
            me.direction.queue.push(directionCode);
            me.direction.lastInput = directionCode;
        };
    }
}

Worm.prototype.shouldIgnoreDirection = function (dirCode) {
    if (dirCode === this.direction.lastInput)
        return true;
    if (this.isMulticellular && dirCode === oppositeDirectionEnum[this.direction.lastInput]) // No backwards moving
        return true;
}

Object.defineProperties(Worm.prototype, {
    head: { get: function () { return this.sections[0] } },
    tail: { get: function () { return this.sections.last } },
    length: { get: function () { return this.sections.length } },
    isUnicellular: { get: function () { return this.length === 1 } },
    isMulticellular: { get: function () { return this.length !== 1 } },
});
