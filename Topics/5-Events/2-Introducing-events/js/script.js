/**
 * Introducing Events
 * Rowan Nasser
 * 
 * Taking a look at how events work in JavaScript and p5
 */

"use strict";

/**
 * creates the canvas
*/
function setup() {
    createCanvas(400, 400);
    background(0);
}


/**
 * Does nothing
*/
function draw() {

}

function mousePressed() {
    push();
    noStroke();
    fill(255, 255, 0);
    ellipse(mouseX, mouseY, 50);
    pop();
}