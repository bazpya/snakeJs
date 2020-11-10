runModeEnum = Object.freeze({ "manual": "manual", "auto": "auto" });

Ai = function (game) {
    this.game = game;
    this.game.splash.element.click();

    log("tf core version: " + tf.version["tfjs-core"]);
    log("tf backend: " + tf.getBackend());

    let inputMatrix = this.getInputValues();
    this.visualise(inputMatrix);
    log(this.getNextDirection());
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

Ai.prototype.getNextDirection = function (cell) {
    let myRandom = new Random();
    return myRandom.pickElement(Object.values(directionEnum));
}

Ai.prototype.run = function () {
    //Todo: implement
}

Ai.prototype.visualise = function (matrix) {
    tfvis.visor();
    const inputObj = { values: matrix };
    const surface = { name: "dasoo name", tab: "dasoo tab" }
    tfvis.render.heatmap(surface, inputObj);
}
