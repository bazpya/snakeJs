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
            funcs: {},
        };
        this.age = 0;
        this.mapKeys();
    }

    get head() { return this.sections[0] }
    get tail() { return this.sections.last }
    get length() { return this.sections.length }
    get isUnicellular() { return this.length === 1 }
    get isMulticellular() { return this.length !== 1 }

    step = function () {
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

    getNextCell = function () {
        if (this.direction.queue.hasAny)
            this.direction.current = this.direction.queue.takeFirstOut();
        return this.game.grid.getNextCell(this.head, this.direction.current);
    }

    moveHeadTo = function (nextHeadCell) {
        this.sections.addToFront(nextHeadCell);
        this.head.beWorm();
    }

    moveTail = function () {
        this.tail.beBlank();
        this.sections.takeLastOut();
    }

    disappear = function () {
        this.sections.forEach(s => s.beBlank());
    }

    mapKeys = function () {
        let me = this;
        this.direction.funcs[Direction.up] = function () {
            if (me.shouldIgnoreDirection(Direction.up))
                return;
            me.direction.queue.push(Direction.up);
            me.direction.lastInput = Direction.up;
        };
        this.direction.funcs[Direction.right] = function () {
            if (me.shouldIgnoreDirection(Direction.right))
                return;
            me.direction.queue.push(Direction.right);
            me.direction.lastInput = Direction.right;
        };
        this.direction.funcs[Direction.down] = function () {
            if (me.shouldIgnoreDirection(Direction.down))
                return;
            me.direction.queue.push(Direction.down);
            me.direction.lastInput = Direction.down;
        };
        this.direction.funcs[Direction.left] = function () {
            if (me.shouldIgnoreDirection(Direction.left))
                return;
            me.direction.queue.push(Direction.left);
            me.direction.lastInput = Direction.left;
        };
    }

    shouldIgnoreDirection = function (dirCode) {
        if (dirCode === this.direction.lastInput)
            return true;
        if (this.isMulticellular && Direction.areOpposite(dirCode, this.direction.lastInput)) // No backwards moving
            return true;
    }
} 
