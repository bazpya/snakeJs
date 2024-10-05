"use strict";

class MultiFuncButton {
    #element;
    #funcs = {};

    constructor(element, funcDescriptions) {
        this.#element = element;
        this.#funcs = funcDescriptions;
        const initialKey = Object.keys(this.#funcs)[0];
        this.bind(initialKey);
    }

    bind(label) {
        let me = this;
        const func = me.#funcs[label];
        if (!func)
            throw new Error(`No function found with key ${label}`);
        this.#element.onmousedown = () => func();
        this.#element.innerText = label;
    }
} 
