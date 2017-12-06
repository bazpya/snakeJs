window.initialise = function(){
	window.gridHeight = 20;  // cells
	window.gridWidth = 20;  // cells
	window.movingTimeStep = 120;  // milliseconds
	window.movingTimeStepDecrement = 5;  // milliseconds
	window.minimumMovingTimeStep = 40;  // milliseconds
	window.feedingTimeStep = 3000;  // milliseconds
	window.keyCodeForUp = 'W'.charCodeAt(0);
	window.keyCodeForRight = 'D'.charCodeAt(0);
	window.keyCodeForDown = 'S'.charCodeAt(0);
	window.keyCodeForLeft = 'A'.charCodeAt(0);
	window.keyCodeForPause = ' '.charCodeAt(0);
	window.currentDirection = 'down';
	window.isPaused = false;
	window.isOver = false;
	window.cellClickingEnabled = false;
	window.directions = [];
	window.directionKeyCodeMapping = {};
	window.directionKeyCodeMapping[keyCodeForUp] = function(){directions.push('up')};
	window.directionKeyCodeMapping[keyCodeForRight] = function(){directions.push('right')};
	window.directionKeyCodeMapping[keyCodeForDown] = function(){directions.push('down')};
	window.directionKeyCodeMapping[keyCodeForLeft] = function(){directions.push('left')};
	window.directionKeyCodeMapping[keyCodeForPause] = function(){togglePause()};
	window.initialiseElements()
	window.initialiseCrosshairs();
	window.initialiseSound();
};

window.bindEventHandlers = function(){
	window.theButton.onmousedown = start;
	window.onkeydown = function(keyDownEvent){
		window.directionKeyCodeMapping[keyDownEvent.keyCode]();
	};
	document.oncontextmenu = function(clickEvent){
		clickEvent.preventDefault();
	};
	document.onmousedown = function(clickEvent) {
		if (window.cellClickingEnabled && clickEvent.target.tagName == 'TD') {
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
