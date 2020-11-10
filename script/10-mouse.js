Mouse = function (game) {
	document.oncontextmenu = (clickEvent) => clickEvent.preventDefault();
	this.game = game;
	this.attach();
	this.idHandlers = {};
}

Mouse.prototype.attach = function () {
	let me = this;

	document.onmousedown = function (clickEvent) {
		let target = clickEvent.target;
		if (me.game.config.devMode && target.tagName == 'TD') {  //Todo: Move to grid and register with Mouse object
			switch (clickEvent.which) {
				case 1: clickEvent.target.cell.beFood(); break;  // left click
				case 2: clickEvent.target.cell.beBlank(); break;  // middle click
				case 3: clickEvent.target.cell.beObstacle(); break;  // right click
				default: break;
			}
		}
		else {
			ifFunctionRun(me.idHandlers[target.id]);
		}
	}
}

Mouse.prototype.bindById = function (elementId, handler) {
	this.idHandlers[elementId] = handler;
}

Mouse.prototype.unbindAll = function () {
	this.idHandlers = {};
}
