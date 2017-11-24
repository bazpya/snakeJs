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
	movingDirection = 'down';
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
			case 87: movingDirection = 'up'; break;
			case 68: movingDirection = 'right'; break;
			case 83: movingDirection = 'down'; break;
			case 65: movingDirection = 'left'; break;
			case 80: isPaused = !isPaused; break;
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
	}
	setTimeout(dropFood, foodDroppingTimeStep);
};

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
			if(x == 0 || x == gridWidth - 1 || y == 0 || y == gridHeight - 1)
				newCell.beObstacle();
			newRow.appendChild(newCell);
			newGrid.cells[y].push(newCell);
		};
		newGrid.appendChild(newRow);
	};
	return newGrid;
};

//############################  Cell  #############################################
//#################################################################################
HTMLTableCellElement.prototype.isObstacle = 0;
HTMLTableCellElement.prototype.isWorm = 0;
HTMLTableCellElement.prototype.isFood = 0;
HTMLTableCellElement.prototype.row = 0;
HTMLTableCellElement.prototype.column = 0;

Object.defineProperties(HTMLTableCellElement.prototype,{
	isNormal: { get: function () {return !(this.isWorm || this.isFood || this.isObstacle)}}
});

HTMLTableCellElement.prototype.beObstacle = function() {
	this.style.backgroundColor = 'red';
	this.isObstacle = 1;
	this.isWorm = 0;
	this.isFood = 0;
};

HTMLTableCellElement.prototype.beWorm = function() {
	this.style.backgroundColor = 'yellowgreen';
	this.isObstacle = 0;
	this.isWorm = 1;
	this.isFood = 0;
};

HTMLTableCellElement.prototype.beFood = function() {
	this.style.backgroundColor = 'yellow';
	this.isObstacle = 0;
	this.isWorm = 0;
	this.isFood = 1;
};

HTMLTableCellElement.prototype.beNormal = function() {
	this.style.backgroundColor = '';
	this.isObstacle = 0;
	this.isWorm = 0;
	this.isFood = 0;
};

var Cell = function(rowNumber, columnNumber) {
	var newElement = document.createElement('td');
	newElement.className = 'cell';
	newElement.row = rowNumber;
	newElement.column = columnNumber;
	newElement.style.width = cellWidthPixels;
	newElement.style.height = cellHeightPixels;
	newElement.onmousedown = function(clickEvent) {
		clickEvent.preventDefault();
		var mouseButton = clickEvent.which;
		switch(mouseButton){
			case 1: this.beFood(); break;  // left click
			case 2: this.beNormal(); break;  // middle click
			case 3: this.beObstacle(); break;  // right click
			default: break;
		};
	};
	newElement.oncontextmenu = function (contextEvent) {
        contextEvent.preventDefault();
    };
	return newElement;
};

//############################  Worm  #############################################
//#################################################################################

var Worm = function() {
	this.sections = [];
	this.head = grid.cells[1][1];
	this.tail = this.head;
	this.length = 1;
	this.sections.push(this.head);
	this.head.beWorm();
};

Worm.prototype.update = function(){
	var nextCell = this.getNextCell();
	if(nextCell.isObstacle || nextCell.isWorm){
		gameOver();
	}
	else if(nextCell.isFood){
		this.length++;
		speedUp();
		this.sections.unshift(nextCell);
		this.head = nextCell;
		nextCell.beWorm();
	}
	else {
		this.sections.unshift(nextCell);
		this.head = nextCell;
		nextCell.beWorm();
		var previousTail = this.tail;
		this.sections.splice(-1,1);
		previousTail.beNormal();
		this.tail = this.sections[this.length - 1];
	}
};

Worm.prototype.getNextCell = function(){
	switch(movingDirection){
		case 'up': return grid.cells[this.head.row - 1][this.head.column]; break;
		case 'right': return grid.cells[this.head.row][this.head.column + 1]; break;
		case 'down': return grid.cells[this.head.row + 1][this.head.column]; break;
		case 'left': return grid.cells[this.head.row][this.head.column - 1]; break;
		default: break;
	};
};
