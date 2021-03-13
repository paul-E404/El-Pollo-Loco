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
let isJumping = false;
let lastJumpStarted = 0;
let currentCharacterImage = 'img/character/idle/Ir-1.png';
let character_walk_index = 0;
let character_jump_index = 0;
let character_fall_index = 0;

let character_idle_right_images = [
    'img/character/idle/Ir-1.png',
    'img/character/idle/Ir-2.png',
    'img/character/idle/Ir-3.png',
    'img/character/idle/Ir-4.png',
    'img/character/idle/Ir-5.png',
    'img/character/idle/Ir-6.png',
    'img/character/idle/Ir-7.png',
    'img/character/idle/Ir-8.png',
    'img/character/idle/Ir-9.png',
    'img/character/idle/Ir-10.png',
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
    'img/character/idle/Il-10.png',
]

let character_walk_right_images = [
    'img/character/walk/Wr-21.png',
    'img/character/walk/Wr-22.png',
    'img/character/walk/Wr-23.png',
    'img/character/walk/Wr-24.png',
    'img/character/walk/Wr-25.png',
    'img/character/walk/Wr-26.png',
]

let character_walk_left_images = [
    'img/character/walk/Wl-21.png',
    'img/character/walk/Wl-22.png',
    'img/character/walk/Wl-23.png',
    'img/character/walk/Wl-24.png',
    'img/character/walk/Wl-25.png',
    'img/character/walk/Wl-26.png',
]

let character_jump_right_images = [
    'img/character/jump/Jr-31.png',
    'img/character/jump/Jr-32.png',
    'img/character/jump/Jr-33.png',
    'img/character/jump/Jr-34.png'
]

let character_jump_left_images = [
    'img/character/jump/Jl-31.png',
    'img/character/jump/Jl-32.png',
    'img/character/jump/Jl-33.png',
    'img/character/jump/Jl-34.png'
]

let character_fall_right_images = [
    'img/character/jump/Jr-35.png',
    'img/character/jump/Jr-36.png',
    'img/character/jump/Jr-37.png',
    'img/character/jump/Jr-38.png'
]

let character_fall_left_images = [
    'img/character/jump/Jl-35.png',
    'img/character/jump/Jl-36.png',
    'img/character/jump/Jl-37.png',
    'img/character/jump/Jl-38.png'
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
    'img/character/sleep/Sr-20.png',
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
    'img/character/sleep/Sl-20.png',
]

let character_hurt_right_images = [
    'img/character/hurt/Hr-41.png',
    'img/character/hurt/Hr-42.png',
    'img/character/hurt/Hr-43.png',
]

let character_hurt_left_images = [
    'img/character/hurt/Hl-41.png',
    'img/character/hurt/Hl-42.png',
    'img/character/hurt/Hl-43.png',
]


// ------------------- Game config
//Kostanten werden groß und mit Unterstrich geschrieben. Eine Konstante ist eine Variable, die sich über das ganze Spiel nicht ändert.
let JUMP_TIME = 300;
let GAME_SPEED = 7;
let CLOUD_SPEED = 0.2;

//Zeichnet das Spielfeld (Startpunkt links oben)
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    checkForRunning();
    checkForJumping();
    draw();
    listenForKeys();
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

function checkForRunning() {
    setInterval(function () {
        /* console.log("checkForRunning() wird ausgeführt. isMovingRight: ", isMovingRight, "character_walk_index", character_walk_index); */
        if (isMovingRight == true) {
            let character_walk_images = character_walk_right_images;
            showRunningImages(character_walk_images);
        }
        else if (isMovingLeft == true) {
            let character_walk_images = character_walk_left_images;
            showRunningImages(character_walk_images);
        }
    }, 100);
}

function checkForJumping() {
    setInterval(function() {

        if (isJumping == true) {
            console.log("checkForJumping() wird ausgeführt. isJumping: ", isJumping, "character_jump_index", character_jump_index);
            let character_jump_images = character_jump_right_images;
            showJumpingImages(character_jump_images);
            console.log("character_jump_images: ", character_jump_images);
        }
        else if (isJumping == false) {
            console.log("checkForJumping() wird ausgeführt. isJumping: ", isJumping, "character_jump_index", character_jump_index);
        }
    }, 100);
}

function showRunningImages(character_walk_images) {
    //Modulorechnung sorgt dafür, dass der Index immer von 0 bis zur Länge des Arrays durch das Array iteriert.
    //Der Counter am Ende setzt den Index immer +1 nach oben.
    let index = character_walk_index % character_walk_images.length;
    currentCharacterImage = character_walk_images[index];
    character_walk_index++;
}

function showJumpingImages(character_jump_images) {
    console.log("showJumpingImages() wird ausgeführt. isJumping: ", isJumping);
    let index = character_jump_index % character_jump_images.length;
    currentCharacterImage = character_jump_images[index];
    character_jump_index++;
}

function updateCharacter() {
    base_image = new Image();
    base_image.src = currentCharacterImage;
    //base_image.complete: Gibt den Wert true zurück, wenn das Bild fertig geladen ist. Ansonsten false.
    if (base_image.complete) {
        ctx.drawImage(base_image, character_x, character_y, base_image.width * 0.35, base_image.height * 0.35);
    }

    let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
    if (timePassedSinceJump < JUMP_TIME) {
        isJumping = true;
        character_y = character_y - 10;
    } else {
        //Check falling
        isJumping = false;
        /* console.log("isJumping: ", isJumping); */
        if (character_y < 45) {
            character_y = character_y + 10;
        }
    }
}

function showJumpingImages() {

}

function showFallingImages() {

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
    /*     addBackgroundImage('sky_image', 'img/bg/sky/sky.png', bg_sky_x, bg_element_y, 0);
        addBackgroundImage('sky_image', 'img/bg/sky/sky.png', bg_sky_x, bg_element_y, 1);
        addBackgroundImage('sky_image', 'img/bg/sky/clouds1.png', bg_sky_x, bg_element_y, 0);
        addBackgroundImage('sky_image', 'img/bg/sky/clouds2.png', bg_sky_x, bg_element_y, 1); */
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
    /*  addBackgroundImage('ground3.1_image', 'img/bg/ground3/1.png', bg3_ground_x, bg_element_y, 0);
     addBackgroundImage('ground3.2_image', 'img/bg/ground3/2.png', bg3_ground_x, bg_element_y, 1);
     addBackgroundImage('ground3.1_image', 'img/bg/ground3/1.png', bg3_ground_x, bg_element_y, 2);
     addBackgroundImage('ground3.2_image', 'img/bg/ground3/2.png', bg3_ground_x, bg_element_y, 3);
     addBackgroundImage('ground2.1_image', 'img/bg/ground2/1.png', bg2_ground_x, bg_element_y, 0);
     addBackgroundImage('ground2.2_image', 'img/bg/ground2/2.png', bg2_ground_x, bg_element_y, 1);
     addBackgroundImage('ground2.1_image', 'img/bg/ground2/1.png', bg2_ground_x, bg_element_y, 2);
     addBackgroundImage('ground2.2_image', 'img/bg/ground2/2.png', bg2_ground_x, bg_element_y, 3);
     addBackgroundImage('ground1.1_image', 'img/bg/ground1/1.png', bg1_ground_x, bg_element_y, 0);
     addBackgroundImage('ground1.2_image', 'img/bg/ground1/2.png', bg1_ground_x, bg_element_y, 1);
     addBackgroundImage('ground1.1_image', 'img/bg/ground1/1.png', bg1_ground_x, bg_element_y, 2);
     addBackgroundImage('ground1.2_image', 'img/bg/ground1/2.png', bg1_ground_x, bg_element_y, 3); */
}

function addBackgroundImage(name, src, bg_element_x, bg_element_y, scale) {
    name = new Image();
    name.src = src;
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
            /* character_x = character_x + 5; */
        }
        if (key == "ArrowLeft") {
            isMovingLeft = true;
            /* character_x = character_x - 5; */
        }

        let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
        //Erst wenn die JUMP TIME vorüber ist, darf ein neuer Sprung begonnen werden.
        //Daher muss die Zeit seit dem letzten Sprung größer als die Sprungzeit sein (also außerhalb dieser Zeit liegen).
        //JUMP_TIME * 2, da wir JUMP_TIME hochspringen und JUMP_TIME runterfallen (ein Sprung).
        if ((key == "Space" || key == "ArrowUp") && timePassedSinceJump > JUMP_TIME * 2) {
            lastJumpStarted = new Date().getTime();         //Unix Timestamp
            /* console.log("isJumping: ", isJumping); */
        }
    });

    //Wenn die Taste losgelassen wird...
    document.addEventListener('keyup', function (e) {
        let key = e.code;
        if (key == "ArrowRight") {
            isMovingRight = false;
            /* character_x = character_x + 5; */
        }
        if (key == "ArrowLeft") {
            isMovingLeft = false;
            /* character_x = character_x - 5; */
        }
    });

}