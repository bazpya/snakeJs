Feeder = function (game) {
	this.game = game;
	this.feedingTimeStep = game.config.feedingTimeStep;
	this.loopId = 0;
	this.foodCells = [];
}

Feeder.prototype.feed = function () {
	this.loopId++;
	let me = this;
	this.loopHandle = setInterval(() => me.dropFood(), me.feedingTimeStep);
}

Feeder.prototype.stopFeeding = function () {
	clearInterval(this.loopHandle);
	delete this.loopHandle;
}

Feeder.prototype.dropFood = function () {
	this.foodCells.forEach(function (cell, index) {
		if (cell.isFood)
			cell.beBlank();
	})

	let blankCells = this.game.grid.getBlankCells();
	this.foodCells = [];

	for (let i = 1; i <= this.game.config.numberOfFoodCellsAtOnce; i++) {
		let myRandom = new Random();
		let cell = myRandom.pickElement(blankCells);
		cell.beFood();
		this.foodCells.push(cell);
	}
}

Object.defineProperties(Feeder.prototype, {
	loopHandle: {
		get: function () { return this['feedingLoop' + this.loopId]; },
		set: function (val) { this['feedingLoop' + this.loopId] = val; }
	},
});
