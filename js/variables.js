let canvas;
let ctx;

let bg_sky_x = -270;
let bg3_ground_x = -270;
let bg2_ground_x = -270;
let bg1_ground_x = -270;
let bg_ground_x_min = -10;    //Verhindert, dass character unendlich nach links laufen kann
let bg_ground_x_max;        //Verhindert, dass character unendlich nach rechts laufen kann
let bg_element_y = 0;
let cloud_offset = 0;

let character_x = 100;
let character_y = 100; //ehem. 45
let character_energy = 30;
let isMovingRight = false;
let isMovingLeft = false;
let lastMove = "right";
let lastJumpStarted = new Date().getTime();
let lastMoveFinished = new Date().getTime();
let currentCharacterImage = new Image;
let character_idle_index = 0;
let character_walk_index = 0;
let character_hurt_index = 0;
let characterDead = false;
let characterDyingStarted = new Date().getTime();

let chickens;
let chicken_y = 365;

let placedBottles = [2400, 3900, 5500, 6000, 7300, 8000, 8500, 9150, 10250, 11000];
let collectedBottles = 100;
let lastThrowStarted = new Date().getTime();
let thrown_bottle_x;
let thrown_bottle_y;
let bottle_rotate_index = 0;
let broken_bottle_x;
let broken_bottle_y;

let currentBossImage = new Image;
let boss_x = 500;
let boss_y = 105;
let boss_energy = 100;
let bossSpeed = 500;
let boss_walk_index = 0;
let boss_hit_index = 0;
let boss_attack_index = 0;
let boss_angry_index = 0;
let bossMovingLeft = true;
let bossMovingRight = false;
let bossFallingUp = true;
let bossWalk = true;
let firstBossHit = false;
let bossAlmostDead = false;
let bossDead = false;
let lastHitStarted = new Date().getTime();
let bossDyingStarted = new Date().getTime();

let currentSauceImage = new Image;



// ------------------- Game config
//Kostanten werden groß und mit Unterstrich geschrieben. Eine Konstante ist eine Variable, die sich über das ganze Spiel nicht ändert.
const PLAYING_FIELD_LENGTH = 15;
const JUMP_TIME = 400;
const GAME_SPEED = 7;
const CLOUD_SPEED = 0.2;
const MIN_CHICKEN_SPEED = 2;
const THROW_TIME = 1400;
const BOTTLE_BREAK_TIME = 500;
const BOSS_HIT_TIME = 500;
const BOSS_DYING_TIME = 2000;
const CHARACTER_DYING_TIME = 500;

const AUDIO_MEXICAN_SONG = new Audio('audio/mexican_song.mp3');
const AUDIO_CHARACTER_RUNNING = new Audio('audio/character_running.mp3');
const AUDIO_CHARACTER_JUMPING = new Audio('audio/character_jumping.mp3');
const AUDIO_CHARACTER_SNORING = new Audio('audio/character_snoring.mp3');
const AUDIO_CHARACTER_HURT = new Audio('audio/character_hurt.mp3')
const AUDIO_CHARACTER_DEAD = new Audio('audio/character_dead.mp3');
const AUDIO_CHICKEN_CROWD = new Audio('audio/chicken_crowd.mp3');
const AUDIO_CHICKEN_SINGLE = new Audio('audio/chicken_single.mp3');
const AUDIO_CHICKEN_SCREAM = new Audio('audio/chicken_single_scream.mp3');
const AUDIO_BOTTLE_COLLECT = new Audio('audio/bottle_collect.mp3');
const AUDIO_BOTTLE_THROW = new Audio('audio/bottle_throw.mp3');
const AUDIO_BOTTLE_BREAK = new Audio('audio/bottle_break.mp3');
const AUDIO_BOSS_HIT = new Audio ('audio/boss_hit.mp3');
const AUDIO_BOSS_ANGRY = new Audio ('audio/boss_angry.mp3');
const AUDIO_BOSS_DEAD = new Audio ('audio/boss_dead.mp3');
const AUDIO_EXPLOSION = new Audio ('audio/explosion.mp3');


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
    ],
    throw: [
        [
            'img/character/throw/Tl-60.png'
        ],
        [
            'img/character/throw/Tr-60.png'
        ]
    ],
    dead: [
        [
            'img/character/dead/Dl-51.png',
            'img/character/dead/Dl-52.png',
            'img/character/dead/Dl-53.png',
            'img/character/dead/Dl-54.png',
            'img/character/dead/Dl-55.png',
            'img/character/dead/Dl-56.png'
        ],
        [
            'img/character/dead/Dr-51.png',
            'img/character/dead/Dr-52.png',
            'img/character/dead/Dr-53.png',
            'img/character/dead/Dr-54.png',
            'img/character/dead/Dr-55.png',
            'img/character/dead/Dr-56.png'
        ]
    ]
};


let bossImages = {
    walk: [
        ['img/enemies/boss/walk/Gl-1.png',
            'img/enemies/boss/walk/Gl-2.png',
            'img/enemies/boss/walk/Gl-3.png',
            'img/enemies/boss/walk/Gl-4.png'],
        ['img/enemies/boss/walk/Gr-1.png',
            'img/enemies/boss/walk/Gr-2.png',
            'img/enemies/boss/walk/Gr-3.png',
            'img/enemies/boss/walk/Gr-4.png']
    ],
    hurt: [
        ['img/enemies/boss/hurt/Gl-21.png',
            'img/enemies/boss/hurt/Gl-22.png'],
        ['img/enemies/boss/hurt/Gr-21.png',
            'img/enemies/boss/hurt/Gr-22.png']
    ],
    attack: [
        ['img/enemies/boss/attack/Gl-13.png',
            'img/enemies/boss/attack/Gl-14.png',
            'img/enemies/boss/attack/Gl-15.png',
            'img/enemies/boss/attack/Gl-16.png',
            'img/enemies/boss/attack/Gl-17.png',
            'img/enemies/boss/attack/Gl-18.png',
            'img/enemies/boss/attack/Gl-19.png',
            'img/enemies/boss/attack/Gl-20.png'],
        ['img/enemies/boss/attack/Gr-13.png',
            'img/enemies/boss/attack/Gr-14.png',
            'img/enemies/boss/attack/Gr-15.png',
            'img/enemies/boss/attack/Gr-16.png',
            'img/enemies/boss/attack/Gr-17.png',
            'img/enemies/boss/attack/Gr-18.png',
            'img/enemies/boss/attack/Gr-19.png',
            'img/enemies/boss/attack/Gr-20.png']
    ],
    angry: [
        ['img/enemies/boss/angry/GAl-13.png',
            'img/enemies/boss/angry/GAl-17.png',
            'img/enemies/boss/angry/GAl-18.png',
            'img/enemies/boss/angry/GAl-19.png'],
        ['img/enemies/boss/angry/GAr-13.png',
            'img/enemies/boss/angry/GAr-17.png',
            'img/enemies/boss/angry/GAr-18.png',
            'img/enemies/boss/angry/GAr-19.png']
    ],
    dead: [
        ['img/enemies/boss/dead/Gl-24.png',
            'img/enemies/boss/dead/Gl-25.png',
            'img/enemies/boss/dead/Gl-26.png'],
        ['img/enemies/boss/dead/Gr-24.png',
            'img/enemies/boss/dead/Gr-25.png',
            'img/enemies/boss/dead/Gr-26.png']
    ]
}


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


//Image Object with all object images
let objectImages = {
    display: [
        'img/objects/heart.png',
        'img/objects/coin.png',
        'img/objects/bottle.png',
        'img/objects/boss.png'
    ],
    bottles: [
        'img/objects/bottle/bottle_left.png',
        'img/objects/bottle/bottle_up.png',
        'img/objects/bottle/bottle_right.png',
        'img/objects/bottle/bottle_down.png'
    ],
    sauce: [
        'img/objects/sauce/sauce1.png',
        'img/objects/sauce/sauce2.png',
        'img/objects/sauce/sauce3.png',
        'img/objects/sauce/sauce4.png',
        'img/objects/sauce/sauce5.png',
        'img/objects/sauce/sauce6.png'
    ]
}