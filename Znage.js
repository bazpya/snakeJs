window.onload = function(){
	initialise();
	bindEventHandlers();
};

function initialise(){
	gridContainer = document.getElementById('grid-container');
	lengthDisplay = document.getElementById('score');
	theButton = document.getElementById('button');
	targets = document.getElementsByClassName('target');
	initialiseCrosshairs();
	initialiseSound();
	gridWidth = 20;  // cells
	gridHeight = 20;  // cells
	cellDimensionPixels = '20px';
	currentDirection = 'down';
	directions = [];
	keyCodeForUp = 'W'.charCodeAt(0);
	keyCodeForRight = 'D'.charCodeAt(0);
	keyCodeForDown = 'S'.charCodeAt(0);
	keyCodeForLeft = 'A'.charCodeAt(0);
	keyCodeForPause = ' '.charCodeAt(0);
	directionKeyCodeMapping = {};
	directionKeyCodeMapping[keyCodeForUp] = function(){directions.push('up')};
	directionKeyCodeMapping[keyCodeForRight] = function(){directions.push('right')};
	directionKeyCodeMapping[keyCodeForDown] = function(){directions.push('down')};
	directionKeyCodeMapping[keyCodeForLeft] = function(){directions.push('left')};
	directionKeyCodeMapping[keyCodeForPause] = function(){isPaused = !isPaused};
	movingTimeStep = 120;  // milliseconds
	foodDroppingTimeStep = 3000;  // milliseconds
	isPaused = false;
	isOver = false;
	grid = Grid();
	previousFoodCell = grid.cells[1][1];
	gridContainer.appendChild(grid);
};

function start(){
	dropFood();
	worm = new Worm();
	theButton.firstChild.textContent = "Restart";
	theButton.onmousedown = restart;
	run();
};

function restart(){
	delete grid;
	while(gridContainer.lastChild){
		gridContainer.removeChild(gridContainer.lastChild);
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
		directionKeyCodeMapping[keyDownEvent.keyCode]();
	};
};

function speedUp(){
	if(movingTimeStep > 40) movingTimeStep -= 5;
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
	setTimeout(dropFood, foodDroppingTimeStep); // replace with setInterval and clear it in callback
};

Object.defineProperties(Array.prototype,{
	last: { get: function () {return this[this.length-1]}}
});


