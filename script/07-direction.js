class Direction {
    constructor() {
        throw "Don't instantiate static class";
    }

    static #ENUM = Object.freeze({ up: "up", right: "right", down: "down", left: "left" });
    static #OPPOSITE_ENUM = Object.freeze({ up: "down", right: "left", down: "up", left: "right" });

    static get up() { return Direction.#ENUM.up }
    static get right() { return Direction.#ENUM.right }
    static get down() { return Direction.#ENUM.down }
    static get left() { return Direction.#ENUM.left }

    static areOpposite(dirA, dirB) {
        return (Direction.#OPPOSITE_ENUM[dirA] === dirB);
    }
}

