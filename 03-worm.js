
Worm = function (game) {
    this.game = game;
    this.sections = [];
    this.sections.push(this.game.grid.cells[1][1]);
    this.head.beWorm();
}

Worm.prototype.update = function () {
    let nextCell = this.getNextCell();
    if (nextCell.isObstacle || nextCell.isWorm) {    // Forbidden cell
        this.game.gameOver();
    }
    else if (nextCell.isFood) {    // Food cell
        this.moveHeadTo(nextCell);
        this.game.sound.foodBeep();
        this.game.scoreBoard.update(this.length);
        this.redefineUpdate();
        this.game.speedUp();
    }
    else {    // Blank cell
        this.moveHeadTo(nextCell);
        this.moveTail();
    }
}

Worm.prototype.redefineUpdate = function () {
    this.game.defineSelfBiteAvoidingKeyCodeMapping();
    this.update = function () {
        let nextCell = this.getNextCell();
        if (nextCell.isObstacle || nextCell.isWorm) {    // Forbidden cell
            this.game.gameOver();
        }
        else if (nextCell.isFood) {    // Food cell
            this.moveHeadTo(nextCell);
            this.game.sound.foodBeep();
            this.game.scoreBoard.update(this.length);
            clearInterval(this.game['runningLoop' + this.game.runLoopId]);
            delete this.game['runningLoop' + this.game.runLoopId];
            this.game.speedUp();
            this.game.run();

        }
        else {    // Normal cell
            this.moveHeadTo(nextCell);
            this.moveTail();
        }
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
    if (Boolean(this.game.directions.length))
        this.game.currentDirection = this.game.directions.shift();
    return this.game.nextCellGettingFunctions[this.game.currentDirection]();
}

Worm.prototype.die = function () {
    this.sections.forEach(function (section) { section.beObstacle(); });
}

Object.defineProperties(Worm.prototype, {
    head: { get: function () { return this.sections[0] } },
    tail: { get: function () { return this.sections.last } },
    length: { get: function () { return this.sections.length } },
    isUnicellular: { get: function () { return this.length === 1 } }
});
