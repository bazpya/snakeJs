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
    this.model.add(tf.layers.dense({ units: 90, inputShape: [this.inputVectorSize] }));  //Todo: Make this a function of the grid size
    this.model.add(tf.layers.dense({ units: 20 }));
    this.model.add(tf.layers.dense({ units: 4 }));
    // const optimiser = tf.train.sgd(0.1);
    // this.model.compile({ loss: "meanSquaredError", optimizer: optimiser });
}

Ai.prototype.run = function () {
    this.runLoopId++;
    let me = this;
    this.runLoopHandle = setInterval(function () {
        let direction = me.getNextDirection();
        me.game.control.funcs[direction]();
        me.game.worm.update();
    }, me.game.movingTimeStep);
}

Ai.prototype.getNextDirection = function (cell) {
    // let myRandom = new Random();
    // return myRandom.pickElement(Object.values(directionEnum));
    let inputVector = this.getInputVector();
    let modelOutput = tf.tidy(() => {
        let inputTensor = tf.tensor(inputVector, [1, this.inputVectorSize]);
        return this.model.predict(inputTensor, args = { batchSize: 1 });
    });
    let direction = this.getDirectionFromOutput(modelOutput);
    return direction;
}

Ai.prototype.getDirectionFromOutput = function (tensor) {
    // tensor.print();
    let array = tensor.arraySync()[0];
    let indexOfMax = array.getIndexOfMax();
    return indexOfMax + 1;  // because directions start from 1
}

Ai.prototype.stopRunning = function () {
    clearInterval(this.runLoopHandle);
}

Ai.prototype.getInputMatrix = function () {
    let gridCells = this.game.grid.cells;
    let values = [];
    for (let row of gridCells)
        values.push(row.map(this.getCellValue));
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
