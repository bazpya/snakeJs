function log(message) {
    console.log(message);
}

Object.defineProperties(Array.prototype, {
	last: { get: function () { return this[this.length - 1] } }
});

//############################  Worm  #############################################
//#################################################################################

Worm = function (game) {
    this.game = game;
    this.sections = [];
    this.sections.push(this.game.grid.cells[1][1]);
    this.head.beWorm();
};

Object.defineProperties(Worm.prototype, {
    head: { get: function () { return this.sections[0] } },
    length: { get: function () { return this.sections.length } },
    tail: { get: function () { return this.sections.last } }
});

Worm.prototype.update = function () {
    let nextCell = this.getNextCell();
	if (nextCell.isObstacle || nextCell.isWorm) {    // Forbidden cell
		this.game.gameOver();
	}
	else if (nextCell.isFood) {    // Food cell
		this.moveHeadTo(nextCell);
		this.game.foodBeep();
		this.game.scoreDisplay.innerHTML = this.length;
		this.redefineUpdate();
		this.game.speedUp();
	}
	else {    // Normal cell
		this.moveHeadTo(nextCell);
		this.moveTail();
	};
};

Worm.prototype.redefineUpdate = function () {
    this.game.defineSelfBiteAvoidingKeyCodeMapping();
    this.update = function () {
        let nextCell = this.getNextCell();
        if (nextCell.isObstacle || nextCell.isWorm) {    // Forbidden cell
            this.game.gameOver();
        }
        else if (nextCell.isFood) {    // Food cell
            this.moveHeadTo(nextCell);
            this.game.foodBeep();
            this.game.scoreDisplay.innerHTML = this.length;
            clearInterval(this.game['runningLoop' + this.game.runLoopId]);
            delete this.game['runningLoop' + this.game.runLoopId];
            this.game.speedUp();
            this.game.run();

        }
        else {    // Normal cell
            this.moveHeadTo(nextCell);
            this.moveTail();
        };
    };
};

Worm.prototype.moveHeadTo = function (nextHeadCell) {
    this.sections.unshift(nextHeadCell);
    this.head.beWorm();
};

Worm.prototype.moveTail = function () {
    this.tail.beBlank();
    this.sections.splice(-1, 1);
};

Worm.prototype.getNextCell = function () {
    if (Boolean(this.game.directions.length))
        this.game.currentDirection = this.game.directions.shift();
    return this.game.nextCellGettingFunctions[this.game.currentDirection]();
};
