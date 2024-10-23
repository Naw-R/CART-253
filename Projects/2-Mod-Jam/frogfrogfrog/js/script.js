// This is in script.js
/**
 * Frogfrogfrog
 * Base Template Creation by : Pippin Barr
 * Improved by : Rowan Nasser
 * 
 * Basic Instructions by the Teacher:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch flies
 * 
 * Additional Instructions : 
 * This script defines the main mechanics and behaviors for the Frogfrogfrog game, including:
 * 1. Game Setup: Initializes the canvas, game elements (frog, fly, clouds), audio, and timer.
 * 2. Game Loop: Uses the `draw()` function to continuously render the game based on the current game state.
 * 3. Game Mechanics:
 *    - Frog and fly movement.
 *    - Tongue mechanics, allowing the frog to catch flies.
 *    - Particle effects for visual feedback when a fly is caught.
 * 4. Player Interaction: Handles input via mouse movement, clicks, and keyboard keys (WASD/Arrow keys/Spacebar).
 * 
 * Made with p5
 * https://p5js.org/
 *
 * Functions included:
 * - setup(); – Initializes the canvas, audio, and game elements.
 * - draw(); – The game loop that renders elements based on the current state.
 * - moveGoodFly(); – Moves the Good fly and resets it if it leaves the screen.
 * - drawGoodFly(); – Draws a detailed Good fly with wings, eyes, and legs.
 * - moveBadFly(); – Moves the bad fly
 * - drawBadFly(); – Draws the bad fly
 * - moveFrog(); – Controls frog movement based on mouse and keyboard input.
 * - moveTongue(); – Controls the tongue’s movement and state (idle, outbound, inbound).
 * - drawFrog(); – Draws the frog with body, eyes, and tongue.
 * - checkTongueFlyOverlap(); – Checks if the tongue catches a Good fly and triggers effects.
 * - mousePressed(); – Launches the tongue when the player clicks.
 * - keyPressed(); – Launches the tongue when the player presses Spacebar or W/Up Arrow.
 * - updateParticles(); – Updates the particle positions and lifespans.
 * - drawParticles(); – Draws the particle explosion effect.
 * - createParticles(); – Creates particles to simulate an explosion.
 * 
 */

"use strict";

let mouseMovedRecently = false; // Track if the mouse moved recently

let particles = []; // Array of particles

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

// Our Good fly
// Has a position, size, and speed of horizontal movement
const goodFly = {
    x: 0,
    y: 200, // Will be random
    size: 10,
    speed: 3
};

// Our Bad fly
// Has a position, size, and speed of horizontal movement
const badFly = {
    x: 0,
    y: 200, // Will be random
    size: 10,
    speed: 2
};

/**
 *  Initial state of the canvas, fly, audio, clouds and timer
 */
function setup() {
    createCanvas(640, 480);

    // Give the fly its first random position
    resetGoodFly();

    // Give the bad fly its first random position
    resetBadFly();

    // Load audio assets and initialize the audio
    playBackgroundMusic(); // Call from audio.js

    // Initialize cloud positions
    initializeClouds(); // Call from cloud.js

    // Initialize timer
    startTimer(); // Start the timer
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
    } else if (gameState === "instructions") {
        displayInstructions(); // From storyline
    } else if (gameState === "playing") {
        moveGoodFly();
        moveBadFly();
        drawGoodFly();
        drawBadFly();
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
        buzzSound.stop();
        noLoop(); // Stop the loop in intro state
    } else if (gameState === "lose") {
        displayLose(); // From storyline.js
        buzzSound.stop();
        noLoop(); // Stop the loop in intro state
    }
}

/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */
function moveGoodFly() {
    // Move the fly
    goodFly.x += goodFly.speed;
    // Handle the Good fly going off the canvas
    if (goodFly.x > width) {
        resetGoodFly();
    }
}

/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */
function moveBadFly() {
    // Move the fly
    badFly.x += badFly.speed;
    // Handle the Bad fly going off the canvas
    if (badFly.x > width) {
        resetBadFly();
    }
}

/**
 * Draws the Good fly as a black circle 
 * Added wings and eyes and body and legs 
 * to give better looking bugs
 */
function drawGoodFly() {
    let distance = dist(frog.body.x, frog.body.y, goodFly.x, goodFly.y);
    updateBuzzSound(distance); // Call from audio.js

    push();
    translate(goodFly.x, goodFly.y); // Move the origin to the Good fly's position

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
    ellipse(0, 0, goodFly.size, goodFly.size * 1.5); // Body of the good fly

    // Draw the eyes
    fill(255, 0, 0); // Red for the eyes
    ellipse(-5, -goodFly.size / 2, 5, 5); // Left eye
    ellipse(5, -goodFly.size / 2, 5, 5); // Right eye

    // Draw the legs
    stroke(0); // Black for legs
    strokeWeight(1);
    line(-5, 5, -10, 10); // Left leg
    line(5, 5, 10, 10); // Right leg

    pop();
}

/**
 * Draws the Bad fly as a black circle 
 * Added wings and eyes and body and legs 
 * to give better looking bugs
 */
function drawBadFly() {
    let distance = dist(frog.body.x, frog.body.y, badFly.x, badFly.y);
    updateBuzzSound(distance); // Call from audio.js

    push();
    translate(badFly.x, badFly.y); // Move the origin to the Bad-Fly's position

    // Animate wings with slight movement
    let wingOffset = sin(frameCount * 0.2) * 2; // Oscillate the wings

    // Draw the wings (slightly larger than Good-Fly)
    fill(200, 200, 255, 150); // Light blue with transparency for wings
    stroke(180, 180, 180, 200); // Gray stroke for contrast
    strokeWeight(1);
    ellipse(-15, -7 + wingOffset, 25, 12); // Left wing
    ellipse(15, -7 - wingOffset, 25, 12); // Right wing

    // Draw the body (increase size for Bad-Fly)
    fill(255, 0, 0); // Red for the body
    ellipse(0, 0, badFly.size + 5, (badFly.size + 5) * 1.5); // Larger body

    // Draw the eyes (larger size to match the bigger body)
    fill(0); // Black for the eyes
    ellipse(-6, -(badFly.size + 5) / 2, 6, 6); // Left eye
    ellipse(6, -(badFly.size + 5) / 2, 6, 6); // Right eye

    // Draw the legs (adjusted position and size)
    stroke(0); // Black for legs
    strokeWeight(1);
    line(-6, 7, -12, 12); // Left leg
    line(6, 7, 12, 12); // Right leg

    pop();

}

/**
 * Resets the fly to the left with a random y
 */
function resetGoodFly() {
    goodFly.x = 0;
    goodFly.y = random(0, 300);
}

/**
 * Resets the bad fly to the left with a random y
 */
function resetBadFly() {
    badFly.x = 0;
    badFly.y = random(0, 300);
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
    // Calculate the distance between the tongue and the Good fly
    const d = dist(frog.tongue.x, frog.tongue.y, goodFly.x, goodFly.y);
    // Calculate the distance between the tongue and the Bad fly
    const b = dist(frog.tongue.x, frog.tongue.y, badFly.x, badFly.y);

    // If the tongue touches the Good fly, trigger actions
    if (d < frog.tongue.size / 2 + goodFly.size / 2) {
        // Create particle explosion at the fly's location
        createParticles(goodFly.x, goodFly.y);

        // Reset the fly to a new position
        resetGoodFly();

        // Set the tongue to retract (inbound state)
        frog.tongue.state = "inbound";

        // Increase the score and adjust difficulty
        increaseScore();
        increaseDifficulty(); // From difficulty.js

        // Play sound effect for catching the fly
        powerupSound.play(); // From audio.js
    }

    // If the tongue touches the Bad fly, trigger actions
    if (b < frog.tongue.size / 2 + badFly.size / 2) {
        // Create particle explosion at the fly's location
        createParticles(badFly.x, badFly.y);

        // Reset the fly to a new position
        resetBadFly();

        // Set the tongue to retract (inbound state)
        frog.tongue.state = "inbound";

        // Increase the score and adjust difficulty
        decreaseScore();
        decreaseDifficulty(); // From difficulty.js

        // Play sound effect for catching the fly
        powerdownSound.play(); // From audio.js
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
 * Launch the tongue when the player presses the spacebar or clicks the mouse.
 */
function keyPressed() {
    if (keyCode === 32 || keyCode === 87 || keyCode === 38) {
        if (frog.tongue.state === "idle") { // 32 is Spacebar
            frog.tongue.state = "outbound"; // Launch the tongue
            frogSound.play(); // Play frog sound when tongue launches
        }
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
