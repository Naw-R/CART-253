/**
 * Introducing Variables
 * Rowan Nasser
 * 
 * Learning what variables is and does
 */

"use strict";

/**
 * Create a canvas
*/
function setup() {
    createCanvas(1000, 480);
}


/**
 * Draws a circle in the center of the canvas
*/
function draw() {
    background(0);

    //Draw Circle
    push();
    fill(mouseX, mouseY, 0);
    noStroke();
    ellipse(width / 2, height / 2, 100, 100);
    pop();
}