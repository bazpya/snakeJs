window.onload = function(){
	window.initialise();
	window.bindEventHandlers();
};

window.start = function(){
	window.theButton.firstChild.textContent = "Restart";
	window.theButton.onmousedown = restart;
	window.run();
	window.feed();
};
window.restart = function(){
	window.unPause()
	window.gridContainer.removeChild(grid);
	delete window.grid;
	// while(window.gridContainer.lastChild){
		// window.gridContainer.removeChild(window.gridContainer.lastChild);
	// };
	delete window.worm;
	window.initialise();
};

// Due to the nature of JS timers you cannot form loops with them and simply pause/resume them!
window.run = function(){
	if(!window.isPaused) window.worm.update();
	setTimeout(window.run, window.movingTimeStep);
};

window.togglePause = function(){
	if(window.isPaused) window.unPause();
	else window.pause();
};
window.pause = function(){
	window.isPaused = true;
	window.popUp.classList.replace('popup-down' , (window.debugMode) ? 'popup-up-debug' : 'popup-up');
};
window.unPause = function(){
	if(!window.isOver) window.isPaused = false;
	window.popUp.classList.replace((window.debugMode) ? 'popup-up-debug' : 'popup-up' , 'popup-down');
};

window.gameOver = function(){
	window.isPaused = true;
	window.isOver = true;
	window.worm.sections.forEach(function(section){
		section.beObstacle();
	});
};

window.feed = function() {
	if(!window.isPaused){
		if(typeof window.previousFoodCell !== 'undefined' && window.previousFoodCell.isFood) window.previousFoodCell.beNormal();
		do {
			foodX = 1 + Math.floor(Math.random() * (gridWidth - 2));
			foodY = 1 + Math.floor(Math.random() * (gridHeight - 2));
			var nextFoodCell = grid.cells[foodX][foodY];
		} while (!nextFoodCell.isNormal);
		nextFoodCell.beFood();
		window.previousFoodCell = nextFoodCell;
	};
	setTimeout(window.feed, window.feedingTimeStep);
};

window.speedUp = function(){
	if(window.movingTimeStep > window.minimumMovingTimeStep) window.movingTimeStep -= window.movingTimeStepDecrement;
};

Object.defineProperties(Array.prototype,{
	last: { get: function () {return this[this.length-1]}}
});
