/**
 * Draws and changes the current background including sky and ground.
 * This is important to make the character seem moving.
 */
 function drawBackground() {

    //clouds always move, independent of the character's movement.
    cloud_offset = cloud_offset + CLOUD_SPEED;

    //Defines start and end of the area in which the character is able to move.
    let wallLeft = bg1_ground_x >= bg_ground_x_min;
    let wallRight; //follows...

    //Different background layers move at different speeds and in different directions depending on the character's movement.
    if (isMovingRight == true) {
        bg3_ground_x = bg3_ground_x - GAME_SPEED * 0.2;
        bg2_ground_x = bg2_ground_x - GAME_SPEED * 0.4;
        bg1_ground_x = bg1_ground_x - GAME_SPEED;
        correctChickenPosition(isMovingRight);
        bg_sky_x = bg_sky_x - GAME_SPEED * 0.1;
    }
    if (isMovingLeft == true && wallLeft == false) {
        bg3_ground_x = bg3_ground_x + GAME_SPEED * 0.2;
        bg2_ground_x = bg2_ground_x + GAME_SPEED * 0.4;
        bg1_ground_x = bg1_ground_x + GAME_SPEED;
        correctChickenPosition(isMovingLeft);
        bg_sky_x = bg_sky_x + GAME_SPEED * 0.1;
    }
    drawSky();
    drawGround();
}