//###########################  Splash  ############################################
Splash = function (game) {
    this.game = game;
    let elementId;
    if (this.game.config.runMode === runModeEnum.auto)
        elementId = 'splash-ai';
    else if (this.game.config.devMode)
        elementId = 'splash-dev';
    else
        elementId = 'splash-manual';

    this.element = document.getElementById(elementId);
    this.bindHandler();
    this.popUp();
}

Splash.prototype.bindHandler = function () {
    let me = this;
    this.element.onclick = function () {
        me.popDown();
        me.game.splashClicked();
    };
}

Splash.prototype.popUp = function () {
    this.element.classList.replace('popdown', 'popup');
}

Splash.prototype.popDown = function () {
    this.element.classList.replace('popup', 'popdown');
}

//###########################  Pause Overlay  #####################################
PauseOverlay = function (game) {
    this.game = game;
    let elementId;
    if (this.game.config.runMode === runModeEnum.auto)
        elementId = 'pause-ai';
    else if (this.game.config.devMode)
        elementId = 'pause-dev';
    else
        elementId = 'pause-manual';

    this.element = document.getElementById(elementId);
}

PauseOverlay.prototype.popUp = function () {
    this.element.classList.replace('popdown', (this.game.config.devMode) ? 'popup' : 'popup');
}

PauseOverlay.prototype.popDown = function () {
    this.element.classList.replace((this.game.config.devMode) ? 'popup' : 'popup', 'popdown');
}

//############################  Score Board  ######################################
ScoreBoard = function (game, element) {
    this.game = game;
    this.element = element;
}

ScoreBoard.prototype.update = function (number) {
    this.element.innerHTML = number;
}

ScoreBoard.prototype.reset = function () {
    this.update(1); // Minimum length
}

//############################  Button  ######################################
Button = function (game, element) {
    this.game = game;
    this.element = element;
    this.beStartButton();
}

Button.prototype.beStartButton = function () {
    let me = this;
    this.game.mouse.bindById(this.element.id, () => me.game.start());
}

Button.prototype.beRestartButton = function () {
    this.element.firstChild.textContent = "Restart";
    let me = this;
    this.game.mouse.bindById(this.element.id, () => me.game.restart());
}