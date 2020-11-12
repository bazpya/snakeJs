Ai = function (game) {
    this.game = game;
    this.runLoopId = 0;

    this.initialise();
    let inputMatrix = this.getInputValues();
    this.visualise(inputMatrix);
}

Ai.prototype.initialise = function () {
    log("initialise");
}

Ai.prototype.run = function () {
    this.runLoopId++;
    let me = this;
    this.runLoopHandle = setInterval(function () {
        let directionCode = me.getNextDirection();
        me.game.control.funcs[directionCode]();
        me.game.worm.update();
    }, me.game.movingTimeStep);
}

Ai.prototype.getNextDirection = function (cell) {
    let myRandom = new Random();
    return myRandom.pickElement(Object.values(directionEnum));
}

Ai.prototype.stopRunning = function () {
    clearInterval(this.runLoopHandle);
}

Ai.prototype.getInputValues = function () {
    let gridCells = this.game.grid.cells;
    let values = [];
    for (let row of gridCells)
        values.push(row.map(this.getCellValue));

    return values;
}

Ai.prototype.getCellValue = function (cell) {
    if (cell.isBlank)
        return 0;
    if (cell.isFood)
        return 1;
    if (cell.isDeadly)
        return 2;
}

Ai.prototype.visualise = function (matrix) {
    tfvis.visor();
    const inputObj = { values: matrix };
    const surface = { name: "dasoo name", tab: "dasoo tab" }
    tfvis.render.heatmap(surface, inputObj);
}
