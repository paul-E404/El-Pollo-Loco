function drawEnergyBar() {
    ctx.fillStyle = "rgba(224, 0, 82, 0.8)";
    ctx.fillRect(60, 37, 2 * character_energy, 20);

    ctx.fillStyle = "white"
    ctx.globalAlpha = 0.3;
    ctx.fillRect(55, 32, 210, 30);
    ctx.globalAlpha = 1;
}

function drawDisplay() {

    let heart = objectImages.display[0];
    let coin = objectImages.display[1];
    let bottle = objectImages.display[2];


    addObject(heart, 10, 0, 0.5);
    addObject(bottle, 280, 15, 0.4);

    ctx.font = "28px sans-serif";
    ctx.fillStyle = "brown";
    ctx.fillText("x " + collectedBottles, 330, 58);

    addObject(coin, 400, 15, 0.4);

}


function drawBottles() {
    for (let i = 0; i < placedBottles.length; i++) {
        let bottle_x = placedBottles[i];
        addObject(objectImages.bottles[1], bottle_x, 350, 0.25);
        //console.log(bottle_x);
    }
}


/**
 * Corrects the bottles' position when background is moving.
 * 
 * @param  {boolean} movingDirection - Moving direction of the character.
 */
function correctBottlesPosition(movingDirection) {
    if (movingDirection == isMovingRight) {
        for (let i = 0; i < placedBottles.length; i++) {
            placedBottles[i] = placedBottles[i] - GAME_SPEED;
        }
    }
    else if (movingDirection == isMovingLeft) {
        for (let i = 0; i < placedBottles.length; i++) {
            placedBottles[i] = placedBottles[i] + GAME_SPEED;
        }
    }
}


function drawThrownBottle() {
    timePassedSinceThrow = new Date().getTime() - lastThrowStarted;
    let gravity = Math.pow(9.81, timePassedSinceThrow / 200);

    throwBottle(timePassedSinceThrow, gravity);

}

function throwBottle(timePassedSinceThrow, gravity) {
    if (lastMove == "left") {
        thrown_bottle_x = 140 - (timePassedSinceThrow * 0.8);
        thrown_bottle_y = character_y + 140 - (timePassedSinceThrow * 0.5) + gravity;
        rotateBottle(thrown_bottle_x, thrown_bottle_y);
        if (timePassedSinceThrow < 100) {
            currentCharacterImage = characterImages.throw[0][0];
            AUDIO_BOTTLE_THROW.play();
        }
    }
    else if (lastMove == "right") {
        thrown_bottle_x = 140 + (timePassedSinceThrow * 0.8);
        thrown_bottle_y = character_y + 140 - (timePassedSinceThrow * 0.5) + gravity;
        rotateBottle(thrown_bottle_x, thrown_bottle_y);
        if (timePassedSinceThrow < 100) {
            currentCharacterImage = characterImages.throw[1][0];
            AUDIO_BOTTLE_THROW.play();
        }
    }
}

let counter = 0;

function rotateBottle(thrown_bottle_x, thrown_bottle_y) {
    let timePassedSinceThrow = new Date().getTime() - lastThrowStarted;
    if (timePassedSinceThrow <= THROW_TIME / 4) {
        let index = bottle_rotate_index % objectImages.bottles.length;
        addObject(objectImages.bottles[index], thrown_bottle_x, thrown_bottle_y, 0.25);
        bottle_rotate_index++;
        counter++;
        //console.log("thrown_bottle_x", thrown_bottle_x, "thrown_bottle_y", thrown_bottle_y);
        //console.log("character_y", character_y);
    }
    else {
        addObject(objectImages.bottles[1], thrown_bottle_x, thrown_bottle_y, 0.25);
    }
}


function drawBrokenBottle() {
    addObject(currentSauceImage, broken_bottle_x, broken_bottle_y, 0.25);
}


function animateBottleBreak() {

    AUDIO_BOTTLE_BREAK.play();

    for (let i = 0; i < objectImages.sauce.length; i++) {
        setTimeout(function () {
            currentSauceImage = objectImages.sauce[i];
        }, BOTTLE_BREAK_TIME / (objectImages.sauce.length + 2) * (i + 1));
    }

    //Finish animation: sauce disappears
    setTimeout(function () {
        currentSauceImage = new Image();
    }, BOTTLE_BREAK_TIME / (objectImages.sauce.length + 2) * (objectImages.sauce.length + 1));

}
