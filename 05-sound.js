//#############################  Sound  #############################################
//###################################################################################

Game.prototype.initialiseSound = function () {
    this.sound = {};
    if (typeof this.sound.audioCtx === 'undefined') {
        this.sound.audioCtx = new AudioContext();

        this.sound.foodBeepOscillator = this.sound.audioCtx.createOscillator();
        this.sound.foodBeepOscillator.frequency.value = 2000;
        this.sound.foodBeepOscillator.connect(this.sound.audioCtx.destination);
        this.sound.foodBeepOscillator.start();
        this.sound.foodBeepOscillator.disconnect();

        this.sound.mouseInBeepOscillator = this.sound.audioCtx.createOscillator();
        this.sound.mouseInBeepOscillator.frequency.value = 3000;
        this.sound.mouseInBeepOscillator.connect(this.sound.audioCtx.destination);
        this.sound.mouseInBeepOscillator.start();
        this.sound.mouseInBeepOscillator.disconnect();

        this.sound.mouseOutBeepOscillator = this.sound.audioCtx.createOscillator();
        this.sound.mouseOutBeepOscillator.frequency.value = 2500;
        this.sound.mouseOutBeepOscillator.connect(this.sound.audioCtx.destination);
        this.sound.mouseOutBeepOscillator.start();
        this.sound.mouseOutBeepOscillator.disconnect();
    };
};

Game.prototype.foodBeep = function () {
    let me = this;
    this.sound.foodBeepOscillator.connect(this.sound.audioCtx.destination);
    setTimeout(() => { me.sound.foodBeepOscillator.disconnect() }, 70);
};

Game.prototype.mouseInBeep = function () {
    let me = this;
    this.sound.mouseInBeepOscillator.connect(this.sound.audioCtx.destination);
    setTimeout(() => { me.sound.mouseInBeepOscillator.disconnect() }, 50);
};

Game.prototype.mouseOutBeep = function () {
    let me = this;
    this.sound.mouseOutBeepOscillator.connect(this.sound.audioCtx.destination);
    setTimeout(() => { me.sound.mouseOutBeepOscillator.disconnect() }, 50);
};
