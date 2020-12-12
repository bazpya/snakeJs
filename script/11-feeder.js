class Feeder {
	constructor(game) {
		this.game = game;
		this.numberOfFoodCellsAtOnce = this.game.config.numberOfFoodCellsAtOnce;
	}

	dropFood = function () {
		let blankCells = this.game.grid.getBlankCells();
		let nextFoodCell = blankCells.pickRandom();
		nextFoodCell.beFood();
	}

	dropFoodInitial = function () {
		let blankCells = this.game.grid.getBlankCells();
		let newFoods;
		if (this.numberOfFoodCellsAtOnce === 1) {
			newFoods = [blankCells.pickRandom()];
		} else {
			newFoods = blankCells.pickRandom(this.numberOfFoodCellsAtOnce);
		}
		newFoods.forEach((cell) => cell.beFood());
	}
} 
