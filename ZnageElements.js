window.initialiseElements = function(){
	window.gridContainer = document.getElementById('grid-container');
	window.lengthDisplay = document.getElementById('score');
	window.theButton = document.getElementById('button');
	window.popUp = document.getElementById('popup');
	window.grid = Grid(gridHeight, gridWidth);
	window.gridContainer.appendChild(grid);
	window.worm = new Worm();
	window.lengthDisplay.innerHTML = worm.length;
}

//###########################  Grid  ##############################################
//#################################################################################

window.Grid = function(height, width) {
	var newGrid = document.createElement('table');
	newGrid.id = 'grid';
	newGrid.cells = [];
	for(var y = 0; y < height; y++){
		var newRow = document.createElement('tr');
		newGrid.cells.push([]);
		for (var x = 0; x < width; x++){
			var newCell = Cell(y, x);
			// if(x == 1 || x == width - 2 || y == 1 || y == height - 2) newCell.beFood();
			// if(x == 2 || x == width - 3 || y == 2 || y == height - 3) newCell.beFood();
			// if(x == 3 || x == width - 4 || y == 3 || y == height - 4) newCell.beFood();
			// if(x == 4 || x == width - 5 || y == 4 || y == height - 5) newCell.beFood();
			// if(x == 5 || x == width - 6 || y == 5 || y == height - 6) newCell.beFood();
			// if(x == 6 || x == width - 7 || y == 6 || y == height - 7) newCell.beFood();
			if(x == 0 || x == width - 1 || y == 0 || y == height - 1) newCell.beObstacle();
			newRow.appendChild(newCell);
			newGrid.cells[y].push(newCell);
		};
		newGrid.appendChild(newRow);
	};
	return newGrid;
};

//############################  Cell  #############################################
//#################################################################################

Object.defineProperties(window.HTMLTableCellElement.prototype,{
	row : { value: 0, writable: true},
	column : { value: 0, writable: true},
	isObstacle : { value: 0, writable: true},
	isWorm : { value: 0, writable: true},
	isFood : { value: 0, writable: true},
	isNormal: { get: function () {return !(this.isWorm || this.isFood || this.isObstacle)}}
});

window.HTMLTableCellElement.prototype.beNormal = function() {
	this.isObstacle = 0; this.isWorm = 0; this.isFood = 0;
	this.className = 'cell';
};

window.HTMLTableCellElement.prototype.beObstacle = function() {
	this.isObstacle = 1; this.isWorm = 0; this.isFood = 0;
	this.className = 'obstacle';
};

window.HTMLTableCellElement.prototype.beWorm = function() {
	this.isObstacle = 0; this.isWorm = 1; this.isFood = 0;
	this.className = 'worm';
};

window.HTMLTableCellElement.prototype.beFood = function() {
	this.isObstacle = 0; this.isWorm = 0; this.isFood = 1;
	this.className = 'food';
};

window.Cell = function(rowNumber, columnNumber) {
	var newElement = document.createElement('td');
	newElement.className = 'cell';
	newElement.row = rowNumber;
	newElement.column = columnNumber;
	return newElement;
};

//############################  Worm  #############################################
//#################################################################################

window.Worm = function() {
	this.sections = [];
	this.sections.push(grid.cells[1][1]);
	this.head.beWorm();
};

Object.defineProperties(window.Worm.prototype,{
	head: { get: function () {return this.sections[0]}},
	length: { get: function () {return this.sections.length}},
	tail: { get: function () {return this.sections.last}}
});

window.Worm.prototype.update = function(){
	var nextCell = this.getNextCell();
	if(nextCell.isObstacle || nextCell.isWorm){    // Forbidden cell
		window.gameOver();
	}
	else if(nextCell.isFood){    // Food cell
		this.moveHeadTo(nextCell);
		window.foodBeep();
		window.lengthDisplay.innerHTML = worm.length;
		window.speedUp();
	}
	else {    // Normal cell
		this.moveHeadTo(nextCell);
		this.moveTail();
	};
};

window.Worm.prototype.moveHeadTo = function(nextHeadCell){
	this.sections.unshift(nextHeadCell);
	this.head.beWorm();
};

window.Worm.prototype.moveTail = function(){
	this.tail.beNormal();
	this.sections.splice(-1,1);
};

window.Worm.prototype.getNextCell = function(){
	if (Boolean(window.directions.length)) window.currentDirection = window.directions.shift();
	switch(window.currentDirection){
		case 0: return window.grid.cells[this.head.row - 1][this.head.column]; break;
		case 1: return window.grid.cells[this.head.row][this.head.column + 1]; break;
		case 2: return window.grid.cells[this.head.row + 1][this.head.column]; break;
		case 3: return window.grid.cells[this.head.row][this.head.column - 1]; break;
		default: break;
	};
};
