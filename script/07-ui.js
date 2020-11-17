//############################  Info Board  ######################################
InfoBoard = function (game) {
    this.game = game;
    this.score = document.getElementById('score');
    this.lifeCount = document.getElementById('life-count');
}

InfoBoard.prototype.updateScore = function (number) {
    this.score.innerHTML = number;
}

InfoBoard.prototype.life = function (number) {
    this.lifeCount.innerHTML = number;
}

InfoBoard.prototype.reset = function () {
    this.updateScore(1); // Minimum length
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