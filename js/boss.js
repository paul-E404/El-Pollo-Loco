function updateBoss() {

    let boss_image = currentBossImage;

    if (boss_image.complete) {
        ctx.drawImage(boss_image, boss_x, boss_y, boss_image.width * 0.30, boss_image.height * 0.30);
    }

    drawBossEnergy();

}

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


function bossAction() {
    if (firstBossHit == true) {
        //change graphics to angry
        //bigger walking interval
    }
    else if (bossAlmostDead == true) {
        //change graphics to totally angry
        //biggest walking interval
    }
    else if (bossDead == true) {
        //show dead image animation
    }
    else {
        bossWalking();
    }
}


function bossWalking() {
    setInterval(function () {
        let index = boss_walk_index % bossImages.walk[0].length;
        currentTime = new Date().getTime();
        let timePassedSinceLastHit = currentTime - lastHitStarted;

        if (timePassedSinceLastHit > BOSS_HIT_TIME) {
            if (boss_x >= 485 && bossMovingLeft == true) {
                currentBossImage = bossImages.walk[0][index];
                boss_x = boss_x - 5;
                //console.log("boss_x: ", boss_x, "bossMovingLeft: ", bossMovingLeft, "bossMovingRight: ", bossMovingRight);
                if (boss_x < 485) {
                    bossMovingLeft = false;
                    bossMovingRight = true;
                }
            }
            if (boss_x <= 515 && bossMovingRight == true) {
                currentBossImage = bossImages.walk[1][index];
                boss_x = boss_x + 5;
                if (boss_x == 520) {
                    bossMovingLeft = true;
                    bossMovingRight = false;
                }
            }
    
            if (index % 2 == 0) {
                boss_y = boss_y + 5;
            }
            else {
                boss_y = boss_y - 5;
            }
            boss_walk_index++;
        }
        

    }, 500)
}


//Collision of thrown bottle with boss
function checkForThrownBottleHit() {

    setInterval(function () {

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

        let counter = 0;
        if (thrown_bottle_x_axis < (boss_x_axis + boss_image_width_half) && thrown_bottle_x_axis > (boss_x_axis - boss_image_width_half)) {
            if (thrown_bottle_y_axis < (boss_y_axis + boss_image_height_half) && thrown_bottle_y_axis > (boss_y_axis - boss_image_height_half / 2)) {
                counter++; 
                console.log("Treffer! Nr.: ", counter);
                //checkCollisionDirection();
                //Prevent character from falling sleep
                //lastMoveFinished = new Date().getTime();
                //AUDIO_CHARACTER_SNORING.pause();
                reduceBossEnergy();
                //show broken bottle animation
                lastHitStarted = new Date().getTime();
                checkBossHitDirection();
            }
        }
    }, 50);
}



function reduceBossEnergy() {
    if (boss_energy == 90) {
        firstBossHit = true;
    }
    if (boss_energy == 20) {
        firstBossHit = false;
        bossAlmostDead = true;
    }
    else if (boss_energy == 0) {
        bossDead = true;
    }
    if (boss_energy >= 10) {
        boss_energy = boss_energy - 10;
    }
}



function checkBossHitDirection() {
    currentTime = new Date().getTime();
    let timePassedSinceLastHit = currentTime - lastHitStarted;

    if(timePassedSinceLastHit <= BOSS_HIT_TIME) {
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



function animateBossHit(currentImages) {
    setTimeout(function () {
        currentBossImage = currentImages[0];
    }, BOSS_HIT_TIME / (currentImages.length * 30) * 1);
    setTimeout(function () {
        currentBossImage = currentImages[1];
    }, BOSS_HIT_TIME / (currentImages.length * 30) * 10);
    setTimeout(function () {
        currentBossImage = currentImages[0];
    }, BOSS_HIT_TIME / (currentImages.length * 30) * 20);
    setTimeout(function () {
        currentBossImage = currentImages[1];
    }, BOSS_HIT_TIME / (currentImages.length * 30) * 30);
    setTimeout(function () {
        currentBossImage = currentImages[0];
    }, BOSS_HIT_TIME / (currentImages.length * 30) * 40);
    setTimeout(function () {
        currentBossImage = currentImages[1];
    }, BOSS_HIT_TIME / (currentImages.length * 23) * 50);

}