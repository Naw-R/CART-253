/**
 * game.js
 * Handles the gameplay functionality of the Emoji Word Guessing Game
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
 * Extracts the puzzles based on the theme structure.
 * @param {object} data - The theme JSON data.
 * @param {string} themeName - The theme name.
 * @returns {Array} Array of normalized puzzles.
 */
function extractPuzzles(data, themeName) {
    if (!data) {
        console.error("Data is undefined or null. Cannot extract puzzles.");
        return [];
    }

    // Match the theme name to the correct data key
    if (themeName === "movies" && data.movieTitles) return data.movieTitles;
    if (themeName === "songs" && data.popularSongs) return data.popularSongs.map(song => ({
        title: song.title,
        emoji: song.emoji,
    }));
    if (themeName === "tv" && data.tvShows) return data.tvShows;
    if (themeName === "countries" && data.countries) return data.countries.map(country => ({
        title: country.country,
        emoji: country.emoji,
    }));
    if (themeName === "brands" && data.brands) {
        return data.brands.flat().map(brand => ({
            title: brand.brand,
            emoji: brand.emoji,
        }));
    }
    if (themeName === "books" && data.books) return data.books.map(book => ({
        title: book.title,
        emoji: book.emoji,
    }));

    console.error("Invalid theme name or missing data for theme:", themeName);
    return []; // Return an empty array to prevent further errors
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

    // Increment the round counter
    inGameState.roundCount++;

    // Check if round limit is reached
    if (inGameState.roundCount > 10) {
        endGame(true); // End the game, passing "true" to indicate completion
        return;
    }

    // Reset game inputs for the new puzzle
    currentInput = Array(puzzle.title.length).fill(null); // Clear user input
    frozenLetters = Array(puzzle.title.length).fill(false); // Reset frozen letters
    inGameState.guessedLetters = Array(puzzle.title.length).fill(null); // Reset guessed letters
    inGameState.hintsUsed = 0; // Reset the hint counter

    // Stop and restart the timer
    stopTimer(); // Stop any existing timer
    startTimer(); // Start the timer for the new puzzle

    // Draw the game board with emojis and slots
    drawGameBoard(puzzle.emoji, puzzle.title);

    // Add buttons (Hint and Skip)
    addHintButton();
    addSkipButton();
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
    const slotWidth = 50; // Width of each slot
    const slotHeight = 50; // Height of each slot
    const startX = width / 2 - (title.replace(/\s/g, "").length * slotWidth) / 2; // Center the slots
    let x = startX;

    for (let char of title) {
        if (char === " ") {
            x += slotWidth; // Skip spaces
            continue;
        }

        // Draw each slot as a white square with a black border
        fill(255); // White fill
        stroke(0); // Black border
        strokeWeight(2); // Thickness of the border
        rect(x, height / 2, slotWidth, slotHeight);

        x += slotWidth; // Move to the next slot position

    }
}

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
 * Updates the game board with the player's guesses.
 * @param {Array} guesses - The current guessed letters.
 * @param {string} solution - The correct answer.
 * @param {boolean} validate - Whether to validate guesses (green/red feedback).
 */
function updateBoard(guesses, solution, validate = false) {
    const slotWidth = 50;
    const slotHeight = 50;
    const startX = width / 2 - (solution.replace(/\s/g, "").length * slotWidth) / 2;
    let x = startX;

    for (let i = 0; i < solution.length; i++) {
        if (solution[i] === " ") {
            x += slotWidth;
            continue;
        }

        fill(255);
        stroke(0);
        strokeWeight(2);
        rect(x, height / 2, slotWidth, slotHeight);

        if (guesses[i]) {
            textSize(32);
            textAlign(CENTER, CENTER);
            fill(0);
            text(guesses[i], x + slotWidth / 2, height / 2 + slotHeight / 2);
        }

        x += slotWidth;
    }

    //Display the score
    textSize(24);
    textAlign(CENTER, CENTER);
    fill(0);
    text(`Score: ${inGameState.score}`, window.innerWidth/2, 100);
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

/**
 * Check the input state of the word
 * @param {array} userInput 
 * @param {string} solution 
 * @returns 
 */
function checkWord(userInput, solution) {
    if (!Array.isArray(userInput)) {
        console.error("Invalid userInput: Expected an array, received:", userInput);
        return;
    }

    const trimmedInput = userInput.filter((char) => char !== null).join("");
    const trimmedSolution = solution.replace(/\s/g, "");

    if (!trimmedInput || trimmedInput.length !== trimmedSolution.length) {
        console.log("Invalid input length: Input and solution lengths do not match.");
        return;
    }

    let isWordCorrect = true;

    // Validate each letter and update the score for correct letters
    for (let i = 0; i < trimmedSolution.length; i++) {
        if (trimmedSolution[i].toLowerCase() === trimmedInput[i]?.toLowerCase()) {
            frozenLetters[i] = true;
            inGameState.score += 10; // Add 10 points per correct letter
        } else {
            isWordCorrect = false;
        }
    }

    updateBoard(userInput, solution, true);

    if (isWordCorrect) {
        console.log("Correct word guessed! Moving to the next puzzle.");
        inGameState.score += 50; // Add a bonus for solving the puzzle
        loadNextPuzzle();
    } else {
        console.log("Incorrect word. Please try again.");
    }
}


/**
 * Loads the next puzzle in sequence or returns to the theme lobby.
 */
function loadNextPuzzle() {
    if (inGameState.roundCount >= 10) {
        endGame(true); // End the game, passing "true" to indicate completion
        return;
    }

    const puzzles = inGameState.puzzleData;

    if (!puzzles || puzzles.length === 0) {
        console.error("No puzzles available.");
        return;
    }

    // Find the current puzzle index
    const currentIndex = puzzles.findIndex(p => p.title === inGameState.puzzle.title);

    // Move to the next puzzle or wrap around
    const nextIndex = (currentIndex + 1) % puzzles.length;

    // Set the next puzzle as the current one
    inGameState.puzzle = puzzles[nextIndex];

    // Reinitialize the game with the new puzzle
    initializeGame(inGameState.puzzle);
}

/**
 * Skips the current puzzle and moves to the next.
 */
function skipPuzzle() {
    console.log("Skipping to the next puzzle...");
    inGameState.score -= 20; // Deduct points for skipping

    stopTimer();
    currentInput = [];
    frozenLetters = [];
    inGameState.guessedLetters = [];

    loadNextPuzzle();
    addSkipButton();
}

/**
 * Adds a Skip button to the game.
 */
function addSkipButton() {
    if (document.getElementById("skipButton")) return; // Skip if already added

    const skipButton = document.createElement("button");
    skipButton.id = "skipButton";
    skipButton.textContent = "Skip Puzzle";
    skipButton.style.position = "absolute";
    skipButton.style.top = "10px";
    skipButton.style.right = "10px";
    skipButton.style.padding = "10px 20px";
    skipButton.style.fontSize = "16px";
    skipButton.style.backgroundColor = "#f04";
    skipButton.style.color = "white";
    skipButton.style.border = "none";
    skipButton.style.borderRadius = "5px";
    skipButton.style.cursor = "pointer";
    skipButton.style.zIndex = "1000";

    skipButton.addEventListener("click", skipPuzzle);

    document.body.appendChild(skipButton);
}

/**
 * Removes the Skip button from the game.
 */
function removeSkipButton() {
    const skipButton = document.getElementById("skipButton");
    if (skipButton) {
        skipButton.remove();
    }
}

/**
 * Adds a Hint button to the game.
 */
function addHintButton() {
    if (document.getElementById("hintButton")) return; // Avoid adding duplicate buttons

    const hintButton = document.createElement("button");
    hintButton.id = "hintButton";
    hintButton.textContent = "Hint";
    hintButton.style.position = "absolute";
    hintButton.style.bottom = "150px"; // Position above the "Return to Menu" button
    hintButton.style.left = "50%"; // Center horizontally
    hintButton.style.transform = "translateX(-50%)"; // Center adjustment
    hintButton.style.padding = "10px 20px";
    hintButton.style.fontSize = "16px";
    hintButton.style.backgroundColor = "#007BFF"; // Blue for visibility
    hintButton.style.color = "white";
    hintButton.style.border = "none";
    hintButton.style.borderRadius = "5px";
    hintButton.style.cursor = "pointer";
    hintButton.style.zIndex = "1000";

    // Add event listener to trigger hint reveal
    hintButton.addEventListener("click", () => {
        if (inGameState.hintsUsed < 3) {
            revealHint();
            inGameState.hintsUsed++;
            if (inGameState.hintsUsed >= 3) {
                hintButton.disabled = true;
                hintButton.style.backgroundColor = "gray"; // Disable visual feedback
                hintButton.style.cursor = "not-allowed";
                hintButton.textContent = "No more hints";
            }
        }
    });

    document.body.appendChild(hintButton);
}

/**
 * Removes the Hint button from the game.
 */
function removeHintButton() {
    const hintButton = document.getElementById("hintButton");
    if (hintButton) {
        hintButton.remove();
    }
}

/**
 * Reveals a hint for the current puzzle.
 */
function revealHint() {
    if (!inGameState.puzzle) {
        console.error("No puzzle loaded to reveal a hint.");
        return;
    }

    let hintMessage = "";

    switch (inGameState.theme) {
        case "movies":
        case "books":
            hintMessage = inGameState.puzzle.author
                ? `Hint: Author - ${inGameState.puzzle.author}`
                : "Hint: No author available.";
            break;
        case "songs":
            hintMessage = `Hint: Artist - ${inGameState.puzzle.artist || "Unknown"}`;
            break;
        case "countries":
            hintMessage = `Hint: ${inGameState.puzzle.emoji}`;
            break;
        default:
            hintMessage = "Hint: No hint available.";
    }

    console.log(hintMessage);

    inGameState.score -= 15; // Deduct points for using a hint
    revealOneLetter();
}

/**
 * Reveals one random unrevealed letter in the puzzle title.
 */
function revealOneLetter() {
    const solution = inGameState.puzzle.title;
    const availableIndices = solution
        .split("")
        .map((char, i) => (currentInput[i] === null && char !== " " ? i : null))
        .filter(index => index !== null);

    if (availableIndices.length > 0) {
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        currentInput[randomIndex] = solution[randomIndex].toUpperCase(); // Reveal the letter
        frozenLetters[randomIndex] = true; // Freeze it as a correct letter

        // Update the board to reflect the revealed letter
        updateBoard(currentInput, solution, false);
    } else {
        console.log("No letters left to reveal.");
    }
}