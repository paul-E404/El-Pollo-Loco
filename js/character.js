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
 * Calculation with modulo makes iteration from 0 to the length of the array possible.
 * 
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
        let timeForRelax = timePassedSinceLastMove > JUMP_TIME * 2 && timePassedSinceLastMove < JUMP_TIME * 15;
        let timeForSleep = timePassedSinceLastMove > JUMP_TIME * 15;

        if (gameLost != true) {
            if (isMovingLeft == false && isMovingRight == false) {
                if (timeForRelax == true) {
                    checkRelaxingDirection();
                }
                else if (timeForSleep == true) {
                    AUDIO_CHARACTER_SNORING.play();
                    checkSleepingDirection();
                }
            }
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
 * Calculation with modulo makes iteration from 0 to the length of the array possible.
 * 
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
 * Calculation with modulo makes iteration from 0 to the length of the array possible.
 * 
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
    let currentTime = new Date().getTime();
    timePassedSinceJump = currentTime - lastJumpStarted;
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
 * Checks if character is currently colliding with objects or enemies.
 */
function checkForCollision() {

    //when character is dying he must no longer collide
    if (characterDead != true) {
        setInterval(function () {

            //calculate character's image axis
            let character_image_width = 100;
            let character_image_width_half = character_image_width / 2;
            let character_axis = character_x + character_image_width_half;

            //Collision of character with chicken
            characterChickenCollision(character_image_width_half, character_axis);
           
            //Collision of character with bottles (collection)
            characterBottleCollision(character_image_width_half, character_axis);
           
            //Collision of character with boss
            characterBossCollision(character_axis);

        }, 100);
    }

}

/**
 * Calculates collision and its effects between character and chicken (yellow and brown).
 * 
 * @param  {number} character_image_width_half - Half width of character's image.
 * @param  {number} character_axis - Vertical middle of character's image.
 */
function characterChickenCollision(character_image_width_half, character_axis) {

    for (let i = 0; i < chickens.length; i++) {
        let chicken = chickens[i];
        if (chicken.position_x < (character_axis + character_image_width_half) && chicken.position_x > (character_axis - character_image_width_half)) {
            if (character_y > 0 && character_y < 800) {
                checkCollisionDirection();
                //Prevent character from falling asleep
                lastMoveFinished = new Date().getTime();
                AUDIO_CHARACTER_SNORING.pause();
                //biggest and most dangerous crying brown chicken in town
                if(chicken.type == "brown" && chicken.scale == 0.7) {
                    //collision with that monster reduces extra energy
                    character_energy = character_energy - 20;
                    reduceCharacterEnergy();
                }
                reduceCharacterEnergy();
            }
        }
    }
}

/**
 * Calculates collision and its effects between character and placed bottles.
 * 
 * @param  {number} character_image_width_half - Half width of character's image.
 * @param  {number} character_axis - Vertical middle of character's image.
 */
function characterBottleCollision(character_image_width_half, character_axis) {
    for (let i = 0; i < placedBottles.length; i++) {
        if (placedBottles[i] < (character_axis + character_image_width_half / 3) && placedBottles[i] > (character_axis - character_image_width_half)) {
            if (character_y > -40) {
                placedBottles.splice(i, 1);
                collectedBottles++;
                AUDIO_BOTTLE_COLLECT.play();
            }
        }
    }
}

/**
 * Calculates collision and its effects between character and boss.
 * 
 * @param  {number} character_axis - Vertical middle of character's image.
 */
function characterBossCollision(character_axis) {
    let boss_image_width = 285;
    let boss_image_width_half = boss_image_width / 2;
    let boss_axis = boss_x + boss_image_width_half;

    let timePassed = new Date().getTime() - timeWhenBossReached;

    if (timePassed > BOSS_INTRO_PLAYING_TIME) {
        if (character_axis < (boss_axis + boss_image_width_half) && character_axis > (boss_axis - boss_image_width_half)) {
            if (boss_y > 0 && boss_y < 800 && character_y > 0 && character_y < 500) {
                checkCollisionDirection();
                //Prevent character from falling sleep
                lastMoveFinished = new Date().getTime();
                AUDIO_CHARACTER_SNORING.pause();
                reduceCharacterEnergy();
            }
        }
    }
}

/**
 * Checks character's last move direction in order to show the correct hurt images.
 */
function checkCollisionDirection() {
    if (lastMove == "right") {
        let currentImages = characterImages.hurt[1];
        showCollisionImages(currentImages);
    }
    else {
        let currentImages = characterImages.hurt[0];
        showCollisionImages(currentImages);
    }
}

/**
 * Shows character's hurt images when he is colliding with an enemy.
 * 
 * @param  {Object} currentImages - Hurt images with right or left direction.
 */
function showCollisionImages(currentImages) {
    let index = character_hurt_index % currentImages.length;
    currentCharacterImage = currentImages[index];
    character_hurt_index++;
    //a dead character can no longer scream when hit
    if (characterDead != true) {
        AUDIO_CHARACTER_HURT.play();
    }
}

/**
 * Regulates character's loss of energy and its effects.
 */
function reduceCharacterEnergy() {

    //prevents the dying animation from being shown more than once
    if (characterDead == false) {

        //character is alive and can loose energy
        if (character_energy > 0) {
            character_energy = character_energy - 5;
        }

        //character dies
        if (character_energy <= 0) {
            characterDyingStarted = new Date().getTime();
            characterDead = true;
            checkDyingDirection();
            lastJumpStarted = new Date().getTime();
            collectedBottles = 0;
            gameLost = true;
            finishGameLost();
        }
    }
}

/**
 * Checks regularly if the character is currently dead.
 */
function checkForDying() {
    setInterval(function () {
        if (characterDead == true) {
            AUDIO_CHARACTER_DEAD.play();
            calculateDyingPosition();
        }
    }, 50);
}


/**
 * Regulates vertical position of character when he is dying, including gravity.
 */
function calculateDyingPosition() {

    let timePassed = new Date().getTime() - characterDyingStarted;
    let gravity = Math.pow(9.81, (timePassed * 0.5) / 200);

    character_y = character_y - 10 + gravity;

    if (character_y > 800) {
        characterDead = false;
    }

}

/**
 * Checks character's last move direction in order to show the correct dying images.
 */
function checkDyingDirection() {

    let currentImages;

    if (lastMove == 'left') {
        currentImages = characterImages.dead[0];
    }
    else if (lastMove == 'right') {
        currentImages = characterImages.dead[1];
    }

    showDyingImages(currentImages);

}

/**
 * Animates character's death.
 * 
 * @param  {Object} currentImages - Dying images with right or left direction.
 */
function showDyingImages(currentImages) {

    setTimeout(function () {
        currentCharacterImage = currentImages[0];
    }, CHARACTER_DYING_TIME / (currentImages.length * 10) * 1);
    setTimeout(function () {
        currentCharacterImage = currentImages[1];
    }, CHARACTER_DYING_TIME / (currentImages.length * 10) * 20);
    setTimeout(function () {
        currentCharacterImage = currentImages[2];
    }, CHARACTER_DYING_TIME / (currentImages.length * 10) * 40);
    setTimeout(function () {
        currentCharacterImage = currentImages[3];
    }, CHARACTER_DYING_TIME / (currentImages.length * 10) * 50);
    setTimeout(function () {
        currentCharacterImage = currentImages[4];
    }, CHARACTER_DYING_TIME / (currentImages.length * 10) * 60);

}