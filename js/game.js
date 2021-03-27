
/**
 * Draws the canvas and loads important start-functions.
 */
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    //Length of the playing field without first and last canvas width
    preloadOtherImages(backgroundImages);
    preloadCharakterImages(characterImages);
    preloadOtherImages(chickenImages);
    createChickenList();
    calculateChickenPosition();
    calculateChickenImages();
    checkForRelaxing();
    checkForRunning();
    draw();
    listenForKeys();
}


/**
 * Draws the current background, character images and object images depending on browserspeed.
 */
function draw() {
    //Verhindert dass die Hintergrundbilder mehrfach angezeigt werden. Kann ggf. am Ende entfernt werden.
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawChicken();
    updateCharacter();
    //requestAnimationFrame(function): webbrowser takes the ressources it needs from the graphic card in order to update the frame.
    //This is a less flickering alternative to setInterval.
    requestAnimationFrame(draw);
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
        //e.key bedeutet, ich möchte von dem JSON Event des keys namens "code" den value und dieser ist "ArrowRight" etc.
        let key = e.code; // z.B. "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
        if (key == "ArrowRight") {
            isMovingRight = true;
            lastMove = "right";
            /* character_x = character_x + 5; */
        }
        if (key == "ArrowLeft") {
            isMovingLeft = true;
            lastMove = "left";
            /* character_x = character_x - 5; */
        }

        timePassedSinceJump = new Date().getTime() - lastJumpStarted;
        //Erst wenn die JUMP TIME vorüber ist, darf ein neuer Sprung begonnen werden.
        //Daher muss die Zeit seit dem letzten Sprung größer als die Sprungzeit sein (also außerhalb dieser Zeit liegen).
        //JUMP_TIME * 2, da wir JUMP_TIME hochspringen und JUMP_TIME runterfallen (ein Sprung).
        if ((key == "Space" || key == "ArrowUp") && timePassedSinceJump > JUMP_TIME * 2) {
            lastJumpStarted = new Date().getTime();         //Unix Timestamp
            timePassedSinceLastMove = new Date().getTime();
            checkJumpDirection();
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
    });
}


