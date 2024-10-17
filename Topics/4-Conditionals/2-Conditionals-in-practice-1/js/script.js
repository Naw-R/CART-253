/**
 * Creature Loves Mouse
 * Pippin Barr
 * 
 * A creature that responds to the mouse by changing colour
 */

"use strict";

// Our creature
const creature = {
    // Position
    x: 200,
    y: 200,
    // Size
    size: 200,
    // Fill
    fill: "#000000", // Starts out bored
    // Possible fills for the creature that show its mood
    // We'll need these when we start changing its colour
    // and it's nice to keep them along with all the other info
    // about the creature
    fills: {
        bored: "#000000", // Black
        happy: "#33cc33", // Green
        angry: "#cc3333" // Red
    }
};

/**
 * Creates the canvas
 */
function setup() {
    createCanvas(400, 400);
}

/**
 * Fills the background, displays the creature 
 */
function draw() {
    background(255, 200, 127);

    checkInput();
    drawCreature();
}

/**
 * Responds to user input
 */
function checkInput() {
    // Check if the mouse button is pressed
    if (mouseIsPressed) {
        // turns the circle to happy color
        creature.fill = creature.fills.happy;
    }
    // Check if a key is pressed
    else if (keyIsPressed) {
        // turns the circle to angry color
        creature.fill = creature.fills.angry;
    }
    // If the mouse button is not pressed
    else {
        // turns the circle to bored color
        creature.fill = creature.fills.bored;
    }
}

/**
 * Draws the creature
 */
function drawCreature() {
    push();
    noStroke();
    // Use the creature's fill
    fill(creature.fill);
    // Display the creature at its position and size
    ellipse(creature.x, creature.y, creature.size);
    pop();
}