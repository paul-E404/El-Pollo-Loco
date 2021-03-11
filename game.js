let canvas;
let ctx;
let character_x = 0;
let character_y = 100;
let bg_element_x = 0;
let bg_element_y = 0;
let isMovingRight = false;
let isMovingLeft = false;
let lastJumpStarted = 0;


// ------------------- Game config
//Kostanten werden groß und mit Unterstrich geschrieben. Eine Konstante ist eine Variable, die sich über das ganze Spiel nicht ändert.
let JUMP_TIME = 300;

//Zeichnet das Spielfeld (Startpunkt links oben)
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    draw();

    listenForKeys();
}

function draw() {
    drawBackground();
    updateCharacter();
    //requestAnimationFrame(function): Webbrowser nimmt sich immer genug Ressoucen von der Grafikkarte um diesen Frame zu aktualisieren
    //Alternative zu setInterval, was bei einer framerate von 50 - 100 ms zu starkem Flackern führt
    requestAnimationFrame(draw);
}

function updateCharacter() {
    base_image = new Image();
    base_image.src = 'img/character/idle/I-1.png';
    //base_image.complete: Gibt den Wert true zurück, wenn das Bild fertig geladen ist. Ansonsten false.
    if (base_image.complete) {
        ctx.drawImage(base_image, character_x, character_y, base_image.width * 0.3, base_image.height * 0.3);
    }

    let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
    if (timePassedSinceJump < JUMP_TIME) {
        character_y = character_y - 10;
    } else {
        //Check falling
        if (character_y < 100) {
            character_y = character_y + 10;
        }
    }

}

function drawBackground() {
    if (isMovingRight == true) {
        bg_element_x = bg_element_x - 5;
    }
    if (isMovingLeft == true) {
        bg_element_x = bg_element_x + 5;
    }
    drawSky();
    drawGround();
}

function drawSky() {
    addBackgroundImage('sky_image', 'img/bg/sky/sky.png', bg_element_x, bg_element_y, 1);
}

function drawGround() {
    addBackgroundImage('ground3_image', 'img/bg/ground3/1.png', bg_element_x, bg_element_y, 1);
    addBackgroundImage('ground2_image', 'img/bg/ground2/1.png', bg_element_x, bg_element_y, 1);
    addBackgroundImage('ground1_image', 'img/bg/ground1/1.png', bg_element_x, bg_element_y, 1);
}

function addBackgroundImage(name, src, bg_element_x, bg_element_y, scale) {
    name = new Image();
    name.src = src;
    if(name.complete) {
        ctx.drawImage(name, bg_element_x, bg_element_y, canvas.width * scale, canvas.height * scale); 
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
            character_x = character_x + 5;
        }
        if (key == "ArrowLeft") {
            isMovingLeft = true;
            character_x = character_x - 5;
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
        let key = e.code; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
        //Wenn die rechte Steuerungstaste gedrückt wird, möchten wir die Koordinaten von unserem character updaten
        if (key == "ArrowRight") {
            isMovingRight = false;
            character_x = character_x + 5;
        }
        if (key == "ArrowLeft") {
            isMovingLeft = false;
            character_x = character_x - 5;
        }
    });

}