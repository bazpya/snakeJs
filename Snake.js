window.onload = function(){
	initialise();
	bindEventHandlers();
};

function initialise(){
	gridContainer = document.getElementById('grid-container');
	lengthDisplay = document.getElementById('length-display');
	theButton = document.getElementById('button');
	gridWidth = 20;
	gridHeight = 20;
	currentDirection = 'down';
	wormColour = 'yellowgreen';
	foodColour = 'yellow';
	obstacleColour = 'orangered';
	keyCodeForUp = 'W'.charCodeAt(0);
	keyCodeForRight = 'D'.charCodeAt(0);
	keyCodeForDown = 'S'.charCodeAt(0);
	keyCodeForLeft = 'A'.charCodeAt(0);
	keyCodeForPause = ' '.charCodeAt(0);
	directions = [];
	movingTimeStep = 150; // milliseconds
	foodDroppingTimeStep = 3000; // milliseconds
	isPaused = false;
	isOver = false;
	cellWidthPixels = gridContainer.offsetWidth / gridWidth + 'px';
	cellHeightPixels = gridContainer.offsetHeight / gridHeight + 'px';
	grid = Grid();
	previousFoodCell = grid.cells[1][1];
	gridContainer.appendChild(grid);
};

function start(){
	dropFood();
	worm = new Worm();
	theButton.innerText = "Restart";
	theButton.onmousedown = restart;
	run();
};

function restart(){
	delete grid;
	while(gridContainer.firstChild){
		gridContainer.removeChild(gridContainer.firstChild);
	};
	delete worm;
	initialise();
	// grid.dropFood();
	worm = new Worm();
	// run();
};

function run(){
	if(!isPaused && !isOver){
		worm.update();
		lengthDisplay.innerHTML = worm.length;
	}
	setTimeout(run, movingTimeStep);
};

function gameOver(){
	isOver = true;
	worm.sections.forEach(function(section){
		section.beObstacle();
	});
};

function bindEventHandlers(){
	theButton.onmousedown = start;
	window.onkeydown = function(keyDownEvent){
		switch(keyDownEvent.keyCode){
			case keyCodeForUp:
				if(worm.length > 1 && currentDirection == 'down') break; // Disable reverse
				directions.push('up');
				break;
			case keyCodeForRight:
				if(worm.length > 1 && currentDirection == 'left') break; // Disable reverse
				directions.push('right');
				break;
			case keyCodeForDown:
				if(worm.length > 1 && currentDirection == 'up') break; // Disable reverse
				directions.push('down');
				break;
			case keyCodeForLeft:
				if(worm.length > 1 && currentDirection == 'right') break; // Disable reverse
				directions.push('left');
				break;
			case keyCodeForPause: isPaused = !isPaused; break;
			default: break;
		};
	};
};

function speedUp(){
	if(movingTimeStep > 85) movingTimeStep -= 5;
};

function dropFood() {
	if(!isPaused && !isOver){
		if(previousFoodCell.isFood) previousFoodCell.beNormal();
		do {
			foodX = 1 + Math.floor(Math.random() * (gridWidth - 2));
			foodY = 1 + Math.floor(Math.random() * (gridHeight - 2));
			nextFoodCell = grid.cells[foodX][foodY];
		} while (!nextFoodCell.isNormal);
		nextFoodCell.beFood();
		previousFoodCell = nextFoodCell;
	};
	setTimeout(dropFood, foodDroppingTimeStep);
};

Object.defineProperties(Array.prototype,{
	last: { get: function () {return this[this.length-1]}}
});

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
			if(x == 1 || x == gridWidth - 2 || y == 1 || y == gridHeight - 2) newCell.beFood();
			if(x == 2 || x == gridWidth - 3 || y == 2 || y == gridHeight - 3) newCell.beFood();
			if(x == 3 || x == gridWidth - 4 || y == 3 || y == gridHeight - 4) newCell.beFood();
			if(x == 4 || x == gridWidth - 5 || y == 4 || y == gridHeight - 5) newCell.beFood();
			if(x == 5 || x == gridWidth - 6 || y == 5 || y == gridHeight - 6) newCell.beFood();
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

HTMLTableCellElement.prototype.beObstacle = function() {
	this.isObstacle = 1; this.isWorm = 0; this.isFood = 0;
	this.style.backgroundColor = obstacleColour;
};

HTMLTableCellElement.prototype.beWorm = function() {
	this.isObstacle = 0; this.isWorm = 1; this.isFood = 0;
	this.style.backgroundColor = wormColour;
};

HTMLTableCellElement.prototype.beFood = function() {
	this.isObstacle = 0; this.isWorm = 0; this.isFood = 1;
	this.style.backgroundColor = foodColour;
};

HTMLTableCellElement.prototype.beNormal = function() {
	this.isObstacle = 0; this.isWorm = 0; this.isFood = 0;
	this.style.backgroundColor = '';
};

var Cell = function(rowNumber, columnNumber) {
	var newElement = document.createElement('td');
	newElement.className = 'cell';
	newElement.row = rowNumber;
	newElement.column = columnNumber;
	newElement.style.width = cellWidthPixels;
	newElement.style.height = cellHeightPixels;
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
