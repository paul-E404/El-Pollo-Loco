/**
 * Hides startscreen elements and shows canvas.
 */
function startGame() {

    let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    let content = document.getElementById('content');
    let canvas = document.getElementById('canvas');

    canvas.classList.remove('d-none');

    if (width < 850) {
        fullScreenForMobile(content);
    }

    document.getElementById('startScreen').classList.add('d-none');
    document.getElementById('start-game-btn').classList.add('d-none');

    init();
}

/**
 * Enlarges content to fullscreen mode.
 * 
 * @param  {Object} content - Content container with canvas and control display.
 */
function fullScreenForMobile(content) {
    if (content.requestFullscreen) {
        content.requestFullscreen();
    } else if (content.msRequestFullscreen) {
        content.msRequestFullscreen();
    } else if (content.mozRequestFullScreen) {
        content.mozRequestFullScreen();
    } else if (content.webkitRequestFullScreen) {
        content.webkitRequestFullScreen();
    }
}

/**
 * Reloads the page.
 */
function restartGame() {
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

/**
 * Starts all important functions to make the game running.
 */
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
    listenForTouch();
    preventLongTouchMenu();
    startTitleSong();
}


/**
 * Draws the current background, character images, enemies and object images depending on browserspeed.
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
            drawEndScreen('won');
        }
        else if (gameLost == true) {
            drawEndScreen('lost');
        }
    }

    //requestAnimationFrame(function): webbrowser takes the ressources it needs from the graphic card in order to update the frame.
    //This is a less flickering alternative to setInterval.
    requestAnimationFrame(draw);
}

/**
 * Starts playing the title song in a loop.
 */
function startTitleSong() {
    AUDIO_MEXICAN_SONG.volume = 0.1;
    AUDIO_MEXICAN_SONG.play();
    AUDIO_MEXICAN_SONG.loop = true;
}

/**
 * Plays boss intro music and boss main music.
 */
function startBossMusic() {

    AUDIO_BOSS_MUSIC_INTRO.volume = 0.8;
    AUDIO_BOSS_MUSIC.volume = 0.2;

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
 * Plays final sounds and manages endscreen issues as soon as character wins the game.
 */
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
        document.getElementById('game-info-text').innerHTML = 'Congratulations! You won!';
    }, BOSS_DYING_TIME + 3000);

    setTimeout(function () {
        showRestartButton();
    }, BOSS_DYING_TIME + 5000);

}

/**
 * Manages sounds and endscreen issues as soon as character loses the game.
 */
function finishGameLost() {

    AUDIO_MEXICAN_SONG.pause();
    AUDIO_BOSS_MUSIC_INTRO.pause();
    AUDIO_BOSS_MUSIC.pause();
    chickens = [];
    AUDIO_CHICKEN_CROWD.pause();

    setTimeout(function () {
        AUDIO_GAME_LOST.play();
    }, CHARACTER_DYING_TIME + 1000)

    setTimeout(function () {
        //It is necessary to pause AUDIO_BOSS_MUSIC several times for the case character is dying when boss has already been reached.
        AUDIO_BOSS_MUSIC.pause();
        timeForEndscreen = true;
        document.getElementById('game-info-text').innerHTML = `Don't give up! Try again!`;
    }, CHARACTER_DYING_TIME + 4000);

    setTimeout(function () {
        AUDIO_BOSS_MUSIC.pause();
        AUDIO_GAME_LOST_MUSIC.volume = 0.9;
        AUDIO_GAME_LOST_MUSIC.play();
        AUDIO_GAME_LOST_MUSIC.loop = true;
    }, CHARACTER_DYING_TIME + 5000);

    setTimeout(function () {
        showRestartButton();
    }, CHARACTER_DYING_TIME + 7000);
}

/**
 * Draws different endscreens depending on character's win or lose.
 * 
 * @param  {String} status - Character's status when finishing the game.
 */
function drawEndScreen(status) {
    let image;
    if (status == 'won') {
        image = backgroundImages['screens'][1];
    }
    else if (status == 'lost') {
        image = backgroundImages['screens'][2];
    }
    addBackgroundImage(image, 0, 0, 0);
}

/**
 * Shows restart button on screen.
 */
function showRestartButton() {
    document.getElementById('restart-game-btn').classList.remove('d-none');
}

/**
 * Toggles fullscreen mode.
 */
function toggleFullscreen() {

    let fullscreenIcon = document.getElementById('fullscreen-icon');
    let fullscreenExitIcon = document.getElementById('fullscreen-exit-icon');
    let content = document.getElementById('content');
    let canvas = document.getElementById('canvas');

    if (fullscreenActive == false) {
        enlargeToFullscreen(fullscreenIcon, fullscreenExitIcon, content, canvas);
        fullscreenActive = true;
    }
    else if (fullscreenActive == true) {
        leaveFullscreen(fullscreenIcon, fullscreenExitIcon, content, canvas);
        fullscreenActive = false;
    }
}

/**
 * Enlarges content to fullscreen.
 */
function enlargeToFullscreen(fullscreenIcon, fullscreenExitIcon, content, canvas) {

    content.requestFullscreen();

    fullscreenIcon.classList.add('d-none');
    fullscreenExitIcon.classList.remove('d-none');

    content.style.height = "100vh";
    content.style.width = "100%";
    content.style.border = 0;
    content.style.backgroundColor = "unset";
    canvas.style.height = "100%";

}

/**
 * Exits fullscreen mode.
 */
function leaveFullscreen(fullscreenIcon, fullscreenExitIcon, content, canvas) {

    document.exitFullscreen();

    fullscreenIcon.classList.remove('d-none');
    fullscreenExitIcon.classList.add('d-none');

    content.style.height = "580px";
    content.style.width = "805px";
    content.style.border = "2px solid white";
    canvas.style.height = "unset";

}

/**
 * Shows an info to play the game in landscape mode when device's width is less than 850px.
 */
function useLandscape() {
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

    if (width < 850) {
        alert("Please use your device in landscape mode for being able to play the game properly!");
    }
}