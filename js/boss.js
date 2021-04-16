/**
 * Draws the current boss images.
 */
function updateBoss() {

    let boss_image = currentBossImage;

    if (boss_image.complete) {
        ctx.drawImage(boss_image, boss_x, boss_y, boss_image.width * 0.30, boss_image.height * 0.30);
    }
    drawBossEnergy();
}

/**
 * Draws boss energy bar.
 */
function drawBossEnergy() {
    ctx.fillStyle = "rgba(255, 80, 0, 0.8)";
    ctx.fillRect(boss_x + 60, boss_y, 2 * boss_energy, 20);

    ctx.fillStyle = "yellow"
    ctx.globalAlpha = 0.3;
    ctx.fillRect(boss_x + 55, boss_y - 5, 210, 30);
    ctx.globalAlpha = 1;

    let boss_icon = objectImages.display[3];
    addObject(boss_icon, boss_x + 10, boss_y - 25, 0.45);
}


//Variable for clearing the setInterval(). Otherwise you cannot change the bossSpeed variable.
let timer;

/**
 * Regulates boss action depending on its physical status.
 */
function checkForBossAction() {

    timer = setInterval(function () {

        let currentTime = new Date().getTime();
        let timePassedSinceLastHit = currentTime - lastHitStarted;

        if (timePassedSinceLastHit > BOSS_HIT_TIME) {

            //Graphics change from walking to attacking as soon as the boss has been hit for the first time.
            if (firstBossHit == true) {
                bossAttack();
            }
            else if (bossAlmostDead == true) {
                bossAttackFinal();
            }
            else if (bossDead == true) {
                AUDIO_BOSS_MUSIC.pause();
                bossDying();
                gameWon = true;
            }
            else if (bossWalk == true) {
                bossWalking();
            }
        }
    }, bossSpeed);

}


/**
 * Animates angry boss as soon as it has been hit for the first time.
 */
function bossAttack() {

    console.log("bossAttack() wird ausgeführt");
    //clear old setInterval() with old boss speed
    clearInterval(timer);
    //increase boss speed
    bossSpeed = 250;
    //start new interval
    checkForBossAction();

    let index = boss_attack_index % bossImages.attack[0].length;

    bossAttackLeft(index);
    bossAttackRight(index);
    bossMovingUpAndDown(index);

    boss_attack_index++;
}


/**
 * Animates angry boss as soon as it has been hit for the first time (left route).
 * 
 * @param  {number} index - Index of current bossImages array.
 */
function bossAttackLeft(index) {
    if (boss_x >= 430 && bossMovingLeft == true) {
        currentBossImage = bossImages.attack[0][index];
        boss_x = boss_x - 10;
        if (boss_x <= 430) {
            bossMovingLeft = false;
            bossMovingRight = true;
        }
    }
}


/**
 * Animates angry boss as soon as it has been hit for the first time (right route).
 * 
 * @param  {number} index - Index of current bossImages array.
 */
function bossAttackRight(index) {
    if (boss_x <= 540 && bossMovingRight == true) {
        currentBossImage = bossImages.attack[1][index];
        boss_x = boss_x + 10;
        if (boss_x >= 540) {
            bossMovingLeft = true;
            bossMovingRight = false;
        }
    }
}


/**
 * Let the boss move up and down alternately.
 * 
 * @param  {number} index - Index of current bossImages array.
 */
function bossMovingUpAndDown(index) {
    if (index % 2 == 0) {
        boss_y = boss_y + 5;
    }
    else {
        boss_y = boss_y - 5;
    }
}


/**
 * Changes boss animation from angry to totally angry as soon as it has been hit for several times.
 */
function bossAttackFinal() {

    console.log("bossAttackFinal() wird ausgeführt");
    //clear old setInterval() with old boss speed
    clearInterval(timer);
    //increase boss speed
    bossSpeed = 100;
    //start new interval
    checkForBossAction();

    let index = boss_angry_index % bossImages.angry[0].length;

    bossAttackFinalLeft(index);
    bossAttackFinalRight(index);
    bossMovingUpAndDown(index);

    boss_angry_index++;
}


/**
 * Animates totally angry boss (left route).
 * 
 * @param  {number} index - Index of current bossImages array.
 */
function bossAttackFinalLeft(index) {
    if (boss_x >= 280 && bossMovingLeft == true) {
        currentBossImage = bossImages.angry[0][index];
        boss_x = boss_x - 20;
        if (boss_x <= 280) {
            bossMovingLeft = false;
            bossMovingRight = true;
        }
    }
}


/**
 * Animates totally angry boss (right route).
 * 
 * @param  {number} index - Index of current bossImages array.
 */
function bossAttackFinalRight(index) {
    if (boss_x <= 540 && bossMovingRight == true) {
        currentBossImage = bossImages.angry[1][index];
        boss_x = boss_x + 20;
        if (boss_x >= 540) {
            bossMovingLeft = true;
            bossMovingRight = false;
        }
    }
}


/**
 * Regulates boss dying animation (position and images).
 */
function bossDying() {

    //clear old setInterval() with old boss speed
    clearInterval(timer);
    //increase boss speed
    bossSpeed = 50;
    //start new interval
    checkForBossAction();

    let timePassed = new Date().getTime() - bossDyingStarted;
    let gravity = Math.pow(9.81, (timePassed * 0.5) / 500);

    //regulate vertical boss position
    boss_y = boss_y - 25 + gravity;

    checkBossDyingDirection();
}


/**
 * Chooses the correct images depending on the boss last move (left or right).
 */
function checkBossDyingDirection() {
    if (bossMovingLeft == true) {
        currentImages = bossImages.dead[0];
    }
    else if (bossMovingRight == true) {
        currentImages = bossImages.dead[1];
    }
    showBossDyingImages(currentImages);
}


/**
 * Shows the correct boss dead dying images.
 * 
 * @param  {Object} currentImages - Boss dying images with right or left direction.
 */
function showBossDyingImages(currentImages) {

    //boss falling up
    if (bossFallingUp == true) {
        if (boss_y > 80) {
            currentBossImage = currentImages[0];
        }
        if (boss_y <= 80 && boss_y > 40) {
            currentBossImage = currentImages[1];
        }
        if (boss_y <= 40) {
            bossFallingUp = false;
        }
    }

    //boss falling down
    if (bossFallingUp == false) {
        currentBossImage = currentImages[2];
        //stop bossDying() function
        if (boss_y >= 800) {
            bossDead = false;
        }
    }
}



/**
 * Animates dafault boss movements.
 */
function bossWalking() {

    let index = boss_walk_index % bossImages.walk[0].length;

    bossWalkingLeft(index);
    bossWalkingRight(index);
    bossMovingUpAndDown(index);

    boss_walk_index++;
}


/**
 * Animates dafault boss movements (left route).
 * 
 * @param  {number} index - Index of current bossImages array.
 */
function bossWalkingLeft(index) {
    if (boss_x >= 485 && bossMovingLeft == true) {
        currentBossImage = bossImages.walk[0][index];
        boss_x = boss_x - 5;
        if (boss_x < 485) {
            bossMovingLeft = false;
            bossMovingRight = true;
        }
    }
}


/**
 * Animates dafault boss movements (right route).
 * 
 * @param  {number} index - Index of current bossImages array.
 */
function bossWalkingRight(index) {
    if (boss_x <= 515 && bossMovingRight == true) {
        currentBossImage = bossImages.walk[1][index];
        boss_x = boss_x + 5;
        if (boss_x == 520) {
            bossMovingLeft = true;
            bossMovingRight = false;
        }
    }
}


/**
 * Checks axial collision of thrown bottle with boss.
 */
function checkForThrownBottleHit() {

    setInterval(function () {

        //first step: calculate axes of boss and thrown bottle images for a central collision.

        let boss_image_width = 285;
        let boss_image_width_half = boss_image_width / 2;
        let boss_x_axis = boss_x + boss_image_width_half;

        let boss_image_height = 275;
        let boss_image_height_half = boss_image_height / 2;
        let boss_y_axis = boss_y + boss_image_height_half;

        let thrown_bottle_image_width = 20;
        let thrown_bottle_image_width_half = thrown_bottle_image_width / 2;
        let thrown_bottle_x_axis = thrown_bottle_x + thrown_bottle_image_width_half;

        let thrown_bottle_image_height = 72;
        let thrown_bottle_image_height_half = thrown_bottle_image_height / 2;
        let thrown_bottle_y_axis = thrown_bottle_y + thrown_bottle_image_height_half;

        let timePassed = new Date().getTime() - timeWhenBossReached;

        if (reachedBoss == true && timePassed > BOSS_INTRO_PLAYING_TIME) {
            //second step: make sure that boss is not already dying
            let timePassed = new Date().getTime() - bossDyingStarted;
            if (timePassed > BOSS_DYING_TIME) {
                //let counter = 0;
                //third step: check for axial collision
                if (thrown_bottle_x_axis < (boss_x_axis + boss_image_width_half) && thrown_bottle_x_axis > (boss_x_axis - boss_image_width_half)) {
                    if (thrown_bottle_y_axis < (boss_y_axis + boss_image_height_half) && thrown_bottle_y_axis > (boss_y_axis - boss_image_height_half / 2)) {
                        //counter++;
                        //console.log("Treffer! Nr.: ", counter);
                        reduceBossEnergy();
                        lastHitStarted = new Date().getTime();
                        broken_bottle_x = thrown_bottle_x;
                        broken_bottle_y = thrown_bottle_y;
                        animateBottleBreak();
                        checkBossHitDirection();
                    }
                }
            }
        }


    }, 50);
}


/**
 * Reduces boss energy bar and accordingly changes boss status for checkForBossAction() function.
 */
function reduceBossEnergy() {

    if (boss_energy >= 10) {
        boss_energy = boss_energy - 10;
    }
    if (boss_energy < 100 && boss_energy > 40) {
        AUDIO_BOSS_HIT.play();
        bossWalk = false;
        firstBossHit = true;
    }
    if (boss_energy <= 40 && boss_energy > 0) {
        AUDIO_BOSS_HIT.pause();
        AUDIO_BOSS_ANGRY.play();

        firstBossHit = false;
        bossAlmostDead = true;
    }
    else if (boss_energy == 0) {
        AUDIO_BOSS_ANGRY.pause();
        bossDead = true;
        bossAlmostDead = false;
        bossDyingStarted = new Date().getTime();
        finishLevel();
    }
}


/**
 * Checks boss current direction when hit in order to show the correct images.
 */
function checkBossHitDirection() {
    currentTime = new Date().getTime();
    let timePassedSinceLastHit = currentTime - lastHitStarted;

    if (timePassedSinceLastHit <= BOSS_HIT_TIME) {
        if (bossMovingRight == true) {
            currentImages = bossImages.hurt[1];
            animateBossHit(currentImages);
        }
        else if (bossMovingLeft == true) {
            currentImages = bossImages.hurt[0];
            animateBossHit(currentImages);
        }
    }

}


/**
 * Animates boss when hit.
 * 
 * @param  {Object} currentImages - Boss hurt images with right or left direction.
 */
function animateBossHit(currentImages) {
    /*  let index = 0;
    for (let i = 1; i < 60; i = i + 10) {
        console.log("aktuelles i: ", i);
        setTimeout(function () {
         currentBossImage = currentImages[index];
     }, BOSS_HIT_TIME / (currentImages.length * 30) * i);
     if(index == 0) {
         index = 1;
     } else if (index == 1) {
         index = 0;
     }
     console.log("index", index);
    } */

    setTimeout(function () {
        currentBossImage = currentImages[0];
    }, BOSS_HIT_TIME / (currentImages.length * 30) * 1);
    setTimeout(function () {
        currentBossImage = currentImages[1];
    }, BOSS_HIT_TIME / (currentImages.length * 30) * 11);
    setTimeout(function () {
        currentBossImage = currentImages[0];
    }, BOSS_HIT_TIME / (currentImages.length * 30) * 21);
    setTimeout(function () {
        currentBossImage = currentImages[1];
    }, BOSS_HIT_TIME / (currentImages.length * 30) * 31);
    setTimeout(function () {
        currentBossImage = currentImages[0];
    }, BOSS_HIT_TIME / (currentImages.length * 30) * 41);
    setTimeout(function () {
        currentBossImage = currentImages[1];
    }, BOSS_HIT_TIME / (currentImages.length * 30) * 51);

}