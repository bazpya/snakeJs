runModeEnum = Object.freeze({ "manual": "manual", "auto": "auto" });

Ai = function (game) {
    this.game = game;
    log("tf version:");
    log(tf.version);
    log("tf backend:");
    log(tf.getBackend());
    tf.add(1, 3).print();
    tfvis.visor();
    const inputMatrix = {
        values: [
            [1,1,1,1,1],
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,0,0,0,1],
            [1,1,1,1,1]
        ]
    };
    const surface = { name: "Dasoo heatmap", tab: "Dasoo charts" }
    tfvis.render.heatmap(surface, inputMatrix);
}