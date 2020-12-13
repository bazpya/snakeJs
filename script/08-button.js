class Button {
    constructor(game, element) {
        this.game = game;
        this.element = element;
        this.beStartButton();
    }

    beStartButton() {
        let me = this;
        this.game.mouse.bindById(this.element.id, () => me.game.start()); //Todo: No direct reference to game props
    }

    beRestartButton() {
        this.element.firstChild.textContent = "Restart";
        let me = this;
        this.game.mouse.bindById(this.element.id, () => me.game.restart());
    }
} 
