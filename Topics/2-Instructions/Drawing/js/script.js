/**
 * The Greatest Record of all time
 * Rowan Nasser
 * 
 * Display the greatest record of all time
 */

"use strict";

/**
 * Create the square canvas
*/
function setup() {
    createCanvas(640,640);
    
}


/**
 * Displays the Record
*/
function draw() {
    background(150);

    // The main part of the record
    push();       // Beggining of drawing
    fill(255,0,0);
    stroke(255);
    ellipse(320, 320, 480, 480);
    pop();      //End of drawing

    // The label on the record
    push();
    fill("white");
    noStroke();
    ellipse(320, 320, 140,140);
    pop();

    // The hole in the record
    push();
    fill("#000000");
    noStroke();
    ellipse(320, 320, 20);
    pop();

}