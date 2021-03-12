let canvas;
let ctx;
let character_x = 100;
let character_y = 45;
let bg_sky_x = -270;
let bg3_ground_x = -270;
let bg2_ground_x = -270;
let bg1_ground_x = -270;
let bg_element_y = 0;
let isMovingRight = false;
let isMovingLeft = false;
let lastJumpStarted = 0;
let currentCharacterImage = 'img/character/idle/I-1.png';

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


// ------------------- Game config
//Kostanten werden groß und mit Unterstrich geschrieben. Eine Konstante ist eine Variable, die sich über das ganze Spiel nicht ändert.
let JUMP_TIME = 300;
let GAME_SPEED = 7;

//Zeichnet das Spielfeld (Startpunkt links oben)
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    checkForRunning();
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

function showRunningImages(character_walk_images) {
    if (currentCharacterImage == character_walk_images[0]) {
        currentCharacterImage = character_walk_images[1];
    }
    else if (currentCharacterImage == character_walk_images[1]) {
        currentCharacterImage = character_walk_images[2];
    }
    else if (currentCharacterImage == character_walk_images[2]) {
        currentCharacterImage = character_walk_images[3];
    }
    else if (currentCharacterImage == character_walk_images[3]) {
        currentCharacterImage = character_walk_images[4];
    }
    else if (currentCharacterImage == character_walk_images[4]) {
        currentCharacterImage = character_walk_images[5];
    }
    else if (currentCharacterImage == character_walk_images[5]) {
        currentCharacterImage = character_walk_images[0];
    }
    else {
        currentCharacterImage = character_walk_images[0];
    }
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
        character_y = character_y - 10;
    } else {
        //Check falling
        if (character_y < 45) {
            character_y = character_y + 10;
        }
    }

}

function drawBackground() {
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
        addBackgroundImage('clouds1_image', 'img/bg/sky/clouds1.png', bg_sky_x, bg_element_y, i);
        addBackgroundImage('clouds2_image', 'img/bg/sky/clouds2.png', bg_sky_x, bg_element_y, i + 1);
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