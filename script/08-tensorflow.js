runModeEnum = Object.freeze({ "manual": "manual", "auto": "auto" });

Ai = function (game) {
    this.game = game;
    this.game.splash.element.click();

    log("tf core version: " + tf.version["tfjs-core"]);
    log("tf backend: " + tf.getBackend());

    tfvis.visor();
    let inputMatrix = this.getInputValues();

    const inputObj = {
        values: inputMatrix
    };
    const surface = { name: "Dasoo heatmap", tab: "Dasoo charts" }
    tfvis.render.heatmap(surface, inputObj);
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
    //Implement
}

