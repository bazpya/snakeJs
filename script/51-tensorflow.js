Ai = function (game) {
    this.game = game;
    this.runLoopId = 0;

    this.initialise();
    // let inputMatrix = this.getInputMatrix();
    // this.visualise(inputMatrix);
}

Ai.prototype.initialise = function () {
    this.model = tf.sequential();
    this.inputVectorSize = this.game.grid.width * this.game.grid.height;
    log(this.inputVectorSize);
    this.model.add(tf.layers.dense({ units: 8, inputShape: [this.inputVectorSize] }));
    // this.model.add(tf.layers.dense({ units: 20 }));
    this.model.add(tf.layers.dense({ units: 4 }));
    // log("Output shape: " + JSON.stringify(this.model.outputs[0].shape));
    // this.model.summary();

    // const optimiser = tf.train.sgd(0.1);
    // this.model.compile({ loss: "meanSquaredError", optimizer: optimiser });
}

Ai.prototype.run = function () {
    let inputVector = this.getInputVector();
    let inputTensor = tf.tensor(inputVector, [1, this.inputVectorSize]);
    this.model.predict(inputTensor, args = { batchSize: 1 }).print();

    // this.runLoopId++;
    // let me = this;
    // this.runLoopHandle = setInterval(function () {
    //     let directionCode = me.getNextDirection();
    //     me.game.control.funcs[directionCode]();
    //     me.game.worm.update();
    // }, me.game.movingTimeStep);
}

Ai.prototype.getNextDirection = function (cell) {
    let myRandom = new Random();
    return myRandom.pickElement(Object.values(directionEnum));
}

Ai.prototype.stopRunning = function () {
    clearInterval(this.runLoopHandle);
}

Ai.prototype.getInputMatrix = function () {
    let gridCells = this.game.grid.cells;
    let values = [];
    for (let row of gridCells)
        values.push(row.map(this.getCellValue));
    //Todo: Do we really need to add moving direction to inputs?
    return values;
}

Ai.prototype.getInputVector = function () {
    return this.game.grid.cells.flat().map(this.getCellValue);
}

Ai.prototype.getCellValue = function (cell) {
    if (cell.isFood)
        return 0;
    if (cell.isBlank)
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
