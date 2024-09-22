/**
 * creating variables
 * Rowan Nasser     
 * 
 * Experimenting with creating variables
 */

"use strict";

/**
 * create canvas
*/
function setup() {
    createCanvas(480,480);
}


/**
 * Draws a hole in a piece of cheese
*/
function draw() {
    //the cheese
    background(255,255,0);

    // The hole
    push();
    noStroke();
    fill(0);
    ellipse(140, 175, 100);
    pop(); 

}