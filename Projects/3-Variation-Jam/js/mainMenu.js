/**
 * The Main Menu Script
 * 
 * This script handles the main menu functionality for the Emoji Word Guessing Game.
 * It includes rendering the menu, managing theme selection, and controlling background music.
 * 
 * Functions Overview:
 * - renderMainMenu(): Displays the main menu with theme options and a mute button.
 * - createThemeButton(label, y, onClick): Dynamically creates buttons for theme selection.
 * - clearButtons(): Clears all buttons and UI elements from the screen.
 * - toggleBackgroundMusic(): Toggles background music on or off.
 * - createMuteButton(): Creates a button to mute or unmute the background music.
 * - playBackgroundMusic(): Ensures background music is playing.
 * - selectTheme(theme): Handles theme selection and transitions to the theme lobby.
 */

// Array to store references to menu buttons
let menuButtons = [];

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

    // Also remove Skip and Hint buttons
    removeSkipButton();
    removeHintButton();
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
 * Creates a mute button for the background music
 */
function createMuteButton() {
    // Create a "Mute" button
    let muteButton = createButton('Mute');
    muteButton.size(100, 40); // Set button size
    muteButton.position(1400, 10); // Position the button at the top-right corner
    muteButton.mousePressed(() => {
        if (backgroundMusic && backgroundMusic.isPlaying()) {
            backgroundMusic.stop(); // Stop the music
            muteButton.html('Unmute'); // Update button label
        } else if (backgroundMusic) {
            backgroundMusic.loop(); // Play the music
            backgroundMusic.setVolume(0.5); // Adjust volume
            muteButton.html('Mute'); // Update button label
        }
    });
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