snakeConfig = {
    devMode: false,
    startAtCentre: true,
    numberOfFoodCellsAtOnce: 1,
    stepTime: {
        initial: 120,  // milliseconds
        decrement: 5,  // milliseconds
        min: 70,  // milliseconds
    },
    grid: {
        height: 20,  // cells >= 4
        width: 20,  // cells >= 4
    },
    keys: {
        up: 'E',
        right: 'F',
        down: 'D',
        left: 'S',
        pause: ' ',
    },
    soundVolume: 0.05,  // [0~1]
}
