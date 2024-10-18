/*
 * Cloud Animation
 *
 * Initializes cloud positions and draws them on the screen. 
 * Clouds move from right to left, resetting to the right side 
 * when they exit the screen to create a continuous scrolling effect.
 */

// Variables for cloud positions
let cloudX = [];
let cloudY = [];

/**
 * Initializes cloud positions.
 */
function initializeClouds() {
    for (let i = 0; i < 5; i++) {
        cloudX.push(random(width));
        cloudY.push(random(50, 150));
    }
}

/**
 * Draws and moves clouds.
 */
function drawClouds() {
    fill(220, 220, 220, 200); // Light grey
    stroke(225, 225, 225, 225); // Grey stroke

    for (let i = 0; i < cloudX.length; i++) {
        ellipse(cloudX[i], cloudY[i], 60, 40); // Cloud shape
        cloudX[i] -= 0.5; // Move left
        if (cloudX[i] < -50) {
            cloudX[i] = width + 50; // Reset to the right
            cloudY[i] = random(50, 150); // New height
        }
    }
}
