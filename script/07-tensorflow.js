runModeEnum = Object.freeze({ "manual": "manual", "auto": "auto" });

Ai = function (game) {
    this.game = game;
    log("tf version:");
    log(tf.version);
    log("tf backend:");
    log(tf.getBackend());
    
    tf.add(1, 3).print();
}