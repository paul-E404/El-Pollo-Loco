/**
 * Listens for keys being pressed or released.
 */
function listenForKeys() {
    //e stands for event
    //The event (keyboardevent) is a JSON which contains all information about a pressed key.
    //To see the full event (JSON), log out:
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

        //user can no longer make any movements when game is lost
        if (gameLost != true) {
            //e.code bedeutet, ich möchte von dem JSON Event des keys namens "code" den value und dieser ist "ArrowRight" etc.
            let key = e.code; // z.B. "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"

            if (key == "ArrowRight") {
                startWalkRight();
            }
            if (key == "ArrowLeft") {
                startWalkLeft();
            }
            //Not until jump time is over, a new jump can be started.
            //So the time since last jump has to be longer than jump time.
            //JUMP_TIME * 2 => character jumps one JUMP_TIME up and falls one JUMP_TIME down.
            if ((key == "Space" || key == "ArrowUp") && timePassedSinceJump > JUMP_TIME * 2) {
                startJump();
            }
            if (key == "KeyD") {
                startThrow();
            }
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
            finishWalkRight();
        }
        if (key == "ArrowLeft") {
            finishWalkLeft();
        }
        if (key == "Space" || key == "ArrowUp") {
            lastMoveFinished = new Date().getTime();
        }
        if (key == "KeyD") {
            lastMoveFinished = new Date().getTime();
        }
    });
}

/**
 * Listens for touch-control-buttons being touched.
 */
function listenForTouch() {

    //select control buttons
    let arrowLeft = document.getElementById('touch-arrow-left');
    let arrowRight = document.getElementById('touch-arrow-right');
    let arrowUp = document.getElementById('touch-arrow-up');
    let arrowThrow = document.getElementById('touch-arrow-throw');

    //add event listener (touch)
    arrowLeft.addEventListener("touchstart", leftTouchStart, false);
    arrowLeft.addEventListener("touchend", leftTouchEnd, false);
    arrowLeft.addEventListener("touchleave", leftTouchLeave, false);

    arrowRight.addEventListener("touchstart", rightTouchStart, false);
    arrowRight.addEventListener("touchend", rightTouchEnd, false);
    arrowRight.addEventListener("touchleave", rightTouchLeave, false);

    arrowUp.addEventListener("touchstart", jumpTouchStart, false);
    arrowUp.addEventListener("touchend", jumpTouchEnd, false);

    arrowThrow.addEventListener("touchstart", throwTouchStart, false);
    arrowThrow.addEventListener("touchend", throwTouchEnd, false);

    //define touch functions
    //For reasons of clarity, I didn't put the start- and finish-functions directly into addEventListener-functions.
    function leftTouchStart() {
        startWalkLeft();
    }
    function leftTouchEnd() {
        finishWalkLeft();
    }
    function leftTouchLeave() {
        finishWalkLeft();
    }
    function rightTouchStart() {
        startWalkRight();
    }
    function rightTouchEnd() {
        finishWalkRight();
    }
    function rightTouchLeave() {
        finishWalkRight();
    }
    function jumpTouchStart() {
        if (timePassedSinceJump > JUMP_TIME * 2) {
            startJump();
        }
    }
    function jumpTouchEnd() {
        lastMoveFinished = new Date().getTime();
    }
    function throwTouchStart() {
        startThrow();
    }
    function throwTouchEnd() {
        lastMoveFinished = new Date().getTime();
    }
    
}

/**
 * Controls the character to go to the right.
 */
function startWalkRight() {
    isMovingRight = true;
    lastMove = "right";
}

/**
 * Controls the character to finish walking to the right. 
 */
function finishWalkRight() {
    isMovingRight = false;
    lastMoveFinished = new Date().getTime();
}

/**
 * Controls the character to go to the left.
 */
function startWalkLeft() {
    isMovingLeft = true;
    lastMove = "left";
}

/**
 * Controls the character to finish walking to the left. 
 */
function finishWalkLeft() {
    isMovingLeft = false;
    lastMoveFinished = new Date().getTime();
}

/**
 * Controls the character to start a jump.
 */
function startJump() {
    lastJumpStarted = new Date().getTime();         //Unix Timestamp
    checkJumpDirection();
    AUDIO_CHARACTER_JUMPING.play();
    AUDIO_CHARACTER_SNORING.pause();
}

/**
 * Controls the character to start throwing a bottle.
 */
function startThrow() {
    if (collectedBottles > 0) {
        //Ensures that a new throw can only be started when the old one has finished.
        if (timePassedSinceThrow > THROW_TIME) {
            lastThrowStarted = new Date().getTime();
            collectedBottles--;
            if (lastMove == 'left') {
                bottleThrowingDirection = 'left';
            } else if (lastMove == 'right') {
                bottleThrowingDirection = 'right';
            }
        }
    }
}

/* Source: https://stackoverflow.com/questions/3413683/disabling-the-context-menu-on-long-taps-on-android/28748222 */
/**
 * Prevents mobile devices from opening a window on touch long.
 */
function preventLongTouchMenu() {
    let arrowLeft = document.getElementById('touch-arrow-left');
    let arrowRight = document.getElementById('touch-arrow-right');
    let arrowUp = document.getElementById('touch-arrow-up');
    let arrowThrow = document.getElementById('touch-arrow-throw');
    preventLongTouchButton(arrowLeft);
    preventLongTouchButton(arrowRight);
    preventLongTouchButton(arrowUp);
    preventLongTouchButton(arrowThrow);
}

function preventLongTouchButton(node) {
    node.ontouchstart = absorbEvent_;
    node.ontouchmove = absorbEvent_;
    node.ontouchend = absorbEvent_;
    node.ontouchcancel = absorbEvent_;
}

function absorbEvent_(event) {
    var e = event || window.event;
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
}