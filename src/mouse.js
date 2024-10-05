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
			let handler = me.idHandlers[target.id];
			if (typeof handler === 'function')
				handler(clickEvent);
			handler = me.tagHandlers[target.tagName];
			if (typeof handler === 'function')
				handler(clickEvent);
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
