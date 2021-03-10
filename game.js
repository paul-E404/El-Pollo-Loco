let canvas;
let ctx;
let character_x = 0;

//Zeichnet das Spielfeld (Startpunkt links oben)
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    setInterval(function() {
        drawBackground();
        updateCharacter();
    }, 100);
    listenForKeys();
}

function updateCharacter() {
    base_image = new Image();
    base_image.src = 'img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/I-1.png';
    base_image.onload = function () {
        ctx.drawImage(base_image, character_x, 100, base_image.width * 0.3, base_image.height * 0.3);
    }
}

function drawBackground() {
    ctx.fillStyle = "white";
    //Startpunkt: (0,0); Breite; Höhe
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGround();
}

function drawGround() {
    ctx.fillStyle = "rgb(251, 213, 101)";
    ctx.fillRect(0, 400, canvas.width, canvas.height-400);
}

//Registriert wenn eine Taste gedrückt wird und kann dann eine Funktion aufrufen.
function listenForKeys() {
    //e steht für event
    document.addEventListener('keydown', function(e) {
        const key = e.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
        console.log(key == "ArrowRight");
        //Wenn die rechte Steuerungstaste gedrückt wird, möchten wir die Koordinaten von unserem character updaten
        if(key == "ArrowRight") {
            character_x = character_x + 5;
        }
        if(key == "ArrowLeft") {
            character_x = character_x - 5;
        }
    });
}