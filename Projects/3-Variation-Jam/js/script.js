/**
 * script.js
 * Handles the overall game state, UI transitions, and main menu rendering.
 */

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
    clearCanvas();

    switch (currentGameState) {
        case GameState.MAIN_MENU:
            renderMainMenu();
            break;
        case GameState.THEME_LOBBY:
            renderThemeLobby();
            break;
        case GameState.GAMEPLAY:
            renderGameplay();
            if (timerRunning) updateTimer(); // Ensure the timer updates during gameplay
            break;
    }
}

/**
 * Updates the current game state and reinitializes the UI.
 * @param {string} newState - The new game state.
 */
function updateState(newState) {
    currentGameState = newState;
    clearCanvas();
    clearButtons();

    if (newState === GameState.MAIN_MENU) {
        renderMainMenu();
    } else if (newState === GameState.THEME_LOBBY) {
        renderThemeLobby();
    } else if (newState === GameState.GAMEPLAY) {
        startGameplay();
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
 * Renders the main menu with theme options and a mute button.
 */
function renderMainMenu() {
    // Display background image
    if (backgroundImage) {
        image(backgroundImage, 0, 0, width, height);
    }

    // Display title
    textSize(48);
    textAlign(CENTER, CENTER);
    fill(255);
    text("Guess the Emoji Game!", width / 2, height / 4);

    // Display theme buttons
    if (themeButtons.length === 0) {
        const themes = ["movies", "songs", "books", "tv", "countries", "brands"];
        themes.forEach((theme, index) => {
            createThemeButton(
                capitalize(theme),
                height / 3 + index * 60,
                () => selectTheme(theme)
            );
        });
    }

    // Display mute button
    if (!muteButton) {
        muteButton = createButton("Mute");
        muteButton.position(width - 100, 20);
        muteButton.mousePressed(toggleBackgroundMusic);
    }

    // Ensure background music is playing
    playBackgroundMusic();
}

/**
 * Renders the theme lobby with the title and navigation buttons.
 */
function renderThemeLobby() {
    // Display theme title
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(0);
    text(`${capitalize(selectedTheme)} Theme`, width / 2, height / 5);

    // Create Start Game button
    if (!startButton) {
        startButton = createButton("Start Game");
        startButton.position(width / 2 - 50, height / 2);
        startButton.size(100, 50);
        startButton.mousePressed(() => updateState(GameState.GAMEPLAY));
    }

    // Create Return to Main Menu button
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
    timer = 60; // Reset timer to 60 seconds
    timerRunning = true;
    lastSecondTime = millis(); // Initialize lastSecondTime
    loadTheme(selectedTheme); // Load the selected theme (defined in game.js)
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

    // Display puzzle (handled by game.js)
    if (inGameState.puzzle) {
        drawGameBoard(inGameState.puzzle.emoji, inGameState.puzzle.title); // Render emojis and slots
    }

    // Create Return to Main Menu button
    if (!backButton) {
        backButton = createButton("Return to Main Menu");
        backButton.position(width / 2 - 100, height - height / 8); // Bottom center
        backButton.size(200, 40);
        backButton.mousePressed(() => {
            timerRunning = false; // Stop the timer
            updateState(GameState.MAIN_MENU); // Go back to the main menu
        });
    }
}

/**
 * Toggles background music on/off.
 */
function toggleBackgroundMusic() {
    if (backgroundMusic.isPlaying()) {
        backgroundMusic.stop();
        muteButton.html("Unmute");
    } else {
        backgroundMusic.loop();
        muteButton.html("Mute");
    }
}

/**
 * Plays the background music if not already playing.
 */
function playBackgroundMusic() {
    if (backgroundMusic && !backgroundMusic.isPlaying()) {
        backgroundMusic.loop();
    }
}

/**
 * Clears all buttons on the screen.
 */
function clearButtons() {
    themeButtons.forEach(button => button.remove());
    themeButtons = [];
    if (startButton) {
        startButton.remove();
        startButton = null;
    }
    if (backButton) {
        backButton.remove();
        backButton = null;
    }
    if (muteButton) {
        muteButton.remove();
        muteButton = null;
    }
}

/**
 * Creates a button for a theme.
 * @param {string} label - The button label.
 * @param {number} y - The vertical position of the button.
 * @param {function} onClick - The function to call on button press.
 */
function createThemeButton(label, y, onClick) {
    const button = createButton(label);
    button.position(width / 2 - 100, y);
    button.size(200, 40);
    button.mousePressed(onClick);
    themeButtons.push(button);
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

/**
 * Handles theme selection and transitions to the theme lobby.
 * @param {string} theme - The selected theme.
 */
function selectTheme(theme) {
    if (!theme) {
        console.error("Invalid theme selected");
        return;
    }
    selectedTheme = theme; // Set the selected theme
    console.log(`Theme selected: ${theme}`); // Debug log
    updateState(GameState.THEME_LOBBY); // Transition to the theme lobby
}