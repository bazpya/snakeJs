class Feeder {
	#grid;
	#foodCountAtOnce;

	constructor(grid, foodCountAtOnce = 1) {
		this.#grid = grid;
		this.#foodCountAtOnce = foodCountAtOnce;
	}

	dropFood() {
		const blankCells = this.#grid.getBlankCells();
		const randomIndex = Math.floor(Math.random() * blankCells.length);
		const nextFoodCell = blankCells[randomIndex];
		nextFoodCell.beFood();
	}
} 
