window.onload = function(){
	initialise();
	bindEventHandlers();
};

function start(){
	theButton.firstChild.textContent = "Restart";
	theButton.onmousedown = restart;
	run();
	feed();
};
function restart(){
	delete grid;
	while(gridContainer.lastChild){
		gridContainer.removeChild(gridContainer.lastChild);
	};
	delete worm;
	initialise();
};

// Due to the nature of JS timers you cannot form loops with them and simply pause/resume them!
function run(){
	if(!isPaused) worm.update();
	setTimeout(run, movingTimeStep);
};

function togglePause(){
	if(isPaused) unPause();
	else pause();
};
function pause(){
	isPaused = true;
};
function unPause (){
	if(!isOver) isPaused = false;
	// Add a pop-up to show in paused state
};

function gameOver(){
	pause();
	isOver = true;
	worm.sections.forEach(function(section){
		section.beObstacle();
	});
};

function feed() {
	if(!isPaused){
		if(typeof previousFoodCell !== 'undefined' && previousFoodCell.isFood) previousFoodCell.beNormal();
		do {
			foodX = 1 + Math.floor(Math.random() * (gridWidth - 2));
			foodY = 1 + Math.floor(Math.random() * (gridHeight - 2));
			nextFoodCell = grid.cells[foodX][foodY];
		} while (!nextFoodCell.isNormal);
		nextFoodCell.beFood();
		previousFoodCell = nextFoodCell;
	};
	setTimeout(feed, feedingTimeStep);
};

function speedUp(){
	if(movingTimeStep > minimumMovingTimeStep) movingTimeStep -= movingTimeStepDecrement;
};
Object.defineProperties(Array.prototype,{
	last: { get: function () {return this[this.length-1]}}
});


