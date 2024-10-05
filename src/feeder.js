class Feeder {
	#grid;
	#foodCountAtOnce;

	constructor(grid, foodCountAtOnce = 1) {
		this.#grid = grid;
		this.#foodCountAtOnce = foodCountAtOnce;
	}

	dropFood() {
		let blankCells = this.#grid.getBlankCells();
		let nextFoodCell = BazArray.pickRandom(blankCells).items[0];
		nextFoodCell.beFood();
	}

	dropFoodInitial() {
		let blankCells = this.#grid.getBlankCells();
		let newFoods = BazArray.pickRandom(blankCells, this.#foodCountAtOnce).items;
		newFoods.forEach((cell) => cell.beFood());
	}
} 
