window.initialise = function(){
	window.gridHeight = 20;  // cells
	window.gridWidth = 20;  // cells
	window.movingTimeStep = 120;  // milliseconds
	window.movingTimeStepDecrement = 5;  // milliseconds
	window.minimumMovingTimeStep = 80;  // milliseconds
	window.feedingTimeStep = 3000;  // milliseconds
	window.keyCodeForUp = 'W'.charCodeAt(0);
	window.keyCodeForRight = 'D'.charCodeAt(0);
	window.keyCodeForDown = 'S'.charCodeAt(0);
	window.keyCodeForLeft = 'A'.charCodeAt(0);
	window.keyCodeForPause = ' '.charCodeAt(0);
	window.currentDirection = 2;
	window.lastDirection = 2;
	window.isPaused = false;
	window.isOver = false;
	window.debugMode = false;
	window.directions = [2];
	window.initialiseElements()
	window.initialiseCrosshairs();
	window.initialiseSound();
	window.nextCellGettingFunctions = [
		function(){return window.grid.cells[window.worm.head.row - 1][window.worm.head.column]},
		function(){return window.grid.cells[window.worm.head.row][window.worm.head.column + 1]},
		function(){return window.grid.cells[window.worm.head.row][window.worm.head.column - 1]}
	];

};

window.bindEventHandlers = function(){
	window.theButton.onmousedown = start;
	window.onkeydown = function(keyDownEvent){
		switch(keyDownEvent.keyCode){
			case window.keyCodeForUp: if(window.lastDirection % 2 != 0) {window.directions.push(0); window.lastDirection = 0;};  break;
			case window.keyCodeForRight: if(window.lastDirection % 2 != 1) {window.directions.push(1); window.lastDirection = 1;};  break;
			case window.keyCodeForDown: if(window.lastDirection % 2 != 0) {window.directions.push(2); window.lastDirection = 2;};  break;
			case window.keyCodeForLeft: if(window.lastDirection % 2 != 1) {window.directions.push(3); window.lastDirection = 3;};  break;
			case window.keyCodeForPause: window.togglePause(); break;
			default: break;
		};
	};
	document.oncontextmenu = function(clickEvent){
		clickEvent.preventDefault();
	};
	document.onmousedown = function(clickEvent) {
		if (window.debugMode && clickEvent.target.tagName == 'TD') {
			switch(clickEvent.which){
				case 1: clickEvent.target.beFood(); break;  // left click
				case 2: clickEvent.target.beNormal(); break;  // middle click
				case 3: clickEvent.target.beObstacle(); break;  // right click
				default: break;
			};
		};
	};
};
