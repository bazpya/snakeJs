onload = function () {
	if (znakeConfig.runMode === runModeEnum.manual) {
		game = new Game(znakeConfig);
	} else {
		game = new AiGame(znakeConfig);
	}
}
