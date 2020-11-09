//###########################  Grid  ##############################################

directionEnum = Object.freeze({ "up": 0, "right": 1, "down": 2, "left": 3 });
oppositeDirectionEnum = Object.freeze({ 0: 2, 1: 3, 2: 0, 3: 1 });

Grid = function (game) {
    this.game = game;
    this.container = this.game.gridContainer;
    let height = this.game.config.gridHeight;
    let width = this.game.config.gridWidth;
    this.element = document.createElement('table');
    this.element.id = 'grid';
    this.cells = [];
    for (let row = 0; row < height; row++) {
        let newRow = document.createElement('tr');
        this.cells.push([]);
        for (let col = 0; col < width; col++) {
            let newCell = new Cell(row, col);
            if (col == 0 || col == width - 1 || row == 0 || row == height - 1) newCell.beObstacle();
            newRow.appendChild(newCell.element);
            this.cells[row].push(newCell);
        }
        this.element.appendChild(newRow);
    }
    this.container.appendChild(this.element);

    this.nextCellGettingFunctions = {};
    this.nextCellGettingFunctions[directionEnum.up] = (me, wormHead) => me.cells[wormHead.row - 1][wormHead.column];
    this.nextCellGettingFunctions[directionEnum.right] = (me, wormHead) => me.cells[wormHead.row][wormHead.column + 1];
    this.nextCellGettingFunctions[directionEnum.down] = (me, wormHead) => me.cells[wormHead.row + 1][wormHead.column];
    this.nextCellGettingFunctions[directionEnum.left] = (me, wormHead) => me.cells[wormHead.row][wormHead.column - 1];
}

Grid.prototype.getStartCell = function () {
    if (this.game.config.startAtCentre)
        return this.getCentreCell();
    else
        return this.cells[1][1];
}

Grid.prototype.getCentreCell = function () {
    let row = Math.floor(this.game.config.gridHeight / 2 - 1);
    let col = Math.floor(this.game.config.gridWidth / 2 - 1);
    return this.cells[row][col];
}

Grid.prototype.getNextCell = function (worm) {
    return this.nextCellGettingFunctions[worm.currentDirection](this, worm.head);
}

Grid.prototype.getBlankCells = function () {
    let flatArrayOfCells = this.cells.flat();
    return flatArrayOfCells.filter((cell, index) => cell.isBlank);
}

Grid.prototype.erase = function () {
    this.container.removeChild(this.element);
}

//############################  Cell  #############################################

cellTypeEnum = Object.freeze({ "blank": "blank", "obstacle": "obstacle", "worm": "worm", "food": "food" });

Cell = function (rowNumber, colNumber) {
    this.element = document.createElement('td');
    this.element.className = 'cell';
    this.element.cell = this;
    this.row = rowNumber;
    this.column = colNumber;
    this.type = cellTypeEnum.blank;
}

Cell.prototype.beWorm = function () {
    this.type = cellTypeEnum.worm;
    this.element.className = 'worm';
}

Cell.prototype.beFood = function () {
    this.type = cellTypeEnum.food;
    this.element.className = 'food';
}

Cell.prototype.beBlank = function () {
    this.type = cellTypeEnum.blank;
    this.element.className = 'cell';
}

Cell.prototype.beObstacle = function () {
    this.type = cellTypeEnum.obstacle;
    this.element.className = 'obstacle';
}

Object.defineProperties(Cell.prototype, {
    isWorm: { get: function () { return this.type === cellTypeEnum.worm } },
    isFood: { get: function () { return this.type === cellTypeEnum.food } },
    isBlank: { get: function () { return this.type === cellTypeEnum.blank } },
    isObstacle: { get: function () { return this.type === cellTypeEnum.obstacle } },
    isDeadly: { get: function () { return this.type === cellTypeEnum.obstacle || this.type === cellTypeEnum.worm } },
});
