znakeConfig = {
    devMode: false,
    gridHeight: 8,  // cells >= 4
    gridWidth: 8,  // cells >= 4
    movingTimeStep: 120,  // milliseconds
    movingTimeStepDecrement: 5,  // milliseconds
    minimumMovingTimeStep: 70,  // milliseconds
    feedingTimeStep: 3000,  // milliseconds
    numberOfFoodCellsAtOnce: 1,
    startAtCentre: true,
    keys: {
        up: 'E',
        right: 'F',
        down: 'D',
        left: 'S',
        pause: ' ',
    },
    soundVolume: 0.15,  // [0~1]
    runMode: runModeEnum.auto,  // 0 = manual 1 = auto
    autorunLifeCount: 30,
}

//Todo: Add option to only drop food upon initialisation based on a given pattern
//Todo: Add option to prevent worm growth
//Todo: Experiment with model save, load, etc.
//Todo: Experiment with model history, crossover, genetic algorithm, etc.
//Todo: Use the tidy() function for model operations
//Todo: After implementing genetic algorithm, considre adding other criterial like life time of the worm
