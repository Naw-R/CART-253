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
