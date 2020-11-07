
//###########################  Grid  ##############################################
//#################################################################################

Grid = function (container, height, width) {
    this.container = container;
    this.element = document.createElement('table');
    this.element.id = 'grid';
    this.cells = [];
    for (let row = 0; row < height; row++) {
        let newRow = document.createElement('tr');
        this.cells.push([]);
        for (let col = 0; col < width; col++) {
            let newCell = new Cell(row, col);
            // if(x == 1 || x == width - 2 || y == 1 || y == height - 2) newCell.beFood();
            // if(x == 2 || x == width - 3 || y == 2 || y == height - 3) newCell.beFood();
            // if(x == 3 || x == width - 4 || y == 3 || y == height - 4) newCell.beFood();
            // if(x == 4 || x == width - 5 || y == 4 || y == height - 5) newCell.beFood();
            // if(x == 5 || x == width - 6 || y == 5 || y == height - 6) newCell.beFood();
            // if(x == 6 || x == width - 7 || y == 6 || y == height - 7) newCell.beFood();
            if (col == 0 || col == width - 1 || row == 0 || row == height - 1) newCell.beObstacle();
            newRow.appendChild(newCell.element);
            this.cells[row].push(newCell);
        }
        this.element.appendChild(newRow);
    }
    this.container.appendChild(this.element);
}

Grid.prototype.erase = function () {
    this.container.removeChild(this.element);
}

//############################  Cell  #############################################
//#################################################################################

cellTypeEnum = Object.freeze({ "blank": "blank", "obstacle": "obstacle", "worm": "worm", "food": "food" })

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
});
