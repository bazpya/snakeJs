class Button {
    #element;
    #startFunc;
    #restartFunc;

    constructor(element, startFunc, restartFunc) {
        this.#element = element;
        this.#startFunc = startFunc;
        this.#restartFunc = restartFunc;
        this.beStart();
    }

    beStart() {
        let me = this;
        this.#element.onmousedown = () => me.#startFunc();
    }

    beRestart() {
        this.#element.firstChild.textContent = "Restart";
        let me = this;
        this.#element.onmousedown = () => me.#restartFunc();
    }
} 
