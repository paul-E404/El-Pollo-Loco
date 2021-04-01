/**
 * Checks if the character is currently running to the right or to the left in order to prepair the correct images and sounds.
 */
function checkForRunning() {
    setInterval(function () {
        if (isMovingRight == true) {
            let currentImages = characterImages.walk[1];
            showRunningImages(currentImages);
            AUDIO_CHARACTER_RUNNING.play();
            AUDIO_CHARACTER_SNORING.pause();
        }
        else if (isMovingLeft == true) {
            let currentImages = characterImages.walk[0];
            showRunningImages(currentImages);
            AUDIO_CHARACTER_RUNNING.play();
            AUDIO_CHARACTER_SNORING.pause();
        }
        else if (isMovingRight == false && isMovingLeft == false) {
            AUDIO_CHARACTER_RUNNING.pause();
        }
    }, 100);
}


/**
 * Iterates through the array with the running images.
 * Calculation with modulo makes iteration from 0 to the length of the array possible
 * @param  {Object} currentImages - Running images with right or left animation.
 */
function showRunningImages(currentImages) {
    //if(timePassedSinceJump > JUMP_TIME * 2) => no running animation while jumping!
    if (timePassedSinceJump > JUMP_TIME * 2) {
        let index = character_walk_index % currentImages.length;
        currentCharacterImage = currentImages[index];
        //counter increase for next picture
        character_walk_index++;
    }
}


/**
 * Checks regularly if enough time has passed for the animation of relax images or even sleep images.
 */
function checkForRelaxing() {

    setInterval(function () {

        let currentTime = new Date().getTime();
        let timePassedSinceLastMove = currentTime - lastMoveFinished;
        let timeForRelax = timePassedSinceLastMove > JUMP_TIME * 2 && timePassedSinceLastMove < JUMP_TIME * 20;
        let timeForSleep = timePassedSinceLastMove > JUMP_TIME * 20;

        if (isMovingLeft == false && isMovingRight == false) {
            if (timeForRelax == true) {
                checkRelaxingDirection();
            }
            else if (timeForSleep == true) {
                AUDIO_CHARACTER_SNORING.play();
                checkSleepingDirection();
            }
            /* else if (timeForSleep == false) {
                AUDIO_CHARACTER_SNORING.pause();
            } */
        }
    }, 300);
}


/**
 * Decides which relax images are needed (right or left) depending on the direction of last move.
 */
function checkRelaxingDirection() {
    if (lastMove == "right") {
        let currentImages = characterImages.idle[1];
        relax(currentImages);
    }
    else {
        let currentImages = characterImages.idle[0];
        relax(currentImages);
    }
}


/**
 * Iterates through the array with the relax images.
 * Calculation with modulo makes iteration from 0 to the length of the array possible
 * @param  {Object} currentImages - Relaxing images with right or left animation.
 */
function relax(currentImages) {
    let index = character_idle_index % currentImages.length;
    currentCharacterImage = currentImages[index];
    character_idle_index++;
}


/**
 * Decides which sleep images are needed (right or left) depending on the direction of last move.
 */
function checkSleepingDirection() {
    if (lastMove == "right") {
        let currentImages = characterImages.sleep[1];
        sleep(currentImages);
    }
    else {
        let currentImages = characterImages.sleep[0];
        sleep(currentImages);
    }
}


/**
 * Iterates through the array with the sleep images.
 * Calculation with modulo makes iteration from 0 to the length of the array possible
 * @param  {Object} currentImages - Sleeping images with right or left animation.
 */
function sleep(currentImages) {
    let index = character_idle_index % currentImages.length;
    currentCharacterImage = currentImages[index];
    character_idle_index++;
}


/**
 * Draws the current character image.
 */
function updateCharacter() {

    let character_image = currentCharacterImage;

    checkCharacterJumpHeight();

    //character_image.complete: returns true if image has finished loading
    if (character_image.complete) {
        ctx.drawImage(character_image, character_x, character_y, character_image.width * 0.35, character_image.height * 0.35);
    }
}


/**
 * Regulates if the character goes up or down.
 */
function checkCharacterJumpHeight() {
    timePassedSinceJump = new Date().getTime() - lastJumpStarted;
    //Check rising of the character
    if (timePassedSinceJump < JUMP_TIME) {
        character_y = character_y - 10;
    }
    //Check falling
    else if (character_y < 45) {
        character_y = character_y + 10;
    }
}


/**
 * Decides which jump images are needed (right or left) depending on the direction of last move.
 */
function checkJumpDirection() {
    if (lastMove == "right") {
        let currentImages = characterImages.jump[1];
        animateJump(currentImages);
    }
    else {
        let currentImages = characterImages.jump[0];
        animateJump(currentImages);
    }
}


/**
 * Iterates through the jump images during the time of one full jump.
 * @param  {Object} currentImages - Jump images with right or left animation.
 */
function animateJump(currentImages) {
    setTimeout(function () {
        currentCharacterImage = currentImages[0];
    }, JUMP_TIME * 2 / (currentImages.length * 10) * 1);
    setTimeout(function () {
        currentCharacterImage = currentImages[1];
    }, JUMP_TIME * 2 / (currentImages.length * 10) * 5);
    setTimeout(function () {
        currentCharacterImage = currentImages[2];
    }, JUMP_TIME * 2 / (currentImages.length * 10) * 25);
}


/**
 * 
 */
function checkForCollision() {
    let character_image_width = 140;
    let character_image_width_half = character_image_width / 2;
    let character_axis = character_x + character_image_width_half;
    let collisionCounter = 0;
    setInterval(function () {

        //Collision with chicken
        for (let i = 0; i < chickens.length; i++) {
            let chicken = chickens[i];
            if (chicken.position_x < (character_axis + character_image_width_half) && chicken.position_x > (character_axis - character_image_width_half)) {
                if (character_y > -75) {
                    console.log("KOLLISION! Nr. ", collisionCounter);
                    checkCollisionDirection();
                    //Prevent character from falling sleep
                    lastMoveFinished = new Date().getTime();
                    AUDIO_CHARACTER_SNORING.pause();
                    collisionCounter++;
                    reduceCharacterEnergy();
                }

            }
        }

        //Collision with bottles (collection)
        for (let i = 0; i < placedBottles.length; i++) {
            if (placedBottles[i] < (character_axis + character_image_width_half/3) && placedBottles[i] > (character_axis - character_image_width_half)) {
                if (character_y > -40) {
                    placedBottles.splice(i, 1);
                    collectedBottles++;
                    AUDIO_BOTTLE_COLLECT.play();
                }
            }
        }

    }, 100);
}


function checkCollisionDirection() {
    if (lastMove == "right") {
        let currentImages = characterImages.hurt[1];
        collision(currentImages);
    }
    else {
        let currentImages = characterImages.hurt[0];
        collision(currentImages);
    }
}

function collision(currentImages) {
    let index = character_hurt_index % currentImages.length;
    currentCharacterImage = currentImages[index];
    character_hurt_index++;
    AUDIO_CHARACTER_HURT.play();
}


function reduceCharacterEnergy() {
    if (character_energy >= 5) {
        character_energy = character_energy - 5;
    } else {
        console.log("Game Over!");
    }

}