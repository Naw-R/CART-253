/**
 * Guess the Emoji
 * Rowan Nasser
 * Guess the Emoji game using the P5.js library.
 * 
 * This file is responsible for managing the core gameplay functionality of the Emoji Word Guessing Game. 
 * It handles game state management, puzzle initialization, user interactions, and overall game flow.
 * 
 * Functions Overview:
 *   - initializeGame(puzzle): Sets up a new puzzle, including the timer, input tracking, and board rendering.
 *   - loadTheme(themeName): Loads puzzles from JSON files based on the selected theme.
 *   - updateBoard(guesses, solution, validate): Updates the game board with user input and feedback.
 *   - endGame(won): Handles win/lose conditions and transitions to the appropriate state.
 *   - resetGameState(): Resets all game-related state variables and UI elements.
 */

// Global game state
const inGameState = {
    theme: null,           // Selected theme
    puzzle: null,          // The puzzle object (e.g., title and emoji)
    guessedLetters: [],    // Array to track guessed letters
    hintsUsed: 0,          // Tracks the number of hints used
    score: 0,              // Initialize score
    roundCount: 0,         // Tracks the number of rounds played
};

let currentInput = []; // Tracks the user's current input
let frozenLetters = Array(inGameState.puzzle?.title.length).fill(false); // Tracks frozen (correct) letters

/**
 * Loads the selected theme's JSON file.
 * @param {string} themeName - The selected theme.
 */

function loadTheme(themeName) {
    fetch(`assets/data/${themeName}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load theme: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const puzzles = extractPuzzles(data, themeName);
            if (!puzzles || puzzles.length === 0) {
                throw new Error("No valid puzzles found in the theme data.");
            }
            inGameState.theme = themeName;
            inGameState.puzzleData = puzzles; // Store all puzzles for skipping
            inGameState.puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
            initializeGame(inGameState.puzzle);
        })
        .catch(error => console.error("Error loading theme:", error.message));
}

/**
 * Initializes the game.
 * @param {object} puzzle - The selected puzzle object.
 */
function initializeGame(puzzle) {
    if (!puzzle || !puzzle.title || !puzzle.emoji) {
        console.error("Invalid puzzle data:", puzzle);
        return;
    }

    console.log("Initializing puzzle:", puzzle.title);

    // Reset game inputs for the new puzzle
    currentInput = Array(puzzle.title.length).fill(null); // Clear user input
    frozenLetters = Array(puzzle.title.length).map((_, i) =>
        puzzle.title[i].match(/[^a-zA-Z0-9]/) ? true : false
    ); // Freeze special characters
    inGameState.guessedLetters = Array(puzzle.title.length).fill(null); // Reset guessed letters
    inGameState.hintsUsed = 0; // Reset the hint counter

    // Stop and restart the timer
    stopTimer(); // Stop any existing timer
    startTimer(); // Start the timer for the new puzzle

    // Draw the game board with emojis and slots
    updateBoard(puzzle.emoji, puzzle.title);

    // Add buttons (Hint and Skip)
    addHintButton();
    addSkipButton();

}

/**
 * Updates the game board with the player's guesses.
 * @param {Array} guesses - The current guessed letters.
 * @param {string} solution - The correct answer.
 * @param {boolean} validate - Whether to validate guesses (green/red feedback).
 */
function updateBoard(guesses, solution, validate = false) {
    const slotWidth = 50;
    const slotHeight = 50;
    const startX = width / 2 - (solution.length * slotWidth) / 2;
    let x = startX;

    // Ensure emoji is fetched from the puzzle object
    const emoji = inGameState.puzzle?.emoji || "❓"; // Default to "❓" if no emoji exists

    // Draw emojis
    textSize(64);
    textAlign(CENTER, CENTER);
    fill(0);
    text(emoji, width / 2, height / 4); // Draw emojis at the top of the screen

    // Draw the message to guide the player
    textSize(20);
    fill(50);
    text("Click Enter to validate your guess ✅", width / 2, height / 1.5);


    for (let i = 0; i < solution.length; i++) {
        const char = solution[i];

        // Handle spaces by skipping and adding spacing
        if (char === " ") {
            x += slotWidth; // Leave space for gaps
            continue;
        }

        // Handle special characters: Display directly without a square
        if (char.match(/[^a-zA-Z0-9]/)) {
            textSize(32);
            textAlign(CENTER, CENTER);
            strokeWeight(1);
            fill(0);
            text(char, x + slotWidth / 2, height / 2 + slotHeight / 2);
        } else {
            // Regular letters: Draw the square and guessed letter if available
            fill(255); // White background for the square
            stroke(frozenLetters[i] ? "green" : 0); // Green stroke for frozen (correctly guessed) letters
            strokeWeight(2);
            rect(x, height / 2, slotWidth, slotHeight);

            if (guesses[i]) {
                textSize(32);
                textAlign(CENTER, CENTER);
                fill(validate && guesses[i].toLowerCase() === char.toLowerCase() ? "green" : "black");
                text(guesses[i], x + slotWidth / 2, height / 2 + slotHeight / 2);
            }
        }

        // Move to the next slot
        x += slotWidth;
    }

}

/**
 * Ends the game when all puzzles are completed.
 * @param {boolean} won - Whether the player successfully completed the puzzles.
 */
function endGame(won) {
    stopTimer();

    const message = won
        ? `You completed 10 rounds! 🎉 Final Score: ${inGameState.score}`
        : `The correct answer was: ${inGameState.puzzle.title}\nFinal Score: ${inGameState.score}`;

    alert(message);

    resetGameState();
    updateState(GameState.THEME_LOBBY); // Return to theme selection
}

/**
 * Resets the in-game state.
 */
function resetGameState() {
    inGameState.theme = null;        // Clear the selected theme
    inGameState.puzzle = null;       // Clear the current puzzle
    inGameState.guessedLetters = []; // Clear guessed letters
    inGameState.roundCount = 0;      // Reset the round counter
    inGameState.score = 0;           // Reset the score
    timerRunning = false;            // Stop the timer
    lastSecondTime = null;           // Reset the time reference

    // Remove the Skip button when leaving the game state
    removeSkipButton();

    // Remove the Hint button when leaving the game state
    removeHintButton();

    updateState(GameState.MAIN_MENU); // Transition to main menu
}