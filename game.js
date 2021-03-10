let canvas;
let ctx;
let character_x = 0;
let character_y = 100;
let bg_elements_x = 0;
let isMovingRight = false;
let isMovingLeft = false;
let isJumping = false;
let isFalling = false;

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
    base_image.src = '../img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/I-1.png';
    //base_image.complete: Gibt den Wert true zurück, wenn das Bild fertig geladen ist. Ansonsten false.
    if (base_image.complete) {
        ctx.drawImage(base_image, character_x, character_y, base_image.width * 0.3, base_image.height * 0.3);
    }
}

function drawBackground() {
    ctx.fillStyle = "white";
    //Startpunkt: (0,0); Breite; Höhe
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGround();
}

function drawGround() {
    /* ctx.fillStyle = "rgb(251, 213, 101)";
    ctx.fillRect(0, 400, canvas.width, canvas.height-400); */

    if (isMovingRight == true) {
        bg_elements_x = bg_elements_x - 5;
    }
    if (isMovingLeft == true) {
        bg_elements_x = bg_elements_x + 5;
    }
    ground3_image = new Image();
    ground3_image.src = '../img/5.Fondo/Capas/3.Fondo3/1.png';
    if (ground3_image.complete) {
        ctx.drawImage(ground3_image, bg_elements_x, 0, canvas.width, canvas.height);
    }
    ground2_image = new Image();
    ground2_image.src = '../img/5.Fondo/Capas/2.Fondo2/1.png';
    if (ground2_image.complete) {
        ctx.drawImage(ground2_image, bg_elements_x, 0, canvas.width, canvas.height);
    }
    ground1_image = new Image();
    ground1_image.src = '../img/5.Fondo/Capas/1.suelo-fondo1/1.png';
    if (ground1_image.complete) {
        ctx.drawImage(ground1_image, bg_elements_x, 0, canvas.width, canvas.height);
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
        if ((key == "Space" || key == "ArrowUp") && isFalling == false) {
            jump();
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

    function jump() {
        isJumping = true;
        character_y = character_y - 10;
        if(character_y < -50) {
            isJumping = false;
            isFalling = true;
        }
    }
}