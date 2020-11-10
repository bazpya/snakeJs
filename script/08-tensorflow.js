runModeEnum = Object.freeze({ "manual": "manual", "auto": "auto" });

Ai = function (game) {
    this.game = game;
    log("tf version:");
    log(tf.version);
    log("tf backend:");
    log(tf.getBackend());

    // this.game.splash.element.click();
    // tfvis.visor();
    // const inputMatrix = {
    //     values: this.game.grid.cells
    // };
    // const surface = { name: "Dasoo heatmap", tab: "Dasoo charts" }
    // tfvis.render.heatmap(surface, inputMatrix);
}