/**
 * mainmenu.js
 * Main menu functionality for the Emoji Word Guessing Game
 */

// Array to store references to menu buttons
let menuButtons = [];


/**
 * Displays the main menu.
 */
function displayMenu() {
    background(255);
    inMainMenu = true;
    selectedTheme = null;

    clearMenuButtons();

    if (backgroundImage) {
        image(backgroundImage, 0, 0, width, height);
    }

    // Play background music (only if not already playing)
    console.log('Checking background music state...');
    if (backgroundMusic && !backgroundMusic.isPlaying()) {
        console.log('Playing background music');
        backgroundMusic.loop();
        backgroundMusic.setVolume(1);
    }

    // Create a mute button for user control
    createMuteButton();

    textSize(64);
    textAlign(CENTER, CENTER);
    fill(255);
    stroke(0);
    strokeWeight(5);
    text("Welcome to the Guess the Emoji Game!", width / 2, 100);

    textSize(20);
    createThemeButton("Movie Titles", 200, () => selectTheme("movies"));
    createThemeButton("Song Lyrics", 260, () => selectTheme("songs"));
    createThemeButton("Book Titles", 320, () => selectTheme("books"));
    createThemeButton("TV Shows", 380, () => selectTheme("tv"));
    createThemeButton("Countries and Capitals", 440, () => selectTheme("countries"));
    createThemeButton("Brands and Logos", 500, () => selectTheme("brands"));
}

/**
 * Creates a theme button and adds it to the global menuButtons array.
 */
function createThemeButton(label, y, onClick) {
    let button = createButton(label);
    button.position(width / 2 - 100, y);
    button.size(200, 40);
    button.mousePressed(onClick);
    menuButtons.push(button); // Store the button reference
}

/**
 * Clears all buttons created in the main menu.
 */
function clearMenuButtons() {
    for (let button of menuButtons) {
        button.remove(); // Remove each button
    }
    menuButtons = []; // Reset the array
}

/**
 * Stops background music playback.
 */
function stopBackgroundMusic() {
    if (backgroundMusic && backgroundMusic.isPlaying()) { // Added null check
        backgroundMusic.stop();
    }
}

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