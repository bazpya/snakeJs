class Worm {
    #stepTime;
    #intervaller;
    constructor(game, stepTime) {
        this.game = game;
        this.#stepTime = {
            initial: stepTime.initial,
            decrement: stepTime.decrement,
            min: stepTime.min,
        };
        this.sections = [];
        let origin = this.game.grid.getStartCell();
        let originWasFood = origin.isFood;
        this.sections.push(origin);
        this.head.beWorm();
        this.direction = {
            queue: [Direction.right],
            current: Direction.right,
            lastInput: Direction.right,
        };
        this.age = 0;
        let me = this;
        this.#intervaller = new Intervaller(() => {
            me.step();
            me.game.infoboard.set(infoboardKeysEnum.Age, me.age); //Todo: Move to a callback on game
        }, this.#stepTime.initial);
        this.game.onWormBorn(originWasFood);
    }

    get head() { return this.sections[0] }
    get tail() { return this.sections.last }
    get length() { return this.sections.length }
    get isUnicellular() { return this.length === 1 }
    get isMulticellular() { return this.length !== 1 }

    run() {
        this.#intervaller.run();
    }

    step() {
        this.age++;
        let nextCell = this.getNextCell();

        if (nextCell.isDeadly) {
            this.sections.forEachInterval(s => s.beWall(), this.#intervaller.period);
            this.game.onWormDied();
        }
        else if (nextCell.isFood) {
            this.moveHeadTo(nextCell);
            this.game.onFoodEaten();
        }
        else {
            this.moveHeadTo(nextCell);
            this.moveTail();
        }
    }

    speedUp() {
        if (this.#intervaller.period > this.#stepTime.min) { //Todo: Move logic to intervaller
            const newPeriod = this.#intervaller.period - this.#stepTime.decrement;
            this.#intervaller.setPeriod(newPeriod);
        }
    }

    stop() {
        this.#intervaller.stop();
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
