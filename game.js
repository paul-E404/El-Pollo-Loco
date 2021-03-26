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
let chicken_image_index = 0;
let chickens;
let chicken_y = 365;


/*


AUS DEM CALL MIT JUNUS ZUM THEMA ASYNCHRONE FUNKTIONEN


function loadCache() {
            return Promise(function (resolve, reject) {
                // lade bild 1
                // lade bild 2
                resolve();
            });
            fetch()
            backend.setItem()
        }
        async function init(){
            loadCache();
            movePepe();
        }

*/




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
        'img/enemies/chicken_yellow/CY3.png'
    ],
    yellow_dead: [
        'img/enemies/chicken_yellow/CY-dead.png'
    ],
    brown: [
        'img/enemies/chicken_brown/CB1.png',
        'img/enemies/chicken_brown/CB2.png',
        'img/enemies/chicken_brown/CB3.png'
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
            console.log("Der Pfad für das Backgroundimage ist: ", path);
            let image = new Image();
            image.src = path;
            //Save entries with img-Objects back to backgroundImages object
            obj[Object.keys(obj)[x]][y] = image;
        }
    }
}


// ------------------- Game config
//Kostanten werden groß und mit Unterstrich geschrieben. Eine Konstante ist eine Variable, die sich über das ganze Spiel nicht ändert.
let JUMP_TIME = 400;
let GAME_SPEED = 7;
let CLOUD_SPEED = 0.2;


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
    calculateChicken();
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
        bg_sky_x = bg_sky_x - GAME_SPEED * 0.1;
    }
    if (isMovingLeft == true && wallLeft == false) {
        bg3_ground_x = bg3_ground_x + GAME_SPEED * 0.2;
        bg2_ground_x = bg2_ground_x + GAME_SPEED * 0.4;
        bg1_ground_x = bg1_ground_x + GAME_SPEED;
        bg_sky_x = bg_sky_x + GAME_SPEED * 0.1;
    }
    drawSky();
    drawGround();
}


/**
 * Draws sky and clouds.
 */
function drawSky() {
    for (let i = 0; i < 10; i++) {
        addBackgroundImage(backgroundImages.sky[0], bg_sky_x, bg_element_y, i);
    }
    for (let i = 0; i < 10; i = i + 2) {
        addBackgroundImage(backgroundImages.sky[1], bg_sky_x - cloud_offset, bg_element_y, i);
        addBackgroundImage(backgroundImages.sky[2], bg_sky_x - cloud_offset, bg_element_y, i + 1);
    }
}


/**
 * Draws the three ground layers.
 */
function drawGround() {
    for (let i = 0; i < 10; i = i + 2) {
        addBackgroundImage(backgroundImages.ground[0], bg3_ground_x, bg_element_y, i);
        addBackgroundImage(backgroundImages.ground[1], bg3_ground_x, bg_element_y, i + 1);
    }
    for (let i = 0; i < 10; i = i + 2) {
        addBackgroundImage(backgroundImages.ground[2], bg2_ground_x, bg_element_y, i);
        addBackgroundImage(backgroundImages.ground[3], bg2_ground_x, bg_element_y, i + 1);
    }
    for (let i = 0; i < 10; i = i + 2) {
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


function createChickenList() {
    chickens = [
        createChicken("yellow", 400, chicken_y, 0.4),
        createChicken("brown", 600, chicken_y - 20, 0.45)
    ];
}

function createChicken(type, position_x, position_y, scale) {
    return {
        "type": type,
        "img": chickenImages[type][0],
        "position_x": position_x,
        "position_y": position_y,
        "scale": scale,
        "speed": Math.random() * 5
    };
}

function calculateChicken() {
    setInterval(function () {
        for (let i = 0; i < chickens.length; i++) {
            //Positon
            let chicken = chickens[i];
            chicken.position_x = chicken.position_x - chicken.speed;
        }
    }, 50);
    setInterval(function () {
        for (let i = 0; i < chickens.length; i++) {
            //Image
            let type = chickens[i].type;
            let index = chicken_image_index % chickenImages[type].length;    //without dead chicken image
            chickens[i].img = chickenImages[type][index];
            console.log("chicken_image_index: ", chicken_image_index, "chickens[i]: ", chickens[i], "chickens[i].img", chickens[i].img);
        }
        chicken_image_index++;
    }, 200);
}

/* function calculateChickenPosition() {
    setInterval(function () {
        for (let i = 0; i < chickens.length; i++) {
            let chicken = chickens[i];
            chicken.position_x = chicken.position_x - chicken.speed;
        }
    }, 50);
}

function calculateChickenImage() {
    setInterval(function () {
        for (let i = 0; i < chickens.length; i++) {
            let type = chickens[i].type;
            let index = chicken_walk_index % chickenImages[type].length;    //without dead chicken image
            chickens[i].img = chickenImages[type][index];
            console.log("chicken_walk_index: ", chicken_walk_index, "chickens[i]: ", chickens[i], "chickens[i].img", chickens[i].img);
        }
        chicken_walk_index++;
    }, 150)
}
 */

function drawChicken() {
    for (let i = 0; i < chickens.length; i++) {
        let chicken = chickens[i];
        addObject(chicken.img, chicken.position_x, chicken.position_y, chicken.scale);
    }
}

function addObject(image, start_x, start_y, scale) {
    if (image.complete) {
        ctx.drawImage(image, start_x, start_y, image.width * scale, image.height * scale);
    }
}



/* function drawChicken() {
    createChicken();
}

function createChicken() {
    addObject(chickenImages['yellow'][0], 10);
}

function addObject(image, quantity) {

    for (let i = 0; i < quantity; i++) {

        let playing_field_length = canvas.width * 10;
        let random_number = Math.floor((Math.random() * 100 + 1)); //Zufallszahl zw. 1 und 100
        let random_position = playing_field_length / 100 * random_number;

        if (image.complete) {
            ctx.drawImage(image, random_position, chicken_y, image.width, image.height);
            //console.log("Hühnchen gezeichnet!", "Zufallszahl: ", random_number, "Playing_Field_Length:", playing_field_length, "Zufallsposition: ", random_position);
        }
    }

} */


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
