const CellType = require('./global_refs');

class Cell {
    row
    col
    type

    constructor(row, col, type = CellType.blank) {
        this.row = row
        this.col = col
        this.type = type
    }

    // get isWorm() { return this.type === Cell.#types.worm }
    // get isFood() { return this.type === Cell.#types.food }
    // get isBlank() { return this.type === Cell.#types.blank }
    // get isWall() { return this.type === Cell.#types.wall }
    // get isDeadly() { return this.isWall || this.isWorm }

    // beWorm() {
    //     this.type = Cell.#types.worm;
    //     this.element.className = 'worm';
    // }

    // beFood() {
    //     this.type = Cell.#types.food;
    //     this.element.className = 'food';
    // }

    // beBlank() {
    //     this.type = Cell.#types.blank;
    //     this.element.className = 'cell';
    // }

    // beWall() {
    //     this.type = Cell.#types.wall;
    //     this.element.className = 'wall';
    // }
}
