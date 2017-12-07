window.onload = function(){
	window.runLoopId = 0;
	window.feedLoopId = 0;
	window.initialise();
	window.bindEventHandlers();
};

window.start = function(){
	window.theButton.firstChild.textContent = "Restart";
	window.theButton.onmousedown = restart;
	window.run();
	window.feed();
};
// TODO: can we use functions defined below in this function?
window.restart = function(){
	// window.popUp.classList.replace((window.debugMode) ? 'popup-up-debug' : 'popup-up' , 'popup-down');
	// window.stopFeeding();
	// window.gridContainer.removeChild(grid);
	// delete window.grid;
	// delete window.worm;
	// window.initialise();
	// window.runLoopId++;
	// window.run();
	// window.feed();
};

window.run = function(){
	console.log(window['runningLoop' + window.runLoopId] + ' ID: ' + window.runLoopId);
	window.worm.update();
	window['runningLoop' + window.runLoopId] = setTimeout(window.run, window.movingTimeStep);
};

window.togglePause = function(){
	(window.isPaused) ? window.unPause() : window.pause();
};
window.pause = function(){
	window.isPaused = true;
	clearTimeout(window['runningLoop' + window.runLoopId]);
	delete window['runningLoop' + window.runLoopId];
	window.stopFeeding();
	window.popUp.classList.replace('popup-down' , (window.debugMode) ? 'popup-up-debug' : 'popup-up');
};
window.unPause = function(){
	window.isPaused = false;
	window.runLoopId++;
	window.run();
	window.feed();
	window.popUp.classList.replace((window.debugMode) ? 'popup-up-debug' : 'popup-up' , 'popup-down');
};

window.gameOver = function(){
	// window.pause();
	clearTimeout(window['runningLoop' + window.runLoopId]);
	window['runningLoop' + window.runLoopId] = 0;
	delete window['runningLoop' + window.runLoopId];
	window.stopFeeding();
	// window.worm.sections.forEach(function(section){
		// section.beObstacle();
	// });
};

window.feed = function(){
	window['foodDroppingInterval' + window.feedLoopId] = setInterval(window.dropFood, window.feedingTimeStep);
};
window.stopFeeding = function(){
	clearInterval(window['foodDroppingInterval' + window.feedLoopId]);
	delete window['foodDroppingInterval' + window.feedLoopId++];
};
window.dropFood = function() {
	if(typeof window.previousFoodCell !== 'undefined' && window.previousFoodCell.isFood) window.previousFoodCell.beNormal();
	var nextFoodCell;
	do {
		foodX = 1 + Math.floor(Math.random() * (gridWidth - 2));
		foodY = 1 + Math.floor(Math.random() * (gridHeight - 2));
		nextFoodCell = grid.cells[foodX][foodY];
	} while (!nextFoodCell.isNormal);
	nextFoodCell.beFood();
	window.previousFoodCell = nextFoodCell;
};

window.speedUp = function(){
	if(window.movingTimeStep > window.minimumMovingTimeStep) window.movingTimeStep -= window.movingTimeStepDecrement;
};

Object.defineProperties(Array.prototype,{
	last: { get: function () {return this[this.length-1]}}
});
