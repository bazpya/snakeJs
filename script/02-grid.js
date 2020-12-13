class Grid {
    constructor(game, container, config) {
        this.game = game;
        this.container = container;
        this.height = config.height;
        this.width = config.width;
        this.element = document.createElement('table');
        this.element.id = 'grid';
        this.cells = [];
        for (let col = 0; col < this.width; col++) {
            this.cells.push([]);
            for (let row = 0; row < this.height; row++) {
                let newCell = new Cell(row, col);
                if (col == 0 || col == this.lastColIndex || row == 0 || row == this.lastRowIndex) newCell.beWall();
                this.cells[col].push(newCell);
            }
        }
        for (let row = 0; row < this.height; row++) {
            let newRow = document.createElement('tr');
            for (let col = 0; col < this.width; col++) {
                let cell = this.cells[col][row];
                newRow.appendChild(cell.element);
            }
            this.element.appendChild(newRow);
        }
        this.container.appendChild(this.element);
    }

    get lastRowIndex() { return this.height - 1 }
    get lastColIndex() { return this.width - 1 }

    getStartCell(atCentre = false) {
        return atCentre ? this.getCentreCell() : this.getBlankCells()[0];
    }

    getCentreCell() {
        let row = Math.floor((this.height - 1) / 2); //Because indexes are zero based
        let col = Math.floor((this.width - 1) / 2);
        return this.cells[col][row];
    }

    getNextCell(wormHead, direction) {
        if (direction == Direction.up) return this.cells[wormHead.col][wormHead.row - 1];
        else if (direction == Direction.right) return this.cells[wormHead.col + 1][wormHead.row];
        else if (direction == Direction.down) return this.cells[wormHead.col][wormHead.row + 1];
        else if (direction == Direction.left) return this.cells[wormHead.col - 1][wormHead.row];
    }

    getBlankCells() {
        let flatArrayOfCells = this.cells.flat();
        return flatArrayOfCells.filter((cell, index) => cell.isBlank);
    }
}
