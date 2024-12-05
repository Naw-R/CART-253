/**
 * This is puzzle.js
 * 
 * Puzzle.js handles the creation and logic of the puzzle
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
    // Increment the round count when moving to the next puzzle
    inGameState.roundCount++;

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