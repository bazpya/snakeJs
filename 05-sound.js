Sound = function (volume) {
    this.audioCtx = new AudioContext();
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.connect(this.audioCtx.destination);
    this.gainNode.gain.value = volume;

    this.foodBeepOscillator = this.audioCtx.createOscillator();
    this.foodBeepOscillator.frequency.value = 2000;
    this.foodBeepOscillator.connect(this.gainNode);
    this.foodBeepOscillator.start();
    this.foodBeepOscillator.disconnect();

    this.mouseInBeepOscillator = this.audioCtx.createOscillator();
    this.mouseInBeepOscillator.frequency.value = 3000;
    this.mouseInBeepOscillator.connect(this.gainNode);
    this.mouseInBeepOscillator.start();
    this.mouseInBeepOscillator.disconnect();

    this.mouseOutBeepOscillator = this.audioCtx.createOscillator();
    this.mouseOutBeepOscillator.frequency.value = 2500;
    this.mouseOutBeepOscillator.connect(this.gainNode);
    this.mouseOutBeepOscillator.start();
    this.mouseOutBeepOscillator.disconnect();
}

Sound.prototype.foodBeep = function () {
    let me = this;
    this.foodBeepOscillator.connect(this.gainNode);
    setTimeout(() => { me.foodBeepOscillator.disconnect() }, 70);
}

Sound.prototype.mouseInBeep = function () {
    let me = this;
    this.mouseInBeepOscillator.connect(this.gainNode);
    setTimeout(() => { me.mouseInBeepOscillator.disconnect() }, 50);
}

Sound.prototype.mouseOutBeep = function () {
    let me = this;
    this.mouseOutBeepOscillator.connect(this.gainNode);
    setTimeout(() => { me.mouseOutBeepOscillator.disconnect() }, 50);
}
