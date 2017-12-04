function initialise(){
	gridHeight = 20;  // cells
	gridWidth = 20;  // cells
	movingTimeStep = 120;  // milliseconds
	movingTimeStepDecrement = 5;  // milliseconds
	minimumMovingTimeStep = 40;  // milliseconds
	foodDroppingTimeStep = 3000;  // milliseconds
	keyCodeForUp = 'W'.charCodeAt(0);
	keyCodeForRight = 'D'.charCodeAt(0);
	keyCodeForDown = 'S'.charCodeAt(0);
	keyCodeForLeft = 'A'.charCodeAt(0);
	keyCodeForPause = ' '.charCodeAt(0);
	currentDirection = 'down';
	isPaused = false;
	isOver = false;
	cellClickingEnabled = false;
	directions = [];
	directionKeyCodeMapping = {};
	directionKeyCodeMapping[keyCodeForUp] = function(){directions.push('up')};
	directionKeyCodeMapping[keyCodeForRight] = function(){directions.push('right')};
	directionKeyCodeMapping[keyCodeForDown] = function(){directions.push('down')};
	directionKeyCodeMapping[keyCodeForLeft] = function(){directions.push('left')};
	directionKeyCodeMapping[keyCodeForPause] = function(){isPaused = !isPaused};
	initialiseElements()
	initialiseCrosshairs();
	initialiseSound();
};

function bindEventHandlers(){
	theButton.onmousedown = start;
	window.onkeydown = function(keyDownEvent){
		directionKeyCodeMapping[keyDownEvent.keyCode]();
	};
	document.oncontextmenu = function(clickEvent){
		clickEvent.preventDefault();
	};
	document.onmousedown = function(clickEvent) {
		if (cellClickingEnabled && clickEvent.target.tagName == 'TD') {
			var mouseButton = clickEvent.which;
			var clickedCell = clickEvent.target;
			switch(mouseButton){
				case 1: clickedCell.beFood(); break;  // left click
				case 2: clickedCell.beNormal(); break;  // middle click
				case 3: clickedCell.beObstacle(); break;  // right click
				default: break;
			};
		};
	};
};
