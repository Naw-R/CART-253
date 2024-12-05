/** * 
 * Guess the Emoji
 * Rowan Nasser
 * Guess the Emoji game using the P5.js library.
 * 
 * This file manages the logic and creation of puzzles in the Emoji Word Guessing Game. 
 * It includes functionality to extract puzzles from data, validate user input, handle game flow,
 * and manage UI elements like hint and skip buttons.
 * 
 * Functions Overview:
 *   - extractPuzzles(data, themeName): Extracts and normalizes puzzle data for the selected theme.
 *   - checkWord(userInput, solution): Validates the player's input against the solution and updates the score.
 *   - loadNextPuzzle(): Transitions to the next puzzle or ends the game if the limit is reached.
 *   - skipPuzzle(): Skips the current puzzle with a penalty to the score.
 *   - addSkipButton(): Creates and displays the Skip button.
 *   - removeSkipButton(): Removes the Skip button from the UI.
 *   - addHintButton(): Creates and displays the Hint button.
 *   - removeHintButton(): Removes the Hint button from the UI.
 *   - revealHint(): Reveals a hint for the current puzzle and adjusts the score.
 *   - revealOneLetter(): Reveals a random unrevealed letter in the solution.
 *   - displayScore(): Displays the current score on the screen.
 */

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
 * Validates the user's input against the solution and updates the game state.
 * @param {Array} userInput - The array of letters guessed by the user.
 * @param {string} solution - The correct word or phrase to guess.
 */
function checkWord(userInput, solution) {
    if (!Array.isArray(userInput)) {
        console.error("Invalid userInput: Expected an array, received:", userInput);
        return;
    }

    // Clean and prepare the input and solution for comparison
    const trimmedInput = userInput.filter((char) => char !== null).join("").trim();
    const trimmedSolution = solution.replace(/\s/g, "").trim();

    if (trimmedInput.length !== trimmedSolution.length) {
        console.warn("Input length does not match solution length.");
        return;
    }

    let isWordCorrect = true; // Track overall correctness

    // Iterate through the solution and user input for validation
    for (let i = 0; i < solution.length; i++) {
        const solutionChar = solution[i]; // Current solution character
        const userChar = userInput[i]; // Current user input character

        if (solutionChar === " ") {
            // Handle spaces: skip processing and continue
            continue;
        }

        if (/[a-zA-Z0-9]/.test(solutionChar)) { // Process only valid alphanumeric characters
            if (userChar?.toLowerCase() === solutionChar.toLowerCase()) {
                frozenLetters[i] = true; // Mark this letter as correctly guessed
                inGameState.score += 10; // Add score for correct letter
            } else {
                isWordCorrect = false; // Mark the word as incorrect
            }
        }
    }

    // Update the board to reflect changes visually
    updateBoard(userInput, solution, true);

    // Handle end-of-word state
    if (isWordCorrect) {
        console.log("Correct word guessed! Moving to the next puzzle.");
        inGameState.score += 50; // Bonus points for solving the word
        loadNextPuzzle(); // Proceed to the next puzzle
    } else {
        console.log("Incorrect guess. Keep trying!");
    }
}

/**
 * Loads the next puzzle in sequence or returns to the theme lobby.
 */
function loadNextPuzzle() {
    // Increment the round count when moving to the next puzzle
    inGameState.roundCount++;

    if (inGameState.roundCount >= 10) {
        endGame(true); // End the game, passing "true" to indicate completion
        resetGameState(); // Reset the game
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

/**
 * Displays the current score
 */
function displayScore() {
    //Display the score
    textSize(24);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(0);
    text(`Score: ${inGameState.score}`, window.innerWidth / 2, 100);
}