/*
 * Game State Management and Display Logic
 *
 * This file manages the entire game flow by controlling the following states:
 * 1. Intro – Displays the welcome screen with options to start the game or view instructions.
 * 2. Instructions – Provides gameplay instructions and navigation to either start the game or return to the intro screen.
 * 3. Playing – The main gameplay state where the frog catches flies within a time limit.
 * 4. Win/Lose – Displays either a win or lose message based on the player’s performance.
 *
 * It ensures smooth transitions between these states by:
 * - Resetting game variables when switching states.
 * - Using buttons for screen navigation and game restarts.
 * - Controlling the game loop to prevent unintended behavior (e.g., stopping the loop during non-play states).
 *
 * This logic guarantees the game responds accurately to user input and maintains the intended gameplay experience.
 *
 * Functions included:
 * - displayIntro(); – Displays the intro screen.
 * - displayInstructions(); – Shows the instructions screen.
 * - displayWin(); – Displays the win screen.
 * - displayLose(); – Displays the lose screen.
 * - updateGameState(); – Updates the game state based on score or time.
 * - createRestartButton(); – Creates a button to restart the game.
 * - restartGame(); – Handles the game restart logic.
 * - resetGame(); – Resets the game variables for a fresh start.
 * - showInstructions(); – Switches to the instructions state.
 * - clearButtons(); – Removes all existing buttons from the screen.
 * 
 */

let gameState = "intro"; // States: intro, playing, win, lose
let scorelevel = 10;
let restartButton; // Restart button element


/**
 * Display the intro of the game
 */
function displayIntro() {
    background(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    fill(0);
    text("Help Frodo catch flies before the feast begins!", width / 2, height / 2);
    text("Goal: Catch 10 flies before the timeout!", width / 2, height / 2 + 40);

    createButton('Start Game')
        .position(width + 50, height + 60)
        .mousePressed(() => {
            clearButtons(); // Clear all buttons
            resetGame(); // Reset all game variables
            gameState = "playing"; // Switch to playing state
            loop(); // **Ensure the draw loop is resumed**
        });

    createButton('Instructions')
        .position(width + 50, height + 90)
        .mousePressed(showInstructions);
}

/**
 * Display Instruction Page 
 * Displaying buttons to allow user to start game or get back to intro
 */
function displayInstructions() {
    background(70, 130, 180); // Set background color
    textSize(20);
    fill(255);
    textAlign(CENTER, CENTER);

    // Features I added to the code
    const instructions = [
        'Welcome to Frogfrogfrog!',
        'Catch 10 flies before time runs out!',
        'Use mouse or WASD/Arrow keys to move the frog.',
        'Click or press Spacebar to launch the tongue.',
        'Sound, clouds, and particles enhance the game!',
        'Flies get faster every 3 catches!',
        'Restart easily from win/lose screens.',
        'Good luck and help Frodo feast!'
    ];

    // Show instructions one line at a time
    instructions.forEach((line, index) => {
        text(line, width / 2, height / 2 - 100 + index * 30);
    });

    // Start Game button
    createButton('Start Game')
        .position(width + 50, height+60)
        .mousePressed(() => {
            clearButtons(); // Clear buttons
            resetGame(); // Reset game variables
            gameState = "playing"; // Switch to playing state
            loop(); // **Ensure the draw loop starts again**
        });

    // Back to Intro button
    createButton('Back to Intro')
        .position(width + 50, height +90)
        .mousePressed(() => {
            clearButtons(); // Clear buttons
            resetGame(); // Reset any variables if needed
            gameState = "intro"; // Switch back to intro state
            displayIntro(); // Display the intro screen again
        });
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
        canvasRect.left + width / 2 - buttonWidth / 2, // Align with canvas horizontally
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

    gameState = "intro"; // Set game state back to intro

    // Remove the restart button
    restartButton.remove();

    // Reset the fly position
    resetFly();

    loop(); // Restart the draw loop after a 1-second delay
}

/**
 * Resets the Game
 */
function resetGame() {
    score = 0; // Reset score
    timer = 40; // Reset timer to initial value
    resetFly(); // Reset the fly's position
}

/**
 * Show Instructions page
 */
function showInstructions() {
    gameState = "instructions"; // Switch to instructions state
    clearButtons(); // Clear any existing buttons
    displayInstructions(); // Call displayInstructions from storyline.js
}

/**
 * Removes all buttons
 */
function clearButtons() {
    let buttons = selectAll('button'); // Select all button elements
    buttons.forEach(button => button.remove()); // Remove each button
}
