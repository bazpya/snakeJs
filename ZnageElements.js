//###########################  Grid  ##############################################
//#################################################################################

var Grid = function() {
	newGrid = document.createElement('table');
	newGrid.id = 'grid';
	newGrid.cells = [];
	for(var y = 0; y < gridHeight; y++){
		var newRow = document.createElement('tr');
		newGrid.cells.push([]);
		for (var x = 0; x < gridWidth; x++){
			var newCell = Cell(y, x);
			// if(x == 1 || x == gridWidth - 2 || y == 1 || y == gridHeight - 2) newCell.beFood();
			// if(x == 2 || x == gridWidth - 3 || y == 2 || y == gridHeight - 3) newCell.beFood();
			// if(x == 3 || x == gridWidth - 4 || y == 3 || y == gridHeight - 4) newCell.beFood();
			// if(x == 4 || x == gridWidth - 5 || y == 4 || y == gridHeight - 5) newCell.beFood();
			// if(x == 5 || x == gridWidth - 6 || y == 5 || y == gridHeight - 6) newCell.beFood();
			// if(x == 6 || x == gridWidth - 7 || y == 6 || y == gridHeight - 7) newCell.beFood();
			if(x == 0 || x == gridWidth - 1 || y == 0 || y == gridHeight - 1) newCell.beObstacle();
			newRow.appendChild(newCell);
			newGrid.cells[y].push(newCell);
		};
		newGrid.appendChild(newRow);
	};
	return newGrid;
};

//############################  Cell  #############################################
//#################################################################################

Object.defineProperties(HTMLTableCellElement.prototype,{
	row : { value: 0, writable: true},
	column : { value: 0, writable: true},
	isObstacle : { value: 0, writable: true},
	isWorm : { value: 0, writable: true},
	isFood : { value: 0, writable: true},
	isNormal: { get: function () {return !(this.isWorm || this.isFood || this.isObstacle)}}
});

HTMLTableCellElement.prototype.beNormal = function() {
	this.isObstacle = 0; this.isWorm = 0; this.isFood = 0;
	this.className = 'cell';
};

HTMLTableCellElement.prototype.beObstacle = function() {
	this.isObstacle = 1; this.isWorm = 0; this.isFood = 0;
	this.className = 'obstacle';
};

HTMLTableCellElement.prototype.beWorm = function() {
	this.isObstacle = 0; this.isWorm = 1; this.isFood = 0;
	this.className = 'worm';
};

HTMLTableCellElement.prototype.beFood = function() {
	this.isObstacle = 0; this.isWorm = 0; this.isFood = 1;
	this.className = 'food';
};

var Cell = function(rowNumber, columnNumber) {
	var newElement = document.createElement('td');
	newElement.className = 'cell';
	newElement.row = rowNumber;
	newElement.column = columnNumber;
	newElement.style.width = cellDimensionPixels;
	newElement.style.height = cellDimensionPixels;
	// newElement.onmousedown = function(clickEvent) {
		// clickEvent.preventDefault();
		// var mouseButton = clickEvent.which;
		// switch(mouseButton){
			// case 1: this.beFood(); break;  // left click
			// case 2: this.beNormal(); break;  // middle click
			// case 3: this.beObstacle(); break;  // right click
			// default: break;
		// };
	// };
	newElement.oncontextmenu = function (contextEvent) {
        contextEvent.preventDefault();
    };
	return newElement;
};

//############################  Worm  #############################################
//#################################################################################

var Worm = function() {
	this.sections = [];
	this.sections.push(grid.cells[1][1]);
	this.head.beWorm();
};

Object.defineProperties(Worm.prototype,{
	head: { get: function () {return this.sections[0]}},
	length: { get: function () {return this.sections.length}},
	tail: { get: function () {return this.sections.last}}
});

Worm.prototype.update = function(){
	var nextCell = this.getNextCell();
	if(nextCell.isObstacle || nextCell.isWorm){    // Forbidden cell
		gameOver();
	}
	else if(nextCell.isFood){    // Food cell
		this.moveHeadTo(nextCell);
		foodBeep();
		speedUp();
	}
	else {    // Normal cell
		this.moveHeadTo(nextCell);
		this.moveTail();
	};
};

Worm.prototype.moveHeadTo = function(nextHeadCell){
	this.sections.unshift(nextHeadCell);
	this.head.beWorm();
};

Worm.prototype.moveTail = function(){
	this.tail.beNormal();
	this.sections.splice(-1,1);
};

Worm.prototype.getNextCell = function(){
	var nextMove = currentDirection;
	if (directions.length > 0) {
		nextMove = directions.shift();
		currentDirection = nextMove;
	};
	switch(nextMove){
		case 'up': return grid.cells[this.head.row - 1][this.head.column]; break;
		case 'right': return grid.cells[this.head.row][this.head.column + 1]; break;
		case 'down': return grid.cells[this.head.row + 1][this.head.column]; break;
		case 'left': return grid.cells[this.head.row][this.head.column - 1]; break;
		default: break;
	};
};
