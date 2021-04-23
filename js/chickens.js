/**
 * Corrects the chickens' position when background is moving.
 * 
 * @param  {boolean} movingDirection - Moving direction of the character.
 */
 function correctChickenPosition(movingDirection) {
    if (movingDirection == isMovingRight) {
        for (let i = 0; i < chickens.length; i++) {
            let chicken = chickens[i];
            chicken.position_x = chicken.position_x - GAME_SPEED;
        }
    }
    else if (movingDirection == isMovingLeft) {
        for (let i = 0; i < chickens.length; i++) {
            let chicken = chickens[i];
            chicken.position_x = chicken.position_x + GAME_SPEED;
        }
    }
}

/**
 * Creates an array with all chicken enemy objects in the game.
 */
function createChickenList() {
    chickens = [
        createChicken("yellow", canvas.width + 400, chicken_y, 0.4, 0),
        createChicken("yellow", canvas.width * 3 + 400, chicken_y, 0.4, 0),
        createChicken("yellow", canvas.width * 3 + 800, chicken_y, 0.4, 0),
        createChicken("yellow", canvas.width * 6 + 400, chicken_y, 0.4, -1),
        createChicken("brown", canvas.width * 6 + 600, chicken_y - 25, 0.5, 5),
        createChicken("yellow", canvas.width * 6 + 800, chicken_y, 0.4, 0),
        createChicken("yellow", canvas.width * 9 + 400, chicken_y, 0.4, 0),
        createChicken("brown", canvas.width * 9 + 600, chicken_y - 25, 0.5, 5),
        createChicken("yellow", canvas.width * 9 + 800, chicken_y, 0.4, 0),
        createChicken("yellow", canvas.width * 10 + 500, chicken_y, 0.4, 0),
        createChicken("yellow", canvas.width * 11 + 100, chicken_y, 0.4, 5),
        createChicken("yellow", canvas.width * 12 + 800, chicken_y, 0.4, 5),
        createChicken("yellow", canvas.width * 13 + 300, chicken_y, 0.4, 5),
        createChicken("yellow", canvas.width * 14 + 800, chicken_y, 0.4, 10),
        createChicken("brown", canvas.width * 30 + 500, chicken_y - 50, 0.6, 20),
        createChicken("brown", canvas.width * 40 + 500, chicken_y - 50, 0.6, 20),
        createChicken("brown", canvas.width * 50 + 500, chicken_y - 60, 0.7, 25)
    ];
}

/**
 * Creates a chicken enemy object.
 * 
 * @param  {string} type - The chicken's type.
 * @param  {number} position_x - The chicken's horizontal position.
 * @param  {number} position_y - The chicken's vertical position.
 * @param  {number} scale - Factor for chicken's image size.
 * @param  {number} extra_speed - Variable summand for extra speed.
 * @returns {Object} - Chicken enemy object.
 */
function createChicken(type, position_x, position_y, scale, extra_speed) {
    return {
        "type": type,
        "img": chickenImages[type][0],
        "position_x": position_x,
        "position_y": position_y,
        "scale": scale,
        "speed": MIN_CHICKEN_SPEED + Math.random() * 8 + extra_speed
    };
}

/**
 * Changes the position of every chicken enemy regularly depending on its individual speed.
 * Plays chickens sounds when chickens enter the visible canvas.
 */
 function calculateChickenPosition() {
    setInterval(function () {
        for (let i = 0; i < chickens.length; i++) {
            let chicken = chickens[i];
            chicken.position_x = chicken.position_x - chicken.speed;

            if (chicken.position_x > 0 && chicken.position_x < canvas.width) {
                if(chicken.type == "yellow") {
                    AUDIO_CHICKEN_CROWD.play();
                }
                if(chicken.type == "brown" && chicken.scale == 0.7) {
                    AUDIO_CHICKEN_SCREAM.play();
                }
                if(chicken.type == "brown" && chicken.scale !== 0.7) {
                    AUDIO_CHICKEN_SINGLE.play();
                }
            }
        }
    }, 50);
}

/**
 * Separates yellow and brown chickens in two different arrays.
 */
function calculateChickenImages() {
    
    let yellowChickens = [];
    let brownChickens = [];

    for (let i = 0; i < chickens.length; i++) {
        let chicken = chickens[i];
        if (chicken.type == 'yellow') {
            yellowChickens.push(chicken);
        }
        else if (chicken.type == 'brown') {
            brownChickens.push(chicken);
        }
    }

    calculateYellowChickenImages(yellowChickens);
    calculateBrownChickenImages(brownChickens);
}

/**
 * Iterates through yellow chicken's images depending on its speed.
 */
function calculateYellowChickenImages(yellowChickens) {

    for (let i = 0; i < yellowChickens.length; i++) {

        let chicken_yellow_image_index = 0;
        let yellowChicken = yellowChickens[i];
        let chickenSpeed = Math.round(1000 / yellowChicken.speed);

        setInterval(function() {
            let index = chicken_yellow_image_index % chickenImages.yellow.length;
            yellowChicken.img = chickenImages.yellow[index];
            chicken_yellow_image_index++;
        }, chickenSpeed)

    }
}

/**
 * Iterates through brown chicken's images depending on its speed.
 */
function calculateBrownChickenImages(brownChickens) {

    for (let i = 0; i < brownChickens.length; i++) {

        let chicken_brown_image_index = 0;
        let brownChicken = brownChickens[i];
        let chickenSpeed = Math.round(1000 / brownChicken.speed);

        setInterval(function() {
            let index = chicken_brown_image_index % chickenImages.brown.length;
            brownChicken.img = chickenImages.brown[index];
            chicken_brown_image_index++;
        }, chickenSpeed)
    }
    
}

/**
 * Draws all chicken enemy objects.
 */
function drawChicken() {
    for (let i = 0; i < chickens.length; i++) {
        let chicken = chickens[i];
        addObject(chicken.img, chicken.position_x, chicken.position_y, chicken.scale);
    }
}