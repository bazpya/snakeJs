znakeConfig = {
    devMode: false,
    startAtCentre: true,
    numberOfFoodCellsAtOnce: 1,
    grid: {
        height: 20,  // cells >= 4
        width: 20,  // cells >= 4
    },
    worm: {
        stepTime: 120,  // milliseconds
        stepTimeMin: 70,  // milliseconds
        stepTimeDecrement: 5,  // milliseconds
    },
    keys: {
        up: 'E',
        right: 'F',
        down: 'D',
        left: 'S',
        pause: ' ',
    },
    soundVolume: 0.15,  // [0~1]
}
