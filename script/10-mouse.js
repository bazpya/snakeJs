class Mouse {
	constructor(game) {
		document.oncontextmenu = (clickEvent) => clickEvent.preventDefault();
		this.game = game;
		this.attach();
		this.tagHandlers = {};
		this.idHandlers = {};
	}

	attach() {
		let me = this;

		document.onmousedown = function (clickEvent) {
			let target = clickEvent.target;
			ifFunctionRun(me.tagHandlers[target.tagName], clickEvent);
			ifFunctionRun(me.idHandlers[target.id], clickEvent);
		}
	}

	bindByTag(tag, handler) {
		this.tagHandlers[tag] = handler;
	}

	bindById(elementId, handler) {
		this.idHandlers[elementId] = handler;
	}

	unbindAll() {
		this.idHandlers = {};
	}

	bindHandlers() { //Todo: This came from grid. Merge it here
		if (this.game.config.devMode !== true) //Todo: No direct reference to game props
			return;
		let me = this;
		this.game.mouse.bindByTag('TD', (clickEvent) => {
			switch (clickEvent.which) {
				case 1: clickEvent.target.cell.beFood(); break;  // left click
				case 2: clickEvent.target.cell.beBlank(); break;  // middle click
				case 3: clickEvent.target.cell.beWall(); break;  // right click
				default: break;
			}
		});
	}
} 
