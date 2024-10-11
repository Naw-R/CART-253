/**
 * Frogfrogfrog
 * Base Template Creation by : Pippin Barr
 * Improved by : Rowan Nasser
 * 
 * A game of catching flies with your frog-tongue
 * 
 * Basic Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch flies
 * 
 * Additional Instructions : 
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

// Additional Tools for Improving Production
let backgroundMusic;
let frogSound;
let buzzSound;
let powerupSound;

let score = 0; // Initialize score

function preload() {
    backgroundMusic = loadSound('assets/sounds/background.mp3');
    frogSound = loadSound('assets/sounds/frog.mp3');
    buzzSound = loadSound('assets/sounds/buzz.mp3');
    powerupSound = loadSound('assets/sounds/powerup.mp3');
}


// Our frog
const frog = {
    // The frog's body has a position and size
    body: {
        x: 320,
        y: 520,
        size: 150
    },
    // The frog's tongue has a position, size, speed, and state
    tongue: {
        x: undefined,
        y: 480,
        size: 20,
        speed: 20,
        // Determines how the tongue moves each frame
        state: "idle" // State can be: idle, outbound, inbound
    }
};

// Our fly
// Has a position, size, and speed of horizontal movement
const fly = {
    x: 0,
    y: 200, // Will be random
    size: 10,
    speed: 3
};

/**
 * Creates the canvas and initializes the fly
 */
function setup() {
    createCanvas(640, 480);

    // Give the fly its first random position
    resetFly();

    // Play background music --Audio
    backgroundMusic.loop();
    backgroundMusic.setVolume(0.3); // Set initial volume
}

function draw() {
    background("#87ceeb");
    moveFly();
    drawFly();
    moveFrog();
    moveTongue();
    drawFrog();
    checkTongueFlyOverlap();

    displayScore(); // Display the score
}

/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */
function moveFly() {
    // Move the fly
    fly.x += fly.speed;
    // Handle the fly going off the canvas
    if (fly.x > width) {
        resetFly();
    }
}

/**
 * Draws the fly as a black circle
 */
function drawFly() {
    let distance = dist(frog.body.x, frog.body.y, fly.x, fly.y);
    let volume = map(distance, 0, width, 1, 0); // Volume decreases as the fly gets closer
    buzzSound.setVolume(volume);
    if (!buzzSound.isPlaying()) {
        buzzSound.loop();
    }
    push();
    noStroke();
    fill("#000000");
    ellipse(fly.x, fly.y, fly.size);
    pop();
}

/**
 * Resets the fly to the left with a random y
 */
function resetFly() {
    fly.x = 0;
    fly.y = random(0, 300);
}

/**
 * Moves the frog to the mouse position on x
 */
function moveFrog() {
    frog.body.x = mouseX;
}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {
    // Tongue matches the frog's x
    frog.tongue.x = frog.body.x;
    // If the tongue is idle, it doesn't do anything
    if (frog.tongue.state === "idle") {
        // Do nothing
    }
    // If the tongue is outbound, it moves up
    else if (frog.tongue.state === "outbound") {
        frog.tongue.y += -frog.tongue.speed;
        // The tongue bounces back if it hits the top
        if (frog.tongue.y <= 0) {
            frog.tongue.state = "inbound";
        }
    }
    // If the tongue is inbound, it moves down
    else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        // The tongue stops if it hits the bottom
        if (frog.tongue.y >= height) {
            frog.tongue.state = "idle";
        }
    }
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrog() {
    // Draw the tongue tip
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    // Draw the rest of the tongue
    push();
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    // Draw the frog's body
    push();
    fill("#00ff00");
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();
}

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {
    // Get distance from tongue to fly
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size / 2 + fly.size / 2);
    if (eaten) {
        // Reset the fly
        resetFly();
        // Bring back the tongue
        frog.tongue.state = "inbound";

        increaseScore();
        powerupSound.play(); // Play sound effect for catching a fly
    }
}

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function mousePressed() {
    //Additional action to function to make audio play
    if (frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
        frogSound.play(); // Play frog sound when tongue launches
    }
}

/** 
 * Increase the score for the game by speeding up the music playback
*/
function increaseScore() {
    score++;
    let rate = map(score, 0, 20, 1, 1.5);   // Improving the use of "map" function
    backgroundMusic.rate(rate);
}

// New function to display the score on the screen
function displayScore() {
    fill(0); // Black text color
    textSize(24); // Text size
    textAlign(LEFT, TOP); // Align text to the top left
    text(`Score: ${score}`, 10, 10); // Display the score at the top-left corner
}