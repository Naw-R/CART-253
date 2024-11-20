/**
 * mainmenu.js
 * Main menu functionality for the Emoji Word Guessing Game
 */

// Global variables for main menu
let inMainMenu = true; // Tracks if we are in the main menu
let menuButtons = []; // Stores references to menu buttons

/**
 * Displays the main menu.
 */
function displayMenu() {
    background(255);
    inMainMenu = true;
    selectedTheme = null;

    // Clear existing buttons
    clearMenuButtons();

    // Display the welcome message
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(50);
    text("Welcome to the Crossword Emoji Game!", width / 2, 100);

    // Create theme buttons
    textSize(20);
    createThemeButton("Movie Titles", 200, () => selectTheme("movies"));
    createThemeButton("Song Lyrics", 260, () => selectTheme("songs"));
    createThemeButton("Book Titles", 320, () => selectTheme("books"));
    createThemeButton("TV Shows", 380, () => selectTheme("tv"));
    createThemeButton("Countries and Capitals", 440, () => selectTheme("countries"));
    createThemeButton("Brands and Logos", 500, () => selectTheme("brands"));
}

/**
 * Creates a button for a theme in the main menu.
 */
function createThemeButton(label, y, onClick) {
    let button = createButton(label);
    button.position(width / 2 - 100, y);
    button.size(200, 40);
    button.mousePressed(onClick);
    menuButtons.push(button); // Store the button reference
}

/**
 * Clears all buttons in the main menu.
 */
function clearMenuButtons() {
    for (let button of menuButtons) {
        button.remove(); // Remove each button
    }
    menuButtons = []; // Reset the buttons array
}

/**
 * Handles theme selection.
 */
function selectTheme(theme) {
    selectedTheme = theme;
    console.log(`Selected theme: ${theme}`);
    inMainMenu = false;
    
    clearMenuButtons(); // Clear all buttons from the main menu
    startTimer(); // Start the timer
    redraw(); // Trigger redraw to show the theme page
}
