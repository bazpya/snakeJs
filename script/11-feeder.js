class Feeder {
	#foodCountAtOnce;
	constructor(game, foodCountAtOnce) {
		this.game = game;
		this.#foodCountAtOnce = foodCountAtOnce;
	}

	dropFood() {
		let blankCells = this.game.grid.getBlankCells();
		let nextFoodCell = blankCells.pickRandom();
		nextFoodCell.beFood();
	}

	dropFoodInitial() {
		let blankCells = this.game.grid.getBlankCells();
		let newFoods;
		if (this.#foodCountAtOnce === 1) {
			newFoods = [blankCells.pickRandom()];
		} else {
			newFoods = blankCells.pickRandom(this.#foodCountAtOnce);
		}
		newFoods.forEach((cell) => cell.beFood());
	}
} 
