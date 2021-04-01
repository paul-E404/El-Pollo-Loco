function drawEnergyBar() {
    ctx.fillStyle = "rgba(224, 0, 82, 0.8)";
    ctx.fillRect(60, 37, 2 * character_energy, 20);

    ctx.fillStyle = "white"
    ctx.globalAlpha = 0.3;
    ctx.fillRect(55, 32, 210, 30);
    ctx.globalAlpha = 1;
}

function drawObjects() {

    let heart = objectImages.display[0];
    let coin = objectImages.display[1];
    let bottle = objectImages.display[2];

    if (heart.complete) {
        ctx.drawImage(heart, 10, 0, heart.width * 0.5, heart.height * 0.5);
    }
    if (coin.complete) {
        ctx.drawImage(coin, 300, 15, coin.width * 0.4, coin.height * 0.4);
    }
    if (bottle.complete) {
        ctx.drawImage(bottle, 400, 15, coin.width * 0.4, bottle.height * 0.4);
    }

    drawBottles();
}


function drawBottles() {
    for (let i = 0; i < placedBottles.length; i++) {
        let bottle_x = placedBottles[i];
        addObject(objectImages.bottles[0], bottle_x, 335, 0.3);
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

