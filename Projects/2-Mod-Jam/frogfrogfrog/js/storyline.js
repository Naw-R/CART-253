/*
 * Game State Logic
 *
 * Manages different game states: "intro", "playing", "win", and "lose". 
 * The goal is to catch 10 flies before time runs out. This code handles 
 * displaying the intro, win, and loss messages and updates the game state 
 * based on the timer or the player's score.
 */

let gameState = "intro"; // States: intro, playing, win, lose
let scorelevel = 10;
let restartButton; // Restart button element


/**
 * Display the intro of the game
 */
function displayIntro() {
    background(255); // Ensure a white background clears the canvas
    textSize(24);
    textAlign(CENTER, CENTER);
    fill(0); // Black text color
    text("Help Frodo catch flies before the feast begins!", width / 2, height / 2);
    text("Goal : catch 10 flies before the timeout!", width / 2, height / 2 + 40);

    textSize(16);
    text("Click to Start", width / 2, height / 2 + 80); // Prompt user to start
}

/**
 * Display the win of the game
 */
function displayWin() {
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(0); // Black text color
    text("Frodo feasts like a king!", width / 2, height / 2);
    text("You Win!", width / 2, height / 2 + 40);

    createRestartButton(); // Create the restart button

}

/**
 * Display the loss of the game
 */
function displayLose() {
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(0); // Black text color
    text("Time's up! Frodo's feast is over.", width / 2, height / 2);
    text("You Lost!", width / 2, height / 2 + 40);
    
    createRestartButton(); // Create the restart button
}

/**
 * Sets the win or lose state
 * @returns 
 */
function updateGameState() {
    // if timer ran out
    if (timer <= 0) {
        gameState = "lose";
        noLoop(); // Stop draw loop
        return;
    }
    // if user succeeded to catch all flies
    if (score >= scorelevel) {
        gameState = "win";
        noLoop(); // Stop draw loop
        return;
    }
}

/**
 * Creates the restart button and positions it within the canvas.
 */
function createRestartButton() {
    const canvas = document.querySelector('canvas'); // Select the canvas element
    const canvasRect = canvas.getBoundingClientRect(); // Get canvas position

    restartButton = createButton('Restart');

    // Position the button right under the center text
    const buttonWidth = 50; // Adjust if needed
    const buttonHeight = 40; // Adjust if needed

    restartButton.position(
        canvasRect.left + width / 2 - buttonWidth /2, // Align with canvas horizontally
        canvasRect.top + height / 2 + 70  // Align with canvas vertically
    );
    restartButton.mousePressed(restartGame);
}


/**
 * Handles the game restart by resetting variables and removing the button.
 */
function restartGame() {
    // Reset game variables
    score = 0;
    timer = 40; // Reset timer
    
    gameState = "playing"; // Set game state back to playing

    // Remove the restart button
    restartButton.remove();

    // Reset the fly position
    resetFly();

    loop(); // Restart the draw loop after a 1-second delay

}
