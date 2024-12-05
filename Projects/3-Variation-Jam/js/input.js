/**
 * This is input.js
 * 
 * input.js handles keyboard input for the Emoji Word Guessing Game.
 * It ensures that player inputs are processed correctly and updates the game board accordingly.
 * 
 * Functions Overview:
 * - handleInput(key): Processes player input and delegates to appropriate handlers.
 * - dispatchInput(key): Routes specific key inputs to corresponding handlers (e.g., Backspace, Enter, letters).
 * - handleBackspace(): Clears non-frozen letters from the current input.
 * - handleEnter(): Validates the current input against the solution.
 * - handleLetterInput(letter): Adds a letter to the next available slot in the input.
 * - keyPressed(): Captures and routes key press events to gameplay logic.
 */


/**
 * Handles input from the player.
 * @param {string} key - The key pressed by the player.
 */
function handleInput(key) {
    // Validate game state and puzzle existence
    if (!inGameState.puzzle || currentGameState !== GameState.GAMEPLAY) {
        console.error("Invalid state for input.");
        return;
    }

    // Delegate input handling based on key type
    dispatchInput(key);

    // Always update the board after processing input
    updateBoard(currentInput, inGameState.puzzle.title, false);
}

/**
 * Delegates the input handling to the appropriate function.
 * @param {string} key - The key pressed by the player.
 */
function dispatchInput(key) {
    if (key === "Backspace" || key === "Delete") {
        handleBackspace();
    } else if (key === "Enter") {
        handleEnter();
    } else if (key.length === 1 && key.match(/[a-zA-Z]/)) {
        handleLetterInput(key);
    } else {
        console.log("Invalid key:", key);
    }
}

/**
 * Handles Backspace/Delete input to clear non-frozen letters.
 */
function handleBackspace() {
    currentInput = currentInput.map((char, i) => (frozenLetters[i] ? char : null));
    console.log("Cleared all non-frozen letters.");
}

/**
 * Handles Enter input to validate the word.
 */
function handleEnter() {
    console.log("Submitting word for validation...");
    checkWord(currentInput, inGameState.puzzle.title); // Pass current input and solution
}

/**
 * Handles letter input to populate the next available slot.
 * @param {string} letter - The letter pressed by the player.
 */
function handleLetterInput(letter) {
    console.log(`Handling letter input: ${letter}`);
    for (let i = 0; i < currentInput.length; i++) {
        if (!currentInput[i] && inGameState.puzzle.title[i] !== " ") { // Skip spaces
            currentInput[i] = letter.toUpperCase(); // Convert to uppercase for consistency
            break; // Stop after placing one letter
        }
    }
}

/**
 * Captures key press events and passes them to the gameplay logic.
 */
function keyPressed() {
    if (key.length === 1 && key.match(/[a-zA-Z]/)) {
        handleInput(key); // Pass letter inputs
    } else if (key === "Backspace" || key === "Delete" || key === "Enter") {
        handleInput(key); // Pass special keys
    } else {
        console.log(`Invalid key: ${key}`); // Debugging log for invalid keys
    }
}
