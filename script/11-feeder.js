class Feeder {
	#grid;
	#foodCountAtOnce;

	constructor(grid, foodCountAtOnce = 1) {
		this.#grid = grid;
		this.#foodCountAtOnce = foodCountAtOnce;
	}

	dropFood() {
		let blankCells = this.#grid.getBlankCells();
		let nextFoodCell = blankCells.pickRandom();
		nextFoodCell.beFood();
	}

	dropFoodInitial() {
		let blankCells = this.#grid.getBlankCells();
		let newFoods;
		if (this.#foodCountAtOnce === 1) {
			newFoods = [blankCells.pickRandom()];
		} else {
			newFoods = blankCells.pickRandom(this.#foodCountAtOnce);
		}
		newFoods.forEach((cell) => cell.beFood());
	}
} 
