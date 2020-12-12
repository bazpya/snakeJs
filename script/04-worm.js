class Worm {
    constructor(game) {
        this.game = game;
        this.sections = [];
        let origin = this.game.grid.getStartCell();
        let originIsFood = origin.isFood;
        this.sections.push(origin);
        this.head.beWorm();
        if (originIsFood)
            this.game.feeder.dropFood();
        this.direction = {
            queue: [Direction.right],
            current: Direction.right,
            lastInput: Direction.right,
        };
        this.age = 0;
    }

    get head() { return this.sections[0] }
    get tail() { return this.sections.last }
    get length() { return this.sections.length }
    get isUnicellular() { return this.length === 1 }
    get isMulticellular() { return this.length !== 1 }

    step() {
        this.age++;
        let nextCell = this.getNextCell();

        if (nextCell.isDeadly) {
            this.game.wormDied();
            this.sections.forEachInterval(s => s.beWall(), this.game.intervaller.period);
        }
        else if (nextCell.isFood) {
            this.moveHeadTo(nextCell);
            this.game.foodEaten();
        }
        else {
            this.moveHeadTo(nextCell);
            this.moveTail();
        }
    }

    getNextCell() {
        if (this.direction.queue.hasAny)
            this.direction.current = this.direction.queue.takeFirstOut();
        return this.game.grid.getNextCell(this.head, this.direction.current);
    }

    moveHeadTo(nextHeadCell) {
        this.sections.addToFront(nextHeadCell);
        this.head.beWorm();
    }

    moveTail() {
        this.tail.beBlank();
        this.sections.takeLastOut();
    }

    disappear() {
        this.sections.forEach(s => s.beBlank());
    }

    input(dir) {
        if (dir === this.direction.lastInput)
            return;
        if (this.isMulticellular && Direction.areOpposite(dir, this.direction.lastInput)) // No backwards moving
            return;

        this.direction.queue.push(dir);
        this.direction.lastInput = dir;
    }
} 
