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
let chickens;
let chicken_y = 365;

// ------------------- Game config
//Kostanten werden groß und mit Unterstrich geschrieben. Eine Konstante ist eine Variable, die sich über das ganze Spiel nicht ändert.
const PLAYING_FIELD_LENGTH = 15;
const JUMP_TIME = 400;
const GAME_SPEED = 7;
const CLOUD_SPEED = 0.2;
const MIN_CHICKEN_SPEED = 2;
const AUDIO_CHARACTER_RUNNING = new Audio('audio/character_running.mp3');
const AUDIO_CHARACTER_JUMPING = new Audio('audio/character_jumping.mp3');
const AUDIO_CHARACTER_SNORING = new Audio('audio/character_snoring.mp3');
const AUDIO_CHICKEN_CROWD = new Audio ('audio/chicken_crowd.mp3');
const AUDIO_CHICKEN_SINGLE = new Audio ('audio/chicken_single.mp3');


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