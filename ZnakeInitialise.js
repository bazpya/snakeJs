initialise = function () {
	gridHeight = 20;  // cells
	gridWidth = 20;  // cells
	movingTimeStep = 120;  // milliseconds
	movingTimeStepDecrement = 5;  // milliseconds
	minimumMovingTimeStep = 80;  // milliseconds
	feedingTimeStep = 3000;  // milliseconds
	keyCodeForUp = 'W'.charCodeAt(0);
	keyCodeForRight = 'D'.charCodeAt(0);
	keyCodeForDown = 'S'.charCodeAt(0);
	keyCodeForLeft = 'A'.charCodeAt(0);
	keyCodeForPause = ' '.charCodeAt(0);
	isPaused = false;
	debugMode = false;
	currentDirection = 2;
	lastDirectionCommand = 2;
	directions = [2];
	keyMapping = {};
	defineInitialKeyCodeMapping()
	initialiseElements()
	initialiseCrosshairs();
	nextCellGettingFunctions = [
		function () { return grid.cells[worm.head.row - 1][worm.head.column] },
		function () { return grid.cells[worm.head.row][worm.head.column + 1] },
		function () { return grid.cells[worm.head.row + 1][worm.head.column] },
		function () { return grid.cells[worm.head.row][worm.head.column - 1] }
	];
};

bindEventHandlers = function () {
	splash.onclick = function () {
		initialiseSound();
		splash.classList.replace('popup', 'popdown');
	};
	theButton.onmousedown = start;
	onkeydown = function (keyDownEvent) {
		if (typeof keyMapping[keyDownEvent.keyCode] === 'function')
			keyMapping[keyDownEvent.keyCode]();
	};
	document.oncontextmenu = function (clickEvent) {  // TODO: is this 'clickEvent' in the scope of 'window' ?
		clickEvent.preventDefault();
	};
	document.onmousedown = function (clickEvent) {
		if (debugMode && clickEvent.target.tagName == 'TD') {
			switch (clickEvent.which) {
				case 1: clickEvent.target.beFood(); break;  // left click
				case 2: clickEvent.target.beNormal(); break;  // middle click
				case 3: clickEvent.target.beObstacle(); break;  // right click
				default: break;
			};
		};
	};
};

defineInitialKeyCodeMapping = function () {
	keyMapping[keyCodeForUp] = function () { directions.push(0); lastDirectionCommand = 0; };
	keyMapping[keyCodeForRight] = function () { directions.push(1); lastDirectionCommand = 1; };
	keyMapping[keyCodeForDown] = function () { directions.push(2); lastDirectionCommand = 2; };
	keyMapping[keyCodeForLeft] = function () { directions.push(3); lastDirectionCommand = 3; };
	keyMapping[keyCodeForPause] = function () { togglePause() };
};

defineSelfBiteAvoidingKeyCodeMapping = function () {
	keyMapping[keyCodeForUp] = function () { if (!Boolean(lastDirectionCommand % 2)) return; directions.push(0); lastDirectionCommand = 0; };
	keyMapping[keyCodeForRight] = function () { if (Boolean(lastDirectionCommand % 2)) return; directions.push(1); lastDirectionCommand = 1; };
	keyMapping[keyCodeForDown] = function () { if (!Boolean(lastDirectionCommand % 2)) return; directions.push(2); lastDirectionCommand = 2; };
	keyMapping[keyCodeForLeft] = function () { if (Boolean(lastDirectionCommand % 2)) return; directions.push(3); lastDirectionCommand = 3; };
};

definePausedKeyCodeMapping = function () {
	keyMapping[keyCodeForUp] = function () { };
	keyMapping[keyCodeForRight] = function () { };
	keyMapping[keyCodeForDown] = function () { };
	keyMapping[keyCodeForLeft] = function () { };
};

disableKeys = function () {
	definePausedKeyCodeMapping();
	keyMapping[keyCodeForPause] = function () { };
};
