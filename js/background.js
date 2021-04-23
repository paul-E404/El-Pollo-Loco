/**
 * Draws and changes the current background including sky and ground.
 * This is important to make the character seem moving.
 */
function drawBackground() {

    //clouds always move, independent of the character's movement.
    cloud_offset = cloud_offset + CLOUD_SPEED;

    //Defines start and end of the area in which the character is able to move.
    let wallLeft = bg1_ground_x >= bg_ground_x_min;
    bg_ground_x_max = (PLAYING_FIELD_LENGTH - 3) * (-1000);
    wallRight = bg1_ground_x <= bg_ground_x_max;

    //when character reaches the end of the game the background should stop moving
    if (wallRight == true && bossMusicStarted == false) {
        enterBossArea();
    }

    //Different background layers move at different speeds and in different directions depending on the character's moving direction.
    if (isMovingRight == true && wallRight == false && reachedBoss == false && gameLost == false) {
        moveBackgroundToTheLeft();
    }

    //within boss area, the character changes his horizontal position - not the background any more
    else if (isMovingRight == true && reachedBoss == true && character_x < 660) {
        character_x = character_x + GAME_SPEED;
    }

    //Different background layers move at different speeds and in different directions depending on the character's moving direction.
    if (isMovingLeft == true && wallLeft == false && reachedBoss == false && gameLost == false) {
        moveBackgroundToTheRight();
    }

    //within boss area, the character changes his horizontal position - not the background any more
    else if (isMovingLeft == true && reachedBoss == true && character_x > -25) {
        character_x = character_x - GAME_SPEED;
    }

    drawSky();
    drawGround();
}

/**
 * Changes all variables regarding boss area as soon as character enters.
 */
function enterBossArea() {
    bossMusicStarted = true;
    reachedBoss = true;
    timeWhenBossReached = new Date().getTime();
    AUDIO_MEXICAN_SONG.pause();
    startBossMusic();
    document.getElementById('game-info-text').innerHTML = 'Trow bottles by pressing D!';
}

/**
 * Moves background images to the left.
 */
function moveBackgroundToTheLeft() {
    bg3_ground_x = bg3_ground_x - GAME_SPEED * 0.2;
    bg2_ground_x = bg2_ground_x - GAME_SPEED * 0.4;
    bg1_ground_x = bg1_ground_x - GAME_SPEED;

    correctChickenPosition(isMovingRight);
    correctBottlesPosition(isMovingRight);

    bg_sky_x = bg_sky_x - GAME_SPEED * 0.1;
}

/**
 * Moves background images to the left.
 */
function moveBackgroundToTheRight() {
    bg3_ground_x = bg3_ground_x + GAME_SPEED * 0.2;
    bg2_ground_x = bg2_ground_x + GAME_SPEED * 0.4;
    bg1_ground_x = bg1_ground_x + GAME_SPEED;

    correctChickenPosition(isMovingLeft);
    correctBottlesPosition(isMovingLeft);

    bg_sky_x = bg_sky_x + GAME_SPEED * 0.1;
}

/**
 * Draws sky and clouds.
 */
function drawSky() {
    for (let i = 0; i < PLAYING_FIELD_LENGTH; i++) {
        if (reachedBoss == false || gameWon == true) {
            addBackgroundImage(backgroundImages.sky[0], bg_sky_x, bg_element_y, i);
        }
        //when boss area is reached sunny sky changes to stormy sky
        else if (reachedBoss == true) {
            addBackgroundImage(backgroundImages.sky[3], 0, 0, i);
        }
    }
    //chlouds
    for (let i = 0; i < PLAYING_FIELD_LENGTH; i = i + 2) {
        addBackgroundImage(backgroundImages.sky[1], bg_sky_x - cloud_offset, bg_element_y, i);
        addBackgroundImage(backgroundImages.sky[2], bg_sky_x - cloud_offset, bg_element_y, i + 1);
    }
}

/**
 * Draws the three ground layers.
 */
function drawGround() {
    //back layer
    for (let i = 0; i < PLAYING_FIELD_LENGTH; i = i + 2) {
        addBackgroundImage(backgroundImages.ground[0], bg3_ground_x, bg_element_y, i);
        addBackgroundImage(backgroundImages.ground[1], bg3_ground_x, bg_element_y, i + 1);
    }
    //middle layer
    for (let i = 0; i < PLAYING_FIELD_LENGTH; i = i + 2) {
        addBackgroundImage(backgroundImages.ground[2], bg2_ground_x, bg_element_y, i);
        addBackgroundImage(backgroundImages.ground[3], bg2_ground_x, bg_element_y, i + 1);
    }
    //front layer
    for (let i = 0; i < PLAYING_FIELD_LENGTH; i = i + 2) {
        addBackgroundImage(backgroundImages.ground[4], bg1_ground_x, bg_element_y, i);
        addBackgroundImage(backgroundImages.ground[5], bg1_ground_x, bg_element_y, i + 1);
    }
}

/* 
* Draws a background image.
*/
function addBackgroundImage(image, bg_element_x, bg_element_y, scale) {
    if (image.complete) {
        ctx.drawImage(image, bg_element_x + canvas.width * scale, bg_element_y, canvas.width, canvas.height);
    }
}