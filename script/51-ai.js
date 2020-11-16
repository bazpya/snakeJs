Ai = function (game) {
    this.game = game;
    this.runLoopId = 0;
    this.generation = [];
    this.generationCount = this.game.config.ai.generationCount;
    this.inputVectorSize = this.game.grid.width * this.game.grid.height;

    this.initialise();
    // let inputMatrix = this.getInputMatrix();
    // this.visualise(inputMatrix);
}

Ai.prototype.initialise = function () {
    for (let i = 0; i < this.generationCount; i++)
        this.generation.push(this.createModel());
    this.currentModelIndex = 0;
    this.currentModel = this.generation[0];
}

Ai.prototype.generationFinished = function () {
    log('done');
}

Ai.prototype.populateNextGeneration = function () {
    //Implement
}

Ai.prototype.createModel = function () {
    let model = tf.sequential();
    model.add(tf.layers.dense({ units: 90, inputShape: [this.inputVectorSize] }));  //Todo: Make units a function of the grid size
    model.add(tf.layers.dense({ units: 20 }));
    model.add(tf.layers.dense({ units: 4 }));
    // const optimiser = tf.train.sgd(0.1);
    // this.currentModel.compile({ loss: "meanSquaredError", optimizer: optimiser });
    return model;
}

Ai.prototype.pickNextModel = function () {
    this.currentModelIndex++;
    if (this.currentModelIndex < this.generationCount) {
        this.currentModel = this.generation[this.currentModelIndex];
        return true;
    }
    else return false;
}

Ai.prototype.getNextDirection = function () {
    // let myRandom = new Random();
    // return myRandom.pickElement(Object.values(directionEnum));
    let inputVector = this.getInputVector();
    let modelOutput = tf.tidy(() => {
        let inputTensor = tf.tensor(inputVector, [1, this.inputVectorSize]);
        return this.currentModel.predict(inputTensor, args = { batchSize: 1 });
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
