// This is in script.js
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

let mouseMovedRecently = false; // Track if the mouse moved recently

let particles = [];

/**
 * Detect mouse movement to set the flag.
 */
function mouseMoved() {
    mouseMovedRecently = true; // Mouse has moved
}


// Initial configuration of the audio player
function preload() {
    preloadAudio(); // Call from audio.js to load sounds
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
    },
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
 *  Initial state of the canvas, fly, audio, clouds and timer
 */
function setup() {
    createCanvas(640, 480);

    // Give the fly its first random position
    resetFly();

    // Load audio assets and initialize the audio
    playBackgroundMusic(); // Call from audio.js

    // Initialize cloud positions
    initializeClouds(); // Call from cloud.js

    // Initialize timer
    startTimer(); // Start the timer

    // Start the game with a 3-second intro
    setTimeout(() => {
        gameState = "playing";
        startTimer(); // Start timer only when game begins
    }, 3000);


}

/**
 * Draw the game state
 */
function draw() {
    background("#87ceeb");

    drawClouds(); // Draw the clouds before other elements

    // Update the game state on each frame
    updateGameState(); // Ensure the state transitions work

    // Update game state based on timer and score
    if (gameState === "intro") {
        displayIntro(); // From storyline.js
    } else if (gameState === "playing") {
        moveFly();
        drawFly();
        moveFrog();
        moveTongue();
        drawFrog();
        updateParticles(); // Update particle positions
        drawParticles(); // Draw particles on the screen
        checkTongueFlyOverlap();
        displayScore(); // From score.js
        displayTimer(); // From timer.js
    } else if (gameState === "win") {
        displayWin(); // From storyline.js
    } else if (gameState === "lose") {
        displayLose(); // From storyline.js
    }
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
 * Added wings and eyes and body and legs 
 * to give better looking bugs
 */
function drawFly() {
    let distance = dist(frog.body.x, frog.body.y, fly.x, fly.y);
    updateBuzzSound(distance); // Call from audio.js

    push();
    translate(fly.x, fly.y); // Move the origin to the fly's position

    // Animate wings with slight movement
    let wingOffset = sin(frameCount * 0.2) * 2; // Oscillate the wings

    // Draw the wings
    fill(200, 200, 255, 150); // Light blue with transparency for wings
    stroke(180, 180, 180, 200); // Gray stroke for contrast
    strokeWeight(1);
    ellipse(-10, -5 + wingOffset, 20, 10); // Left wing
    ellipse(10, -5 - wingOffset, 20, 10); // Right wing

    // Draw the body
    fill(0); // Black for the body
    ellipse(0, 0, fly.size, fly.size * 1.5); // Body of the fly

    // Draw the eyes
    fill(255, 0, 0); // Red for the eyes
    ellipse(-5, -fly.size / 2, 5, 5); // Left eye
    ellipse(5, -fly.size / 2, 5, 5); // Right eye

    // Draw the legs
    stroke(0); // Black for legs
    strokeWeight(1);
    line(-5, 5, -10, 10); // Left leg
    line(5, 5, 10, 10); // Right leg

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
 * Changed to make it only visible in the canvas 
 * even when mouse is outside of the dedicated canvas in setup
 */
function moveFrog() {
    const speed = 5; // Set movement speed

    // Handle keyboard movement (Arrow keys or A/D keys)
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // 65 is 'A'
        frog.body.x -= speed; // Move left
        mouseMovedRecently = false; // Disable mouse control
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // 68 is 'D'
        frog.body.x += speed; // Move right
        mouseMovedRecently = false; // Disable mouse control
    }

    // Handle mouse movement only if the mouse moved recently
    if (mouseMovedRecently && mouseX >= 0 && mouseX <= width) {
        frog.body.x = map(mouseX, 0, width, frog.body.size / 2, width - frog.body.size / 2);
    }

    // Keep the frog within the canvas boundaries horizontally
    frog.body.x = constrain(frog.body.x, frog.body.size / 2, width - frog.body.size / 2);
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
 * Added eyes to the frog
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

    // Draw the eyes relative to the frog's body position
    fill(255); // White for the eye base
    ellipse(frog.body.x - 30, frog.body.y - 60, 30, 40); // Left eye
    ellipse(frog.body.x + 30, frog.body.y - 60, 30, 40); // Right eye

    fill(0); // Black for the pupils
    ellipse(frog.body.x - 30, frog.body.y - 60, 10, 20); // Left pupil
    ellipse(frog.body.x + 30, frog.body.y - 60, 10, 20); // Right pupil
    pop();
}


/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {
    // Calculate the distance between the tongue and the fly
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);

    // If the tongue touches the fly, trigger actions
    if (d < frog.tongue.size / 2 + fly.size / 2) {
        // Create particle explosion at the fly's location
        createParticles(fly.x, fly.y);

        // Reset the fly to a new position
        resetFly();

        // Set the tongue to retract (inbound state)
        frog.tongue.state = "inbound";

        // Increase the score and adjust difficulty
        increaseScore();
        increaseDifficulty(); // From difficulty.js

        // Play sound effect for catching the fly
        powerupSound.play(); // From audio.js
    }
}

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function mousePressed() {
    if (gameState === "intro") {
        gameState = "playing"; // Start the game
        startTimer(); // Initialize the timer
        return; // Exit early to avoid triggering other interactions
    }
    //Additional action to function to make audio play
    if (frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
        frogSound.play(); // Play frog sound when tongue launches
    }
}

/**
 * Launch the tongue when the player presses the spacebar or clicks the mouse.
 */
function keyPressed() {
    if (keyCode === 32 && frog.tongue.state === "idle") { // 32 is Spacebar
        frog.tongue.state = "outbound"; // Launch the tongue
        frogSound.play(); // Play frog sound when tongue launches
    }
}

/**
 * Updates the particles' positions and lifespans.
 * Moves each particle based on its velocity (vx, vy).
 * Gradually reduces the lifespan of each particle.
 * Removes particles from the array when their lifespan reaches zero.
 */
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) { 
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.lifespan--;

        // Remove the particle if its lifespan is over
        if (p.lifespan <= 0) {
            particles.splice(i, 1);
        }
    }
}

/**
 * Draws particles as small yellow circles with a fading effect.
 * Each particle's opacity decreases based on its remaining lifespan.
 * Particles are drawn at their current position with no outline.
 */
function drawParticles() {
    particles.forEach(p => {
        fill(255, 255, 0, p.lifespan * 4); // Yellow particles with fading effect
        noStroke();
        ellipse(p.x, p.y, 5); // Draw each particle as a small circle
    });
}

/**
 * Creates particles at a given position to simulate an explosion.
 */
function createParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: x,
            y: y,
            vx: random(-2, 2), // Random horizontal velocity
            vy: random(-2, 2), // Random vertical velocity
            lifespan: 60 // Particle lifespan in frames
        });
    }
}