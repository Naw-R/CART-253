/**
 * Emoji Word Guessing Game
 * Rowan Nasser
 * Main running page of the game
 */

"use strict";

// Global variables to store JSON data for each theme
let movieData, songData, bookData, tvData, countryData, brandData;

// Variables to track the game state
let selectedTheme = null;
let inThemeLobby = true;
let inMainMenu = true;

// Button references
let startButton = null;
let backButton = null;

// Assets
let backgroundImage;

function preload() {
    // Load JSON files for all themes
    movieData = loadJSON("assets/data/movieTitles.json");
    songData = loadJSON("assets/data/songLyrics.json");
    bookData = loadJSON("assets/data/bookTitles.json");
    tvData = loadJSON("assets/data/tvShows.json");
    countryData = loadJSON("assets/data/countriesAndCapitals.json");
    brandData = loadJSON("assets/data/brandsAndLogos.json");

    // Load the background image
    backgroundImage = loadImage("assets/images/background.jpg");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    displayMenu(); // Display the main menu initially
}

function draw() {
    if (!inMainMenu && selectedTheme) {
        if (inThemeLobby) {
            displayThemePage();
            displayStartButton();
        } else {
            displayThemePage();
            updateTimer();
            drawTimer();
        }
    }
}

/**
 * Handles window resizing to adjust button positions.
 */
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    updateButtonPositions();
}

/**
 * Updates button positions dynamically based on the current window size.
 */
function updateButtonPositions() {
    if (startButton) {
        startButton.position(width / 2 - 50, height / 2);
    }
    if (backButton) {
        backButton.position(width / 2 - 100, height - 100);
    }
}

/**
 * Displays the theme page when a theme is selected.
 */
function displayThemePage() {
    background(255);

    textSize(24);
    textAlign(CENTER, TOP);
    fill(25);
    stroke(0);
    strokeWeight(0);

    switch (selectedTheme) {
        case "movies":
            text("Movies Theme Selected!", width / 2, 30);
            break;
        case "songs":
            text("Song Lyrics Theme Selected!", width / 2, 30);
            break;
        case "books":
            text("Book Titles Theme Selected!", width / 2, 30);
            break;
        case "tv":
            text("TV Shows Theme Selected!", width / 2, 30);
            break;
        case "countries":
            text("Countries and Capitals Theme Selected!", width / 2, 30);
            break;
        case "brands":
            text("Brands and Logos Theme Selected!", width / 2, 30);
            break;
        default:
            text("No theme selected.", width / 2, 30);
    }

    displayBackButton();
}

/**
 * Displays the "Start Game" button.
 */
function displayStartButton() {
    if (!startButton) {
        startButton = createButton("Start Game");
        startButton.position(width / 2 - 50, height / 2);
        startButton.size(100, 50);
        startButton.mousePressed(() => {
            inThemeLobby = false;
            clearButtons();
            startTimer();
        });
    }
}

/**
 * Displays the "Return to Menu" button.
 */
function displayBackButton() {
    if (!backButton) {
        backButton = createButton("Return to Menu");
        backButton.position(width / 2 - 100, height - 100);
        backButton.size(200, 40);
        backButton.mousePressed(() => {
            resetGameState();
        });
    }
}

/**
 * Clears all existing buttons.
 */
function clearButtons() {
    // Clear start and back buttons
    if (startButton) {
        startButton.remove();
        startButton = null;
    }
    if (backButton) {
        backButton.remove();
        backButton = null;
    }
    // Clear main menu buttons
    clearMenuButtons();
}

/**
 * Handles theme selection.
 */
function selectTheme(theme) {
    selectedTheme = theme;
    inMainMenu = false;
    clearButtons();
    inThemeLobby = true;
}

/**
 * Resets the game state and navigates back to the main menu.
 */
function resetGameState() {
    clearButtons();
    selectedTheme = null;
    inThemeLobby = true;
    inMainMenu = true;
    displayMenu();
}
