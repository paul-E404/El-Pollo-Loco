let canvas;
let ctx;
let character_x = 100;
let character_y = 45;
let bg_sky_x = -270;
let bg3_ground_x = -270;
let bg2_ground_x = -270;
let bg1_ground_x = -270;
let bg_element_y = 0;
let cloud_offset = 0;
let isMovingRight = false;
let isMovingLeft = false;
let lastMove = "right";             //left or right
let lastJumpStarted = new Date().getTime();
let lastMoveFinished = new Date().getTime();
let timePassedSinceJump;    //unter Vorbehalt. Ggf. wieder entfernen hier oben.  
let currentCharacterImage = new Image;
let character_idle_index = 0;
let character_walk_index = 0;

/* let character_idle_right_images = [
    'img/character/idle/Ir-1.png',
    'img/character/idle/Ir-2.png',
    'img/character/idle/Ir-3.png',
    'img/character/idle/Ir-4.png',
    'img/character/idle/Ir-5.png',
    'img/character/idle/Ir-6.png',
    'img/character/idle/Ir-7.png',
    'img/character/idle/Ir-8.png',
    'img/character/idle/Ir-9.png',
    'img/character/idle/Ir-10.png'
]

let character_idle_left_images = [
    'img/character/idle/Il-1.png',
    'img/character/idle/Il-2.png',
    'img/character/idle/Il-3.png',
    'img/character/idle/Il-4.png',
    'img/character/idle/Il-5.png',
    'img/character/idle/Il-6.png',
    'img/character/idle/Il-7.png',
    'img/character/idle/Il-8.png',
    'img/character/idle/Il-9.png',
    'img/character/idle/Il-10.png'
]

let character_walk_right_images = [
    'img/character/walk/Wr-21.png',
    'img/character/walk/Wr-22.png',
    'img/character/walk/Wr-23.png',
    'img/character/walk/Wr-24.png',
    'img/character/walk/Wr-25.png',
    'img/character/walk/Wr-26.png'
]

let character_walk_left_images = [
    'img/character/walk/Wl-21.png',
    'img/character/walk/Wl-22.png',
    'img/character/walk/Wl-23.png',
    'img/character/walk/Wl-24.png',
    'img/character/walk/Wl-25.png',
    'img/character/walk/Wl-26.png'
]

let character_jump_right_images = [
    'img/character/jump/Jr-31.png',
    'img/character/jump/Jr-32.png',
    'img/character/jump/Jr-33.png'
]

let character_jump_left_images = [
    'img/character/jump/Jl-31.png',
    'img/character/jump/Jl-32.png',
    'img/character/jump/Jl-33.png'
]

let character_sleep_right_images = [
    'img/character/sleep/Sr-11.png',
    'img/character/sleep/Sr-12.png',
    'img/character/sleep/Sr-13.png',
    'img/character/sleep/Sr-14.png',
    'img/character/sleep/Sr-15.png',
    'img/character/sleep/Sr-16.png',
    'img/character/sleep/Sr-17.png',
    'img/character/sleep/Sr-18.png',
    'img/character/sleep/Sr-19.png',
    'img/character/sleep/Sr-20.png'
]

let character_sleep_left_images = [
    'img/character/sleep/Sl-11.png',
    'img/character/sleep/Sl-12.png',
    'img/character/sleep/Sl-13.png',
    'img/character/sleep/Sl-14.png',
    'img/character/sleep/Sl-15.png',
    'img/character/sleep/Sl-16.png',
    'img/character/sleep/Sl-17.png',
    'img/character/sleep/Sl-18.png',
    'img/character/sleep/Sl-19.png',
    'img/character/sleep/Sl-20.png'
]

let character_hurt_right_images = [
    'img/character/hurt/Hr-41.png',
    'img/character/hurt/Hr-42.png',
    'img/character/hurt/Hr-43.png'
]

let character_hurt_left_images = [
    'img/character/hurt/Hl-41.png',
    'img/character/hurt/Hl-42.png',
    'img/character/hurt/Hl-43.png'
] */

//Objekt (Mihais Ansatz)
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

//#############################################################################################

//Ziel dieser Funktion ist es, jeden Pfadeintrag des Objektes characterImages durch das entsprechende Bildobjekt zu ersetzen und es dadurch vorzuladen.
//Gibt jedes Element des Objekts "characterImages" aus, d.h. den Pfad.
//x ist die Anzahl der Elemente im Objekt
//y ist die Wahl zwischen left und right
//z ist die Anzahl der Elemente in einem spezifischen Array, z.B. 6 Elemente im Array walk-left (da dort 6 Bilder vorhanden).
function preloadImages() {

    for (let x = 0; x < Object.keys(characterImages).length; x++) {  
        for(let y = 0; y < characterImages[Object.keys(characterImages)[x]].length; y++) {
            for (let z = 0; z < characterImages[Object.keys(characterImages)[x]][y].length; z++) {
                //Catch every entry (img-path) in characterImages object
                let path = characterImages[Object.keys(characterImages)[x]][y][z];
                console.log("Der Pfad ist: ", path);
                let image = new Image();
                image.src = path;
                //Save entries with img-Objects back to characterImages object
                characterImages[Object.keys(characterImages)[x]][y][z] = image;
            }
        }
    }
}


// ------------------- Game config
//Kostanten werden groß und mit Unterstrich geschrieben. Eine Konstante ist eine Variable, die sich über das ganze Spiel nicht ändert.
let JUMP_TIME = 400;
let GAME_SPEED = 7;
let CLOUD_SPEED = 0.2;

//Alte preloadFunktion. Kann gelöscht werden, sobald  die neue funktioniert.

/* function preloadImages() {

    for (let i = 0; i < imagePaths.length; i++) {
        let image = new Image();
        image.src = imagePaths[i];
        imageCache.push(image); // push image-path to imageCache-array (which contains all image-paths)
    }

}

function getImageFromCache(path) {

    let image;

    for (let i = 0; i < imageCache.length; i++) {
        if (imageCache[i]['src'].endsWith(path) == true) {
            image = imageCache[i];
        };
    }

    return image;

} */


//Zeichnet das Spielfeld (Startpunkt links oben)
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    preloadImages();
    checkForRelaxing();
    checkForRunning();
    draw();
    listenForKeys();
}

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

function showRunningImages(currentImages) {
    //Modulorechnung sorgt dafür, dass der Index immer von 0 bis zur Länge des Arrays durch das Array iteriert.
    //Der Counter am Ende setzt den Index immer +1 nach oben.
    //if(timePassedSinceJump > JUMP_TIME * 2): Damit sich Sprung und Laufanimation nicht überlagern.
    if (timePassedSinceJump > JUMP_TIME * 2) {
        let index = character_walk_index % currentImages.length;
        currentCharacterImage = currentImages[index];
        character_walk_index++;
    }

}

function checkForRelaxing() {
    setInterval(function () {
        let currentTime = new Date().getTime();
        let timePassedSinceLastMove = currentTime - lastMoveFinished;
        if (isMovingLeft == false && isMovingRight == false) {
            if (timePassedSinceJump > JUMP_TIME * 3 && timePassedSinceJump <= JUMP_TIME * 20 || timePassedSinceLastMove > JUMP_TIME * 2 && timePassedSinceLastMove < JUMP_TIME * 20) {
                checkRelaxingDirection();
            }
            else if (timePassedSinceJump > JUMP_TIME * 3 && timePassedSinceLastMove > JUMP_TIME * 20) {
                checkSleepingDirection();
            }
        }
    }, 300);
}

function checkRelaxingDirection() {
    if (lastMove == "right") {
        let currentImages = characterImages['idle'][1];
        relax(currentImages);
    }
    else {
        let currentImages = characterImages['idle'][0];
        relax(currentImages);
    }
}

function relax(currentImages) {
    let index = character_idle_index % currentImages.length;
    currentCharacterImage = currentImages[index];
    character_idle_index++;
}


function checkSleepingDirection() {
    if (lastMove == "right") {
        let currentImages = characterImages['sleep'][1];
        sleep(currentImages);
    }
    else {
        let currentImages = characterImages['sleep'][0];
        sleep(currentImages);
    }
}


function sleep(currentImages) {
    let index = character_idle_index % currentImages.length;
    currentCharacterImage = currentImages[index];
    character_idle_index++;
}


function draw() {
    //Verhindert dass die Hintergrundbilder mehrfach angezeigt werden. Kann ggf. am Ende entfernt werden.
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    updateCharacter();
    //requestAnimationFrame(function): Webbrowser nimmt sich immer genug Ressoucen von der Grafikkarte um diesen Frame zu aktualisieren
    //Alternative zu setInterval, was bei einer framerate von 50 - 100 ms zu starkem Flackern führt
    requestAnimationFrame(draw);
}



function updateCharacter() {
    let character_image = currentCharacterImage;

    //character_image.complete: Gibt den Wert true zurück, wenn das Bild fertig geladen ist. Ansonsten false.
    if (character_image.complete) {
        ctx.drawImage(character_image, character_x, character_y, character_image.width * 0.35, character_image.height * 0.35);
    }

    timePassedSinceJump = new Date().getTime() - lastJumpStarted;
    if (timePassedSinceJump < JUMP_TIME) {
        character_y = character_y - 10;
    }
    else if (timePassedSinceJump < JUMP_TIME * 2) {
        //Check falling
        if (character_y < 45) {
            character_y = character_y + 10;
        }
    }
}

function drawBackground() {

    cloud_offset = cloud_offset + CLOUD_SPEED;

    if (isMovingRight == true) {
        bg3_ground_x = bg3_ground_x - GAME_SPEED * 0.2;
        bg2_ground_x = bg2_ground_x - GAME_SPEED * 0.4;
        bg1_ground_x = bg1_ground_x - GAME_SPEED;
        bg_sky_x = bg_sky_x - GAME_SPEED * 0.1;
    }
    if (isMovingLeft == true) {
        bg3_ground_x = bg3_ground_x + GAME_SPEED * 0.5;
        bg2_ground_x = bg2_ground_x + GAME_SPEED * 0.8;
        bg1_ground_x = bg1_ground_x + GAME_SPEED;
        bg_sky_x = bg_sky_x + GAME_SPEED * 0.1;
    }
    drawSky();
    drawGround();
}

function drawSky() {
    for (let i = 0; i < 10; i++) {
        addBackgroundImage('sky_image', 'img/bg/sky/sky.png', bg_sky_x, bg_element_y, i);
    }
    for (let i = 0; i < 10; i = i + 2) {
        addBackgroundImage('clouds1_image', 'img/bg/sky/clouds1.png', bg_sky_x - cloud_offset, bg_element_y, i);
        addBackgroundImage('clouds2_image', 'img/bg/sky/clouds2.png', bg_sky_x - cloud_offset, bg_element_y, i + 1);
    }
}

function drawGround() {
    for (let i = 0; i < 10; i = i + 2) {
        addBackgroundImage('ground3.1_image', 'img/bg/ground3/1.png', bg3_ground_x, bg_element_y, i);
        addBackgroundImage('ground3.2_image', 'img/bg/ground3/2.png', bg3_ground_x, bg_element_y, i + 1);
    }
    for (let i = 0; i < 10; i = i + 2) {
        addBackgroundImage('ground2.1_image', 'img/bg/ground2/1.png', bg2_ground_x, bg_element_y, i);
        addBackgroundImage('ground2.2_image', 'img/bg/ground2/2.png', bg2_ground_x, bg_element_y, i + 1);
    }
    for (let i = 0; i < 10; i = i + 2) {
        addBackgroundImage('ground1.1_image', 'img/bg/ground1/1.png', bg1_ground_x, bg_element_y, i);
        addBackgroundImage('ground1.2_image', 'img/bg/ground1/2.png', bg1_ground_x, bg_element_y, i + 1);
    }
}

function addBackgroundImage(name, path, bg_element_x, bg_element_y, scale) {
    name = new Image();
    name.src = path;
    if (name.complete) {
        ctx.drawImage(name, bg_element_x + canvas.width * scale, bg_element_y, canvas.width, canvas.height);
    }
}

//Registriert wenn eine Taste gedrückt wird und kann dann eine Funktion aufrufen.
function listenForKeys() {
    //e steht für event
    //Das Event (Keyboardevent) ist ein JSON, in dem sich alle Informationen zu einer gedrückten Taste befinden.
    //Um sich das komplette Event (JSON) anzeigen zu lassen
    //console.log(e);
    document.addEventListener('keydown', function (e) {
        //e.key bedeutet, ich möchte von dem JSON Event des keys namens "code" den value und dieser ist "ArrowRight" etc.
        let key = e.code; // z.B. "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
        //Wenn die rechte Steuerungstaste gedrückt wird, möchten wir die Koordinaten von unserem character updaten
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

    //Wenn die Taste losgelassen wird...
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
    });

}

function checkJumpDirection() {
    if (lastMove == "right") {
        let currentImages = characterImages['jump'][1];
        animateJump(currentImages);
    }
    else {
        let currentImages = characterImages['jump'][0];
        animateJump(currentImages);
    }
}

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
