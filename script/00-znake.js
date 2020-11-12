onload = function () {
	if (znakeConfig.runMode === runModeEnum.manual) {
		game = new Game(znakeConfig);
	} else {
		game = new AiGame(znakeConfig);
	}
}

runModeEnum = Object.freeze({ "manual": "manual", "auto": "auto" });
