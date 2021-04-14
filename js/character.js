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

        /* if(characterDead == false) { */
        if (isMovingLeft == false && isMovingRight == false) {
            if (timeForRelax == true) {
                checkRelaxingDirection();
            }
            else if (timeForSleep == true) {
                AUDIO_CHARACTER_SNORING.play();
                checkSleepingDirection();
            }
        }
        /* } */

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
        ctx.drawImage(character_image, character_x, character_y, character_image.width * 0.30, character_image.height * 0.30);
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
    else if (character_y < 100 && characterDead == false) {
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
    let character_image_width = 100;
    let character_image_width_half = character_image_width / 2;
    let character_axis = character_x + character_image_width_half;

    //when character is dying he must no longer collide
    if(characterDead != true) {
        setInterval(function () {

            //Collision of character with chicken
            for (let i = 0; i < chickens.length; i++) {
                let chicken = chickens[i];
                if (chicken.position_x < (character_axis + character_image_width_half) && chicken.position_x > (character_axis - character_image_width_half)) {
                    if (character_y > 0) {
                        checkCollisionDirection();
                        //Prevent character from falling sleep
                        lastMoveFinished = new Date().getTime();
                        AUDIO_CHARACTER_SNORING.pause();
                        reduceCharacterEnergy();
                    }
    
                }
            }
    
            //Collision of character with bottles (collection)
            for (let i = 0; i < placedBottles.length; i++) {
                if (placedBottles[i] < (character_axis + character_image_width_half / 3) && placedBottles[i] > (character_axis - character_image_width_half)) {
                    if (character_y > -40) {
                        placedBottles.splice(i, 1);
                        collectedBottles++;
                        AUDIO_BOTTLE_COLLECT.play();
                    }
                }
            }
    
            //Collision of character with boss
            //follows...
    
        }, 100);
    }
    
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
    if (character_energy >= 10) {
        character_energy = character_energy - 5;
    } else if (character_energy > 0) {
        character_energy = character_energy - 5;
        characterDyingStarted = new Date().getTime();
        characterDead = true;

        checkDyingDirection();

        console.log("Game Over!");
    }

}




function checkForDying() {
    setInterval(function () {
        if (characterDead == true) {
            characterDying();
        }
    }, 50);
}

function characterDying() {
    /* console.log("characterDying() wurde aufgerufen!"); */

    let timePassed = new Date().getTime() - characterDyingStarted;
    let gravity = Math.pow(9.81, (timePassed * 0.5) / 200);

    //regulate vertical character position
    character_y = character_y - 20 + gravity;

}


function checkDyingDirection() {
    let currentImages;
    if (lastMove == 'left') {
        currentImages = characterImages.dead[0];
    }
    else if (lastMove == 'right') {
        currentImages = characterImages.dead[1];
    }
    // console.log("checkDyingDirection aufgerufen! currentImages: ", currentImages);
    showDyingImages(currentImages);
    // console.log("currentImages.length", currentImages.length);

}


function showDyingImages(currentImages) {
  
    console.log("showDyingImages() wurde aufgerufen!", currentImages);


    /*     setTimeout(function () {
            currentCharacterImage = currentImages[0];
            console.log("Erstes Interval");
            console.log("currentCharacterImage", currentCharacterImage);
        }, 100);
        setTimeout(function () {
            currentCharacterImage = currentImages[1];
            console.log("Zweites Interval");
            console.log("currentCharacterImage", currentCharacterImage);
        }, 300);
        setTimeout(function () {
            currentCharacterImage = currentImages[2];
            console.log("Drittes Interval");
            console.log("currentCharacterImage", currentCharacterImage);
        }, 500);
        setTimeout(function () {
            currentCharacterImage = currentImages[3];
            console.log("Viertes Interval");
            console.log("currentCharacterImage", currentCharacterImage);
        }, 700);
        setTimeout(function () {
            currentCharacterImage = currentImages[4];
            console.log("Fünftes Interval");
            console.log("currentCharacterImage", currentCharacterImage);
        }, 900);
        setTimeout(function () {
            currentCharacterImage = currentImages[5];
            console.log("Sechstes Interval");
            console.log("currentCharacterImage", currentCharacterImage);
        }, 1000);
        setTimeout(function () {
            currentCharacterImage = currentImages[6];
            console.log("Siebtes Interval");
            console.log("currentCharacterImage", currentCharacterImage);
        }, 1100); */


    setTimeout(function () {
        currentCharacterImage = currentImages[2];
    }, CHARACTER_DYING_TIME / (currentImages.length * 10) * 1);
    setTimeout(function () {
        currentCharacterImage = currentImages[2];
    }, CHARACTER_DYING_TIME / (currentImages.length * 10) * 20);
    setTimeout(function () {
        currentCharacterImage = currentImages[2];
    }, CHARACTER_DYING_TIME / (currentImages.length * 10) * 40);
    setTimeout(function () {
        currentCharacterImage = currentImages[3];
    }, CHARACTER_DYING_TIME / (currentImages.length * 10) * 45);
    setTimeout(function () {
        currentCharacterImage = currentImages[4];
    }, CHARACTER_DYING_TIME / (currentImages.length * 10) * 50);
    setTimeout(function () {
        currentCharacterImage = currentImages[5];
    }, CHARACTER_DYING_TIME / (currentImages.length * 10) * 55);

}