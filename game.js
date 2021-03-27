let canvas;
let ctx;
let character_x = 100;
let character_y = 45;
let bg_sky_x = -270;
let bg3_ground_x = -270;
let bg2_ground_x = -270;
let bg1_ground_x = -270;
let bg_ground_x_min = -10;    //Verhindert, dass character unendlich nach links laufen kann
let bg_ground_x_max;        //Verhindert, dass character unendlich nach rechts laufen kann
let bg_element_y = 0;
let cloud_offset = 0;
let isMovingRight = false;
let isMovingLeft = false;
let lastMove = "right";
let lastJumpStarted = new Date().getTime();
let lastMoveFinished = new Date().getTime();
let currentCharacterImage = new Image;
let character_idle_index = 0;
let character_walk_index = 0;
/* let chicken_yellow_image_index = 0;
let chicken_brown_image_index = 0; */
let chickens;
let chicken_y = 365;


//Image Object with all character images
let characterImages = {
    walk: [
        ['img/character/walk/Wl-21.png',
            'img/character/walk/Wl-22.png',
            'img/character/walk/Wl-23.png',
            'img/character/walk/Wl-24.png',
            'img/character/walk/Wl-25.png',
            'img/character/walk/Wl-26.png'],
        ['img/character/walk/Wr-21.png',
            'img/character/walk/Wr-22.png',
            'img/character/walk/Wr-23.png',
            'img/character/walk/Wr-24.png',
            'img/character/walk/Wr-25.png',
            'img/character/walk/Wr-26.png']
    ],
    jump: [
        ['img/character/jump/Jl-31.png',
            'img/character/jump/Jl-32.png',
            'img/character/jump/Jl-33.png'],
        ['img/character/jump/Jr-31.png',
            'img/character/jump/Jr-32.png',
            'img/character/jump/Jr-33.png']
    ],
    hurt: [
        ['img/character/hurt/Hl-41.png',
            'img/character/hurt/Hl-42.png',
            'img/character/hurt/Hl-43.png'],
        ['img/character/hurt/Hr-41.png',
            'img/character/hurt/Hr-42.png',
            'img/character/hurt/Hr-43.png']
    ],
    idle: [
        ['img/character/idle/Il-1.png',
            'img/character/idle/Il-2.png',
            'img/character/idle/Il-3.png',
            'img/character/idle/Il-4.png',
            'img/character/idle/Il-5.png',
            'img/character/idle/Il-6.png',
            'img/character/idle/Il-7.png',
            'img/character/idle/Il-8.png',
            'img/character/idle/Il-9.png',
            'img/character/idle/Il-10.png'],
        ['img/character/idle/Ir-1.png',
            'img/character/idle/Ir-2.png',
            'img/character/idle/Ir-3.png',
            'img/character/idle/Ir-4.png',
            'img/character/idle/Ir-5.png',
            'img/character/idle/Ir-6.png',
            'img/character/idle/Ir-7.png',
            'img/character/idle/Ir-8.png',
            'img/character/idle/Ir-9.png',
            'img/character/idle/Ir-10.png']
    ],
    sleep: [
        ['img/character/sleep/Sl-11.png',
            'img/character/sleep/Sl-12.png',
            'img/character/sleep/Sl-13.png',
            'img/character/sleep/Sl-14.png',
            'img/character/sleep/Sl-15.png',
            'img/character/sleep/Sl-16.png',
            'img/character/sleep/Sl-17.png',
            'img/character/sleep/Sl-18.png',
            'img/character/sleep/Sl-19.png',
            'img/character/sleep/Sl-20.png'],
        ['img/character/sleep/Sr-11.png',
            'img/character/sleep/Sr-12.png',
            'img/character/sleep/Sr-13.png',
            'img/character/sleep/Sr-14.png',
            'img/character/sleep/Sr-15.png',
            'img/character/sleep/Sr-16.png',
            'img/character/sleep/Sr-17.png',
            'img/character/sleep/Sr-18.png',
            'img/character/sleep/Sr-19.png',
            'img/character/sleep/Sr-20.png']
    ]
};

//Image Object with all background images
let backgroundImages = {
    ground: [
        'img/bg/ground3/1.png',
        'img/bg/ground3/2.png',
        'img/bg/ground2/1.png',
        'img/bg/ground2/2.png',
        'img/bg/ground1/1.png',
        'img/bg/ground1/2.png'
    ],
    sky: [
        'img/bg/sky/sky.png',
        'img/bg/sky/clouds1.png',
        'img/bg/sky/clouds2.png'
    ]
}

//Image Object with all chicken images
let chickenImages = {
    yellow: [
        'img/enemies/chicken_yellow/CY1.png',
        'img/enemies/chicken_yellow/CY2.png',
        'img/enemies/chicken_yellow/CY3.png',
        'img/enemies/chicken_yellow/CY2.png'
    ],
    yellow_dead: [
        'img/enemies/chicken_yellow/CY-dead.png'
    ],
    brown: [
        'img/enemies/chicken_brown/CB2.png',
        'img/enemies/chicken_brown/CB1.png',
        'img/enemies/chicken_brown/CB3.png',
        'img/enemies/chicken_brown/CB1.png'
    ],
    brown_dead: [
        'img/enemies/chicken_brown/CB-dead.png'
    ]
}


//Ziel dieser Funktion ist es, jeden Pfadeintrag des Objektes characterImages durch das entsprechende Bildobjekt zu ersetzen und es dadurch vorzuladen.
//Gibt jedes Element des Objekts "characterImages" aus, d.h. den Pfad.
//x ist die Anzahl der Elemente im Objekt
//y ist die Wahl zwischen left und right
//z ist die Anzahl der Elemente in einem spezifischen Array, z.B. 6 Elemente im Array walk-left (da dort 6 Bilder vorhanden).

/**
 * IMAGE CACHING 
 * Catches every entry(path) in an object which contains all image paths, and turns it into an image object.
 * Only for objects which contain two level of arrays.
 * @param  {obj} obj - An object which contains all image paths.
 */
function preloadCharakterImages(obj) {

    for (let x = 0; x < Object.keys(obj).length; x++) {
        for (let y = 0; y < obj[Object.keys(obj)[x]].length; y++) {
            for (let z = 0; z < obj[Object.keys(obj)[x]][y].length; z++) {
                //Catch every entry (image-path) in e.g. characterImages object
                let path = obj[Object.keys(obj)[x]][y][z];
                //console.log("The entry(path) is: ", path);
                //Creates an image using the current path
                let image = new Image();
                image.src = path;
                //Save the new image object back to image collection object, e.g. characterImages object
                obj[Object.keys(obj)[x]][y][z] = image;
            }
        }
    }
}

/**
 * IMAGE CACHING 
 * Catches every entry(path) in an object which contains all image paths, and turns it into an image object.
 * Only for objects which contain one level of arrays.
 * @param  {obj} obj - An object which contains all image paths.
 */
function preloadOtherImages(obj) {
    for (let x = 0; x < Object.keys(obj).length; x++) {
        for (let y = 0; y < obj[Object.keys(obj)[x]].length; y++) {
            //Catch every entry (img-path) in backgroundImages object
            let path = obj[Object.keys(obj)[x]][y];
            let image = new Image();
            image.src = path;
            //Save entries with img-Objects back to backgroundImages object
            obj[Object.keys(obj)[x]][y] = image;
        }
    }
}


// ------------------- Game config
//Kostanten werden groß und mit Unterstrich geschrieben. Eine Konstante ist eine Variable, die sich über das ganze Spiel nicht ändert.
const PLAYING_FIELD_LENGTH = 15;
const JUMP_TIME = 400;
const GAME_SPEED = 7;
const CLOUD_SPEED = 0.2;
const MIN_CHICKEN_SPEED = 2;


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
 * Checks if the character is currently running to the right or to the left in order to prepair the correct images.
 */
function checkForRunning() {
    setInterval(function () {
        if (isMovingRight == true) {
            let currentImages = characterImages['walk'][1];
            showRunningImages(currentImages);
        }
        else if (isMovingLeft == true) {
            let currentImages = characterImages['walk'][0];
            showRunningImages(currentImages);
        }
    }, 100);
}


/**
 * Iterates through the array with the running images.
 * Calculation with modulo makes iteration from 0 to the length of the array possible
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
        let timeForRelax = timePassedSinceLastMove > JUMP_TIME * 2 && timePassedSinceLastMove < JUMP_TIME * 20;
        let timeForSleep = timePassedSinceLastMove > JUMP_TIME * 20;

        if (isMovingLeft == false && isMovingRight == false) {
            if (timeForRelax == true) {
                checkRelaxingDirection();
            }
            else if (timeForSleep == true) {
                checkSleepingDirection();
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
 * Calculation with modulo makes iteration from 0 to the length of the array possible
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
 * Calculation with modulo makes iteration from 0 to the length of the array possible
 * @param  {Object} currentImages - Sleeping images with right or left animation.
 */
function sleep(currentImages) {
    let index = character_idle_index % currentImages.length;
    currentCharacterImage = currentImages[index];
    character_idle_index++;
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
 * Draws the current character image.
 */
function updateCharacter() {

    let character_image = currentCharacterImage;

    checkCharacterJumpHeight();

    //character_image.complete: returns true if image has finished loading
    if (character_image.complete) {
        ctx.drawImage(character_image, character_x, character_y, character_image.width * 0.35, character_image.height * 0.35);
    }
}


/**
 * Regulates if the character goes up or down.
 */
function checkCharacterJumpHeight() {
    timePassedSinceJump = new Date().getTime() - lastJumpStarted;
    //Check rising of the character
    if (timePassedSinceJump < JUMP_TIME) {
        character_y = character_y - 10;
    }
    //Check falling
    else if (character_y < 45) {
        character_y = character_y + 10;
    }
}


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

/**
 * Corrects the chickens' position when background is moving.
 * 
 * @param  {boolean} movingDirection - Moving direction of the character.
 */
function correctChickenPosition(movingDirection) {
    if (isMovingRight) {
        for (let i = 0; i < chickens.length; i++) {
            let chicken = chickens[i];
            chicken.position_x = chicken.position_x - GAME_SPEED;
        }
    }
    else if (isMovingLeft) {
        for (let i = 0; i < chickens.length; i++) {
            let chicken = chickens[i];
            chicken.position_x = chicken.position_x + GAME_SPEED;
        }
    }
}


/**
 * Draws sky and clouds.
 */
function drawSky() {
    for (let i = 0; i < PLAYING_FIELD_LENGTH; i++) {
        addBackgroundImage(backgroundImages.sky[0], bg_sky_x, bg_element_y, i);
    }
    for (let i = 0; i < PLAYING_FIELD_LENGTH; i = i + 2) {
        addBackgroundImage(backgroundImages.sky[1], bg_sky_x - cloud_offset, bg_element_y, i);
        addBackgroundImage(backgroundImages.sky[2], bg_sky_x - cloud_offset, bg_element_y, i + 1);
    }
}


/**
 * Draws the three ground layers.
 */
function drawGround() {
    for (let i = 0; i < PLAYING_FIELD_LENGTH; i = i + 2) {
        addBackgroundImage(backgroundImages.ground[0], bg3_ground_x, bg_element_y, i);
        addBackgroundImage(backgroundImages.ground[1], bg3_ground_x, bg_element_y, i + 1);
    }
    for (let i = 0; i < PLAYING_FIELD_LENGTH; i = i + 2) {
        addBackgroundImage(backgroundImages.ground[2], bg2_ground_x, bg_element_y, i);
        addBackgroundImage(backgroundImages.ground[3], bg2_ground_x, bg_element_y, i + 1);
    }
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

/**
 * Creates an array with all chicken enemy objects in the game.
 */
function createChickenList() {
    chickens = [
        createChicken("yellow", canvas.width + 400, chicken_y, 0.4, 0),
        createChicken("yellow", canvas.width * 3 + 400, chicken_y, 0.4, 0),
        createChicken("yellow", canvas.width * 3 + 800, chicken_y, 0.4, 0),
        createChicken("yellow", canvas.width * 6 + 400, chicken_y, 0.4, -2),
        createChicken("brown", canvas.width * 6 + 600, chicken_y - 25, 0.5, 5),
        createChicken("yellow", canvas.width * 6 + 800, chicken_y, 0.4, 0),
        createChicken("yellow", canvas.width * 9 + 400, chicken_y, 0.4, 0),
        createChicken("brown", canvas.width * 9 + 600, chicken_y - 25, 0.5, 5),
        createChicken("yellow", canvas.width * 9 + 800, chicken_y, 0.4, 0),
        createChicken("yellow", canvas.width * 10 + 500, chicken_y, 0.4, 0),
        createChicken("yellow", canvas.width * 11 + 100, chicken_y, 0.4, 5),
        createChicken("yellow", canvas.width * 12 + 800, chicken_y, 0.4, 5),
        createChicken("yellow", canvas.width * 13 + 300, chicken_y, 0.4, 5),
        createChicken("yellow", canvas.width * 14 + 800, chicken_y, 0.4, 10),
        createChicken("brown", canvas.width * 30 + 500, chicken_y - 50, 0.6, 20),
        createChicken("brown", canvas.width * 40 + 500, chicken_y - 50, 0.6, 20),
        createChicken("brown", canvas.width * 50 + 500, chicken_y - 60, 0.7, 25)
    ];
}

/**
 * Creates a chicken enemy object.
 * 
 * @param  {string} type - The chicken's type.
 * @param  {number} position_x - The chicken's horizontal position.
 * @param  {number} position_y - The chicken's vertical position.
 * @param  {number} scale - Factor for chicken's image.
 * @param  {number} extra_speed - Variable summand for extra speed.
 * @returns {Object} - Chicken enemy object.
 */
function createChicken(type, position_x, position_y, scale, extra_speed) {
    return {
        "type": type,
        "img": chickenImages[type][0],
        "position_x": position_x,
        "position_y": position_y,
        "scale": scale,
        "speed": MIN_CHICKEN_SPEED + Math.random() * 8 + extra_speed
    };
}

/**
 * Changes the position of every chicken enemy regularly depending on its individual speed.
 */
 function calculateChickenPosition() {
    setInterval(function () {
        for (let i = 0; i < chickens.length; i++) {
            let chicken = chickens[i];
            chicken.position_x = chicken.position_x - chicken.speed;
        }
    }, 50);
}

/**
 * Separates yellow and brown chickens in two differenz arrays
 */
function calculateChickenImages() {
    
    let yellowChickens = [];
    let brownChickens = [];

    for (let i = 0; i < chickens.length; i++) {
        let chicken = chickens[i];
        if (chicken.type == 'yellow') {
            yellowChickens.push(chicken);
        }
        else if (chicken.type == 'brown') {
            brownChickens.push(chicken);
        }
    }

    calculateYellowChickenImages(yellowChickens);
    calculateBrownChickenImages(brownChickens);
}

/**
 * Iterates through yellow chicken's images depending on its speed.
 */
function calculateYellowChickenImages(yellowChickens) {
    for (let i = 0; i < yellowChickens.length; i++) {
        let chicken_yellow_image_index = 0;
        let yellowChicken = yellowChickens[i];
        let chickenSpeed = Math.round(1000 / yellowChicken.speed);
        console.log(chickenSpeed);
        setInterval(function() {
            let index = chicken_yellow_image_index % chickenImages.yellow.length;
            yellowChicken.img = chickenImages.yellow[index];
            chicken_yellow_image_index++;
        }, chickenSpeed)
    }
}

/**
 * Iterates through brown chicken's images depending on its speed.
 */
function calculateBrownChickenImages(brownChickens) {
    for (let i = 0; i < brownChickens.length; i++) {
        let chicken_brown_image_index = 0;
        let brownChicken = brownChickens[i];
        let chickenSpeed = Math.round(1000 / brownChicken.speed);
        console.log(chickenSpeed);
        setInterval(function() {
            let index = chicken_brown_image_index % chickenImages.brown.length;
            brownChicken.img = chickenImages.brown[index];
            chicken_brown_image_index++;
        }, chickenSpeed)
    }
}

/**
 * Draws all chicken enemy objects.
 */
function drawChicken() {
    for (let i = 0; i < chickens.length; i++) {
        let chicken = chickens[i];
        addObject(chicken.img, chicken.position_x, chicken.position_y, chicken.scale);
    }
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
