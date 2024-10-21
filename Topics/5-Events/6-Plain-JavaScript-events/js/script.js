/**
 *  Plain JavaScript Events
 * Rowan NAsser
 * 
 * Experimneting with event handling in plain javascript
 */

"use strict";

// Information about background fills
const bg = {
    fill: "#000000",
    fills: {
        black: "#000000",
        white: "#FFFFFF",
    },
    switchKey: 32
}


/**
 * create canvas
*/
function setup() {
    createCanvas(500, 500);

    window.addEventListener("keydown", changeBG);
}


/**
 *  displays the background
*/
function draw() {
    background(bg.fill);
    fill(255);
    textSize(32);
    text("Press the spacebar to change background", 10, 30);

}

/**
 * changes the background color when key is pressed
 * 
 */
function changeBG(event) {
    if (event.keyCode == bg.switchKey) {
        if (bg.fill == bg.fills.black) {
            bg.fill = bg.fills.white;
        } else {
            bg.fill = bg.fills.black;
        }
    }

}