class Cell {
    constructor(rowNumber, colNumber) {
        this.element = document.createElement('td');
        this.element.className = 'cell';
        this.element.cell = this;
        this.row = rowNumber;
        this.col = colNumber;
        this.type = cellTypeEnum.blank;
    }

    get isWorm() { return this.type === cellTypeEnum.worm }
    get isFood() { return this.type === cellTypeEnum.food }
    get isBlank() { return this.type === cellTypeEnum.blank }
    get isWall() { return this.type === cellTypeEnum.wall }
    get isDeadly() { return this.isWall || this.isWorm }

    beWorm = function () {
        this.type = cellTypeEnum.worm;
        this.element.className = 'worm';
    }

    beFood = function () {
        this.type = cellTypeEnum.food;
        this.element.className = 'food';
    }

    beBlank = function () {
        this.type = cellTypeEnum.blank;
        this.element.className = 'cell';
    }

    beWall = function () {
        this.type = cellTypeEnum.wall;
        this.element.className = 'wall';
    }
}
