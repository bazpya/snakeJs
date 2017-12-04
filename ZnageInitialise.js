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

