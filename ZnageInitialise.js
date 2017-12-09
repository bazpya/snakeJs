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
	window.isPaused = false;
	window.debugMode = false;
	window.currentDirection = 2;
	window.lastDirectionCommand = 2;
	window.directions = [2];
    window.keyMapping = {};
	window.defineInitialKeyCodeMapping()
	window.initialiseElements()
	window.initialiseCrosshairs();
	window.initialiseSound();
	window.nextCellGettingFunctions = [
		function(){return window.grid.cells[window.worm.head.row - 1][window.worm.head.column]},
		function(){return window.grid.cells[window.worm.head.row][window.worm.head.column + 1]},
		function(){return window.grid.cells[window.worm.head.row + 1][window.worm.head.column]},
		function(){return window.grid.cells[window.worm.head.row][window.worm.head.column - 1]}
	];

};

window.bindEventHandlers = function(){
	window.theButton.onmousedown = start;
	window.onkeydown = function(keyDownEvent){
        window.keyMapping[keyDownEvent.keyCode]();
	};
	document.oncontextmenu = function(clickEvent){  // TODO: is this 'clickEvent' in the scope of 'window' ?
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

window.defineInitialKeyCodeMapping = function(){
    window.keyMapping[keyCodeForUp] = function(){window.directions.push(0); window.lastDirectionCommand = 0;};
    window.keyMapping[keyCodeForRight] = function(){window.directions.push(1); window.lastDirectionCommand = 1;};
    window.keyMapping[keyCodeForDown] = function(){window.directions.push(2); window.lastDirectionCommand = 2;};
    window.keyMapping[keyCodeForLeft] = function(){window.directions.push(3); window.lastDirectionCommand = 3;};
    window.keyMapping[keyCodeForPause] = function(){window.togglePause()};
};

window.defineSelfBiteAvoidingKeyCodeMapping = function(){
    window.keyMapping[keyCodeForUp] = function(){if(!Boolean(window.lastDirectionCommand % 2)) return; window.directions.push(0); window.lastDirectionCommand = 0;};
    window.keyMapping[keyCodeForRight] = function(){if(Boolean(window.lastDirectionCommand % 2)) return; window.directions.push(1); window.lastDirectionCommand = 1;};
    window.keyMapping[keyCodeForDown] = function(){if(!Boolean(window.lastDirectionCommand % 2)) return; window.directions.push(2); window.lastDirectionCommand = 2;};
    window.keyMapping[keyCodeForLeft] = function(){if(Boolean(window.lastDirectionCommand % 2)) return; window.directions.push(3); window.lastDirectionCommand = 3;};
};

window.definePausedKeyCodeMapping = function(){
    window.keyMapping[keyCodeForUp] = function(){};
    window.keyMapping[keyCodeForRight] = function(){};
    window.keyMapping[keyCodeForDown] = function(){};
    window.keyMapping[keyCodeForLeft] = function(){};
};

window.disableKeys = function(){
	window.definePausedKeyCodeMapping();
    window.keyMapping[keyCodeForPause] = function(){};
};
