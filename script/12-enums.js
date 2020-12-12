directionEnum = Object.freeze({ up: 1, right: 2, down: 3, left: 4 });
oppositeDirectionEnum = Object.freeze({ 1: 3, 2: 4, 3: 1, 4: 2 });

cellTypeEnum = Object.freeze({ blank: "blank", wall: "wall", worm: "worm", food: "food" });

soundDefinitions = Object.freeze({
	"foodBeep": [2000, 70],
	"mouseInBeep": [3000, 50],
	"mouseOutBeep": [2500, 50]
});
