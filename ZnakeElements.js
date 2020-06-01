window.initialiseElements = function () {
	window.gridContainer = document.getElementById('grid-container');
	window.scoreDisplay = document.getElementById('score');
	window.theButton = document.getElementById('button');
	window.pauseOverlay = document.getElementById('pause');
	window.splash = document.getElementById('splash');
	window.grid = makeGrid(gridHeight, gridWidth);
	window.gridContainer.appendChild(grid);
	window.worm = new Worm();
	window.scoreDisplay.innerHTML = worm.length;
}

//###########################  Grid  ##############################################
//#################################################################################

window.makeGrid = function (height, width) {
	let newGrid = document.createElement('table');
	newGrid.id = 'grid';
	newGrid.cells = [];
	for (let r = 0; r < height; r++) {
		let newRow = document.createElement('tr');
		newGrid.cells.push([]);
		for (let c = 0; c < width; c++) {
			let newCell = Cell(r, c);
			// if(x == 1 || x == width - 2 || y == 1 || y == height - 2) newCell.beFood();
			// if(x == 2 || x == width - 3 || y == 2 || y == height - 3) newCell.beFood();
			// if(x == 3 || x == width - 4 || y == 3 || y == height - 4) newCell.beFood();
			// if(x == 4 || x == width - 5 || y == 4 || y == height - 5) newCell.beFood();
			// if(x == 5 || x == width - 6 || y == 5 || y == height - 6) newCell.beFood();
			// if(x == 6 || x == width - 7 || y == 6 || y == height - 7) newCell.beFood();
			if (c == 0 || c == width - 1 || r == 0 || r == height - 1) newCell.beObstacle();
			newRow.appendChild(newCell);
			newGrid.cells[r].push(newCell);
		};
		newGrid.appendChild(newRow);
	};
	return newGrid;
};

//############################  Cell  #############################################
//#################################################################################

Object.defineProperties(window.HTMLTableCellElement.prototype, {
	row: { value: 0, writable: true },
	column: { value: 0, writable: true },
	isObstacle: { value: 0, writable: true },
	isWorm: { value: 0, writable: true },
	isFood: { value: 0, writable: true },
	isNormal: { get: function () { return !(this.isWorm || this.isFood || this.isObstacle) } }
});

window.HTMLTableCellElement.prototype.beNormal = function () {
	this.isObstacle = 0; this.isWorm = 0; this.isFood = 0;
	this.className = 'cell';
};

window.HTMLTableCellElement.prototype.beObstacle = function () {
	this.isObstacle = 1; this.isWorm = 0; this.isFood = 0;
	this.className = 'obstacle';
};

window.HTMLTableCellElement.prototype.beWorm = function () {
	this.isObstacle = 0; this.isWorm = 1; this.isFood = 0;
	this.className = 'worm';
};

window.HTMLTableCellElement.prototype.beFood = function () {
	this.isObstacle = 0; this.isWorm = 0; this.isFood = 1;
	this.className = 'food';
};

window.Cell = function (rowNumber, columnNumber) {
	let newElement = document.createElement('td');
	newElement.className = 'cell';
	newElement.row = rowNumber;
	newElement.column = columnNumber;
	return newElement;
};

//############################  Worm  #############################################
//#################################################################################

window.Worm = function () {
	this.sections = [];
	this.sections.push(grid.cells[1][1]);
	this.head.beWorm();
};

Object.defineProperties(window.Worm.prototype, {
	head: { get: function () { return this.sections[0] } },
	length: { get: function () { return this.sections.length } },
	tail: { get: function () { return this.sections.last } }
});

window.Worm.prototype.update = function () {
	let nextCell = this.getNextCell();
	if (nextCell.isObstacle || nextCell.isWorm) {    // Forbidden cell
		window.gameOver();
	}
	else if (nextCell.isFood) {    // Food cell
		this.moveHeadTo(nextCell);
		window.foodBeep();
		window.scoreDisplay.innerHTML = this.length;
		this.redefineUpdate();
		window.speedUp();
	}
	else {    // Normal cell
		this.moveHeadTo(nextCell);
		this.moveTail();
	};
};

window.Worm.prototype.redefineUpdate = function () {
	window.defineSelfBiteAvoidingKeyCodeMapping();
	this.update = function () {
		let nextCell = this.getNextCell();
		if (nextCell.isObstacle || nextCell.isWorm) {    // Forbidden cell
			window.gameOver();
		}
		else if (nextCell.isFood) {    // Food cell
			this.moveHeadTo(nextCell);
			window.foodBeep();
			window.scoreDisplay.innerHTML = this.length;
			clearInterval(window['runningLoop' + window.runLoopId]);
			delete window['runningLoop' + window.runLoopId];
			window.speedUp();
			window.run();

		}
		else {    // Normal cell
			this.moveHeadTo(nextCell);
			this.moveTail();
		};
	};
};

window.Worm.prototype.moveHeadTo = function (nextHeadCell) {
	this.sections.unshift(nextHeadCell);
	this.head.beWorm();
};

window.Worm.prototype.moveTail = function () {
	this.tail.beNormal();
	this.sections.splice(-1, 1);
};

window.Worm.prototype.getNextCell = function () {
	if (Boolean(window.directions.length)) window.currentDirection = window.directions.shift();
	return window.nextCellGettingFunctions[window.currentDirection]();
};
