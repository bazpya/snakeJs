class Cell {
    static #types = Object.freeze({ blank: "blank", wall: "wall", worm: "worm", food: "food" });

    constructor(rowNumber, colNumber) {
        this.element = document.createElement('td');
        this.element.className = 'cell';
        this.element.cell = this;
        this.row = rowNumber;
        this.col = colNumber;
        this.type = Cell.#types.blank;
    }

    get isWorm() { return this.type === Cell.#types.worm }
    get isFood() { return this.type === Cell.#types.food }
    get isBlank() { return this.type === Cell.#types.blank }
    get isWall() { return this.type === Cell.#types.wall }
    get isDeadly() { return this.isWall || this.isWorm }

    beWorm() {
        this.type = Cell.#types.worm;
        this.element.className = 'worm';
    }

    beFood() {
        this.type = Cell.#types.food;
        this.element.className = 'food';
    }

    beBlank() {
        this.type = Cell.#types.blank;
        this.element.className = 'cell';
    }

    beWall() {
        this.type = Cell.#types.wall;
        this.element.className = 'wall';
    }
}
