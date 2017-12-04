window.onload = function(){
	initialise();
	bindEventHandlers();
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

function speedUp(){
	if(movingTimeStep > minimumMovingTimeStep) movingTimeStep -= movingTimeStepDecrement;
};

function dropFood() {
	if(!isPaused && !isOver){
		if(typeof previousFoodCell !== 'undefined' && previousFoodCell.isFood) previousFoodCell.beNormal();
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


