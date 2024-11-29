/**
 * game.js
 * Handles the gameplay functionality of the Emoji Word Guessing Game
 */

// Global game state
const inGameState = {
    theme: null,           // Selected theme
    puzzle: null,          // The puzzle object (e.g., title and emoji)
    guessedLetters: [],    // Array to track guessed letters
};

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
            inGameState.puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
            initializeGame(inGameState.puzzle);
        })
        .catch(error => console.error("Error loading theme:", error.message));
}

/**
 * Extracts the puzzles based on the theme structure.
 * @param {object} data - The theme JSON data.
 * @param {string} themeName - The theme name.
 * @returns {Array} Array of normalized puzzles.
 */
function extractPuzzles(data, themeName) {
    if (themeName === "movies") return data.movieTitles; // Movies already use title and emoji
    if (themeName === "songs") return data.popularSongs.map(song => ({
        title: song.title,
        emoji: song.emoji,
    }));
    if (themeName === "tv") return data.tvShows; // TV shows use title and emoji
    if (themeName === "countries") return data.countries.map(country => ({
        title: country.country,
        emoji: country.emoji,
    }));
    if (themeName === "brands") {
        // Flatten the nested array and normalize to title/emoji structure
        return data.brands.flat().map(brand => ({
            title: brand.brand,
            emoji: brand.emoji,
        }));
    }
    if (themeName === "books") return data.books.map(book => ({
        title: book.title,
        emoji: book.emoji,
    }));
    console.error("Unknown theme:", themeName);
    return [];
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
    inGameState.guessedLetters = Array(puzzle.title.length).fill(null);
    drawGameBoard(puzzle.emoji, puzzle.title);
    startTimer(); // Start the timer (defined in timer.js or script.js)
}

/**
 * Draws the game board with emojis and letter slots.
 * @param {string} emojis - The puzzle's emojis.
 * @param {string} title - The puzzle's title.
 */
function drawGameBoard(emojis, title) {
    // Render emojis
    textSize(64);
    textAlign(CENTER, CENTER);
    text(emojis, width / 2, height / 3);

    // Draw letter slots for the title
    const slotWidth = 50;
    const startX = width / 2 - (title.replace(/\s/g, "").length * slotWidth) / 2;
    let x = startX;

    for (let char of title) {
        if (char === " ") {
            x += slotWidth; // Skip spaces
            continue;
        }
        rect(x, height / 2, 40, 40); // Draw slot
        x += slotWidth;
    }
}

/**
 * Handles keyboard input for guessing letters.
 * @param {string} key - The key pressed by the player.
 */
function handleInput(key) {
    if (!inGameState.puzzle) return; // Ignore input if no puzzle is loaded

    const normalizedKey = key.toLowerCase();
    const normalizedTitle = inGameState.puzzle.title.toLowerCase();

    for (let i = 0; i < normalizedTitle.length; i++) {
        if (normalizedTitle[i] === normalizedKey && !inGameState.guessedLetters[i]) {
            inGameState.guessedLetters[i] = key;
        }
    }
    updateBoard(inGameState.guessedLetters, normalizedTitle);

    // Check for win condition
    if (inGameState.guessedLetters.join("").toLowerCase() === normalizedTitle.replace(/\s/g, "").toLowerCase()) {
        endGame(true); // Win the game
    }
}

/**
 * Updates the game board with the player's guesses.
 * @param {Array} guesses - The current guessed letters.
 * @param {string} answer - The correct answer.
 */
function updateBoard(guesses, answer) {
    const slotWidth = 50;
    const startX = width / 2 - (answer.replace(/\s/g, '').length * slotWidth) / 2;
    let x = startX;

    for (let i = 0; i < answer.length; i++) {
        if (answer[i] === " ") {
            x += slotWidth; // Skip spaces
            continue;
        }
        if (guesses[i]) {
            textSize(32);
            textAlign(CENTER, CENTER);
            fill("black");
            text(guesses[i], x + 20, height / 2 + 20);
        }
        x += slotWidth;
    }
}

/**
 * Ends the game with a message.
 * @param {boolean} won - Whether the player won or lost.
 */
function endGame(won) {
    stopTimer(); // Stop the timer (defined in timer.js or script.js)

    const message = won
        ? "You Win! 🎉"
        : `Time's up! The correct answer was: ${inGameState.puzzle.title}`;
    alert(message);

    // Reset game state and return to the theme lobby
    resetGameState();
    updateState(GameState.THEME_LOBBY);
}

/**
 * Resets the in-game state.
 */
function resetGameState() {
    inGameState.theme = null;
    inGameState.puzzle = null;
    inGameState.guessedLetters = [];
    timerRunning = false;
    lastSecondTime = null; // Reset the time reference
    updateState(GameState.MAIN_MENU); // Transition to main menu
}