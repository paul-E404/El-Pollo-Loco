

function updateBoss() {
    
    let boss_image = currentBossImage;

    if (boss_image.complete) {
        ctx.drawImage(boss_image, boss_x, boss_y, boss_image.width * 0.30, boss_image.height * 0.30);
    }

}


function bossWalking() {
    setInterval(function() {
        let index = boss_walk_index % bossImages.walk[0].length;

        if (boss_x >= 485 && bossMovingLeft == true) {
            currentBossImage = bossImages.walk[0][index];
            boss_x = boss_x - 5;
            console.log("boss_x: ", boss_x, "bossMovingLeft: ", bossMovingLeft, "bossMovingRight: ", bossMovingRight);
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
        
    }, 500)
}