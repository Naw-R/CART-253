/* The Main Script
* 
* This script manages the core functionality of the Emoji Word Guessing Game.
* It handles the overall game state, UI transitions, and rendering for the
* theme selection and gameplay screens.
*
* Functions Overview:
* - preload(): Loads assets such as background images and music.
* - setup(): Initializes the canvas and sets the initial game state.
* - draw(): Continuously renders the UI based on the active game state.
* - updateState(): Switches between game states and resets UI elements.
* - clearCanvas(): Clears the screen and renders the appropriate background.
* - renderThemeLobby(): Displays the theme selection lobby with start options.
* - renderGameplay(): Manages the gameplay UI, including puzzles and the timer.
* - startGameplay(): Initializes the gameplay environment and logic.
* - capitalize(): Helper function to format strings.
**/

// Game state constants
const GameState = {
    MAIN_MENU: "mainMenu",
    THEME_LOBBY: "themeLobby",
    GAMEPLAY: "gameplay",
};

// Global variables
let currentGameState = GameState.MAIN_MENU; // Initial state
let selectedTheme = null; // Stores the selected theme
let timer = 60; // Countdown timer for gameplay
let timerRunning = false; // Whether the timer is active
let lastSecondTime; // Tracks the last recorded time for the timer

// UI elements
let themeButtons = [];
let startButton = null;
let backButton = null;
let muteButton = null;

// Assets
let backgroundImage;
let backgroundMusic;

/**
 * Preloads assets like images and sounds.
 */
function preload() {
    backgroundImage = loadImage("assets/images/background.jpg");
    backgroundMusic = loadSound("assets/sounds/background.mp3");
}

/**
 * Sets up the canvas and initializes the main menu.
 */
function setup() {
    createCanvas(windowWidth, windowHeight);
    updateState(GameState.MAIN_MENU); // Initialize to main menu
}

/**
 * Main draw loop to render UI based on the current game state.
 */
function draw() {
    // Clear the canvas for the current frame
    clearCanvas();

    // Debugging log to track the current game state
    console.log("Current game state in draw():", currentGameState);

    // Switch between different game states
    switch (currentGameState) {
        case GameState.MAIN_MENU:
            renderMainMenu(); // Render the main menu
            break;
        case GameState.THEME_LOBBY:
            renderThemeLobby(); // Render the theme lobby
            break;
        case GameState.GAMEPLAY:
            if (!inGameState.puzzle) {
                console.error("No puzzle initialized. Cannot render gameplay.");
                return; // Stop rendering if no puzzle is loaded
            }

            renderGameplay(); // Render the gameplay UI

            if (timerRunning) {
                updateTimer(); // Update the timer during gameplay
            }

            updateBoard(currentInput, inGameState.puzzle.title); // Update the puzzle board with user input
            break;
        default:
            console.error("Unknown game state:", currentGameState);
            break;
    }
}

/**
 * Updates the current game state and reinitializes the UI.
 * @param {string} newState - The new game state.
 */
function updateState(newState) {
    console.log(`State transitioning from ${currentGameState} to ${newState}`);

    // Update the global game state
    currentGameState = newState;

    // Clear the canvas and reset all buttons/UI elements
    clearCanvas();
    clearButtons();

    // Remove the Skip and Hint buttons when leaving gameplay
    removeSkipButton();
    removeHintButton();

    // Handle transitions based on the new state
    switch (newState) {
        case GameState.MAIN_MENU:
            renderMainMenu(); // Render the main menu
            break;

        case GameState.THEME_LOBBY:
            renderThemeLobby(); // Render the theme selection screen
            break;

        case GameState.GAMEPLAY:
            startGameplay(); // Initialize the gameplay state
            break;

        default:
            console.error(`Unknown game state: ${newState}`);
            break;
    }
    
}

/**
 * Clears the canvas and resets the background.
 */
function clearCanvas() {
    background(255);
    if (currentGameState === GameState.MAIN_MENU && backgroundImage) {
        image(backgroundImage, 0, 0, width, height);
    }
}

/**
 * Renders the theme lobby with the title and navigation buttons.
 */
function renderThemeLobby() {
    console.log("Current game state:", currentGameState);
    console.log("Current puzzle:", inGameState.puzzle);

    textSize(32);
    textAlign(CENTER, CENTER);
    fill(0);
    text(`${capitalize(selectedTheme)} Theme`, width / 2, height / 5);

    if (!startButton) {
        startButton = createButton("Start Game");
        startButton.position(width / 2 - 50, height / 2);
        startButton.size(100, 50);
        startButton.mousePressed(() => {
            console.log("Start Game button pressed");
            updateState(GameState.GAMEPLAY);
        });
    }

    if (!backButton) {
        backButton = createButton("Return to Main Menu");
        backButton.position(width / 2 - 100, height - height / 8);
        backButton.size(200, 40);
        backButton.mousePressed(() => updateState(GameState.MAIN_MENU));
    }
}

/**
 * Starts the gameplay.
 */
function startGameplay() {
    console.log("Starting gameplay...");
    timer = 60; // Reset timer
    timerRunning = true; // Activate timer
    lastSecondTime = millis(); // Start time tracking
    loadTheme(selectedTheme); // Load the puzzle based on the theme
}

/**
 * Renders the gameplay UI with the timer, theme title, and puzzle.
 */
/**
 * Renders the gameplay UI with the timer, theme title, and puzzle.
 */
function renderGameplay() {
    // Display timer
    textSize(24);
    textAlign(LEFT, TOP);
    fill(0);
    text(`Time: ${timer}s`, 20, 20); // Top-left timer display

    // Display theme title
    textAlign(CENTER, TOP);
    textSize(32);
    text(`${capitalize(selectedTheme)} Theme`, width / 2, 20); // Top-center theme title

    // Ensure puzzle is initialized before rendering
    if (!inGameState.puzzle || !inGameState.puzzle.emoji || !inGameState.puzzle.title) {
        console.error("Puzzle data is missing or incomplete. Cannot render gameplay.");
        return; // Stop further rendering if the puzzle is invalid
    }

    // Render emojis and slots
    updateBoard(currentInput, inGameState.puzzle.title, false); 

    // Create Return to Main Menu button
    if (!backButton) {
        backButton = createButton("Return to Main Menu");
        backButton.position(width / 2 - 100, height - height / 8); // Bottom center
        backButton.size(200, 40);
        backButton.mousePressed(() => {
            timerRunning = false; // Stop the timer
            removeSkipButton(); // Remove the Skip button
            removeHintButton(); // Remove the Hint button
            updateState(GameState.MAIN_MENU); // Go back to the main menu
            resetGameState(); // Reset the game state
        });
    }
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
function capitalize(str) {
    if (!str || typeof str !== "string") {
        console.error("Invalid string provided to capitalize:", str);
        return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}