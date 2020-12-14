class MultiFuncButton {
    #element;
    #funcs = {};

    constructor(element, funcDescriptions) {
        this.#element = element;
        for (let desc of funcDescriptions) {
            this.#funcs[desc.label] = desc.func;
        }
        this.bind(funcDescriptions[0].label);
    }

    bind(label) {
        let me = this;
        this.#element.onmousedown = () => me.#funcs[label]();
        this.#element.innerText = label;
    }
} 
