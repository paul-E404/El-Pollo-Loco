function startGame() {
    
    document.getElementById('startScreen').classList.add('d-none');
    document.getElementById('start-game-btn').classList.add('d-none');
    
    init();
}

function restartGame() {
    /* document.getElementById('restart-game-btn').classList.add('d-none');
    timeForEndscreen = false;
    AUDIO_GAME_LOST_MUSIC.pause(); */
 
    location.reload();

}



/**
 * Draws the canvas and loads important start-functions.
 */
function preload() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    preloadOtherImages(backgroundImages);
    preloadCharakterImages(characterImages);
    preloadOtherImages(objectImages);
    preloadOtherImages(chickenImages);
    preloadCharakterImages(bossImages);
}

function init() {

        createChickenList();
        calculateChickenPosition();
        calculateChickenImages();
        checkForRelaxing();
        checkForRunning();
        checkForCollision();
        checkForThrownBottleHit();
        checkForBossAction();
        checkForDying();
        draw();
        listenForKeys();
        startTitleSong();
    
}



/**
 * Draws the current background, character images and object images depending on browserspeed.
 */
function draw() {
    drawBackground();
    drawEnergyBar();
    drawDisplay();
    drawBottles();
    drawChicken();
    let timePassed = new Date().getTime() - timeWhenBossReached;
    if (reachedBoss == true && timePassed > BOSS_INTRO_PLAYING_TIME && gameLost == false) {
        updateBoss();
    }
    drawThrownBottle();
    drawBrokenBottle();
    updateCharacter();

    if (timeForEndscreen == true) {
        if (gameWon == true) {
            drawScreen('won');
        }
        else if (gameLost == true) {
            drawScreen('lost');
        }
    }


    //requestAnimationFrame(function): webbrowser takes the ressources it needs from the graphic card in order to update the frame.
    //This is a less flickering alternative to setInterval.
    requestAnimationFrame(draw);
}


function startTitleSong() {
    AUDIO_MEXICAN_SONG.volume = 0.3;
    AUDIO_MEXICAN_SONG.play();
    AUDIO_MEXICAN_SONG.loop = true;
}

function startBossMusic() {

    AUDIO_BOSS_MUSIC_INTRO.volume = 0.4;
    AUDIO_BOSS_MUSIC.volume = 0.4;

    AUDIO_BOSS_MUSIC_INTRO.play();

    setTimeout(function () {
        AUDIO_BOSS_MUSIC_INTRO.pause();
        AUDIO_BOSS_MUSIC.play();
        AUDIO_BOSS_MUSIC.loop = true;

    }, BOSS_INTRO_PLAYING_TIME);
}

/**
 * Collects all relevant informations for positioning a new image object.
 * 
 * @param  {Object} image - Image Object.
 * @param  {number} start_x - Horizontal start position.
 * @param  {number} start_y - Vertical start position.
 * @param  {number} scale - Scale factor for image sizing.
 */
function addObject(image, start_x, start_y, scale) {
    if (image.complete) {
        ctx.drawImage(image, start_x, start_y, image.width * scale, image.height * scale);
    }
}


/**
 * Listens for keys being pressed or released.
 */
function listenForKeys() {
    //e steht für event
    //Das Event (Keyboardevent) ist ein JSON, in dem sich alle Informationen zu einer gedrückten Taste befinden.
    //Um sich das komplette Event (JSON) anzeigen zu lassen
    //console.log(e);
    keyDown();
    keyUp();
}


/**
 * Listens for keys being pressed.
 */
function keyDown() {
    //If a special key is pressed
    document.addEventListener('keydown', function (e) {

        //user can no longer make any movements when game is lost
        if (gameLost != true) {
            //e.key bedeutet, ich möchte von dem JSON Event des keys namens "code" den value und dieser ist "ArrowRight" etc.
            let key = e.code; // z.B. "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"

            if (key == "ArrowRight") {
                isMovingRight = true;
                lastMove = "right";
            }
            if (key == "ArrowLeft") {
                isMovingLeft = true;
                lastMove = "left";
            }

            //Erst wenn die JUMP TIME vorüber ist, darf ein neuer Sprung begonnen werden.
            //Daher muss die Zeit seit dem letzten Sprung größer als die Sprungzeit sein (also außerhalb dieser Zeit liegen).
            //JUMP_TIME * 2, da wir JUMP_TIME hochspringen und JUMP_TIME runterfallen (ein Sprung).
            if ((key == "Space" || key == "ArrowUp") && timePassedSinceJump > JUMP_TIME * 2) {
                lastJumpStarted = new Date().getTime();         //Unix Timestamp
                checkJumpDirection();
                AUDIO_CHARACTER_JUMPING.play();
                AUDIO_CHARACTER_SNORING.pause();
            }


            if (key == "KeyD") {
                if (collectedBottles > 0) {
                    //Ensures that a new throw can only be started when the old one has finished
                    if (timePassedSinceThrow > THROW_TIME) {
                        //let timePassedSinceThrow = new Date().getTime() - lastThrowStarted;
                        lastThrowStarted = new Date().getTime();
                        collectedBottles--;
                        if (lastMove == 'left') {
                            bottleThrowingDirection = 'left';
                        } else if (lastMove == 'right') {
                            bottleThrowingDirection = 'right';
                        }
                    }
                }
            }
        }


    });
}


/**
 * Listens for keys being released.
 */
function keyUp() {
    //If a special key is released
    document.addEventListener('keyup', function (e) {
        let key = e.code;
        if (key == "ArrowRight") {
            isMovingRight = false;
            lastMoveFinished = new Date().getTime();
            /* character_x = character_x + 5; */
        }
        if (key == "ArrowLeft") {
            isMovingLeft = false;
            lastMoveFinished = new Date().getTime();
            /* character_x = character_x - 5; */
        }
        if (key == "Space" || key == "ArrowUp") {
            lastMoveFinished = new Date().getTime();
        }
        if (key == "KeyD") {
            lastMoveFinished = new Date().getTime();
        }
    });
}



function finishGameWon() {
    setTimeout(function () {
        AUDIO_BOSS_DEAD.play();
        AUDIO_EXPLOSION.play();
        chickens = [];
    }, BOSS_HIT_TIME);

    setTimeout(function () {
        AUDIO_MEXICAN_SONG.play();
    }, BOSS_DYING_TIME)

    setTimeout(function () {
        timeForEndscreen = true;
    }, BOSS_DYING_TIME + 3000);

    setTimeout(function () {
        showRestartButton();
    }, BOSS_DYING_TIME + 5000);
}

function finishGameLost() {

    AUDIO_MEXICAN_SONG.pause();
    AUDIO_BOSS_MUSIC_INTRO.pause();
    AUDIO_BOSS_MUSIC.pause();
    chickens = [];
    AUDIO_CHICKEN_CROWD.pause();

    setTimeout(function () {
        AUDIO_GAME_LOST.play();
    }, CHARACTER_DYING_TIME + 1000)

    setTimeout(function() {
        timeForEndscreen = true;
    }, CHARACTER_DYING_TIME + 4000);

    setTimeout(function() {
        AUDIO_GAME_LOST_MUSIC.volume = 0.7;
        AUDIO_GAME_LOST_MUSIC.play();
        AUDIO_GAME_LOST_MUSIC.loop = true;
    }, CHARACTER_DYING_TIME + 5000);

    setTimeout(function() {
      showRestartButton();
    }, CHARACTER_DYING_TIME + 7000);
}


function drawScreen(status) {
    let image;
    if (status == 'won') {
        image = backgroundImages['screens'][1];
    }
    else if (status == 'lost') {
        image = backgroundImages['screens'][2];
    }
    addBackgroundImage(image, 0, 0, 0);
}


function showRestartButton() {
    document.getElementById('restart-game-btn').classList.remove('d-none');
}
