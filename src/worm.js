class Worm {
    #intervaller;
    #grid;
    #gameCallbacks = {};

    constructor(grid, startAtCentre, stepTime, gameCallbacks) {
        this.#grid = grid;
        this.#gameCallbacks = gameCallbacks;
        this.sections = [];
        let origin = grid.getStartCell(startAtCentre);
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
            me.#gameCallbacks.onStepTaken(me.age);
        }, stepTime.initial, stepTime.decrement, stepTime.min);

        this.#gameCallbacks.onWormBorn(originWasFood);
    }

    get head() { return this.sections[0] }
    get tail() { return this.sections.at(-1) }
    get length() { return this.sections.length }
    get isUnicellular() { return this.length === 1 }
    get isMulticellular() { return this.length !== 1 }

    run() {
        this.#intervaller.run();
    }

    step() {
        this.age++;
        let nextCell = this.getNextCell();

        if (nextCell.isDeadly)
            this.#die();

        else if (nextCell.isFood) {
            this.moveHeadTo(nextCell);
            this.#gameCallbacks.onFoodEaten();
        }
        else {
            this.moveHeadTo(nextCell);
            this.moveTail();
        }
    }

    speedUp() {
        this.#intervaller.stepUp();
    }

    stop() {
        this.#intervaller.stop();
    }

    getNextCell() {
        if (this.direction.queue.length > 0)
            this.direction.current = this.direction.queue.shift();
        return this.#grid.getNextCell(this.head, this.direction.current);
    }

    moveHeadTo(nextHeadCell) {
        this.sections.unshift(nextHeadCell);
        this.head.beWorm();
    }

    moveTail() {
        this.tail.beBlank();
        this.sections.pop();
    }

    disappear() {
        this.sections.forEach(s => s.beBlank());
    }

    #die() {
        this.#gameCallbacks.onWallHit();

        const arr = this.sections;
        const action = (s) => s.beWall();
        const timeStep = this.#intervaller.period;
        const callback = () => this.#gameCallbacks.onWormDied();

        let i = 0;
        let elem = arr[0];
        action(elem, i, arr);
        const loopHandle = setInterval(function () {
            i++;
            if (i < arr.length) {
                elem = arr[i];
                action(elem, i, arr);
            } else {
                clearInterval(loopHandle);
                callback();
            }
        }, timeStep);
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
