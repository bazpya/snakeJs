class Mouse {
	constructor() {
		document.oncontextmenu = (clickEvent) => clickEvent.preventDefault();
		this.attach();
		this.idHandlers = {};
		this.tagHandlers = {};
	}

	attach() {
		let me = this;

		document.onmousedown = function (clickEvent) {
			let target = clickEvent.target;
			Var.ifFunctionRun(me.idHandlers[target.id], clickEvent);
			Var.ifFunctionRun(me.tagHandlers[target.tagName], clickEvent);
		}
	}

	bindByTag(tag, tagHandler) {
		this.tagHandlers[tag] = tagHandler;
	}

	bindById(elementId, handler) {
		this.idHandlers[elementId] = handler;
	}

	unbindAll() {
		this.idHandlers = {};
	}
} 
