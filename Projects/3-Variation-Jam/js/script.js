/**
 * Emoji Word Guessing Game
 * Rowan Nasser
 * Main running page of the game
 */

"use strict";

// Global variables to store JSON data for each theme
let movieData, songData, bookData, tvData, countryData, brandData;

// Variable to track the currently selected theme
let selectedTheme = null;

function preload() {
    // Load JSON files for all themes
    movieData = loadJSON("assets/data/movieTitles.json");
    songData = loadJSON("assets/data/songLyrics.json");
    bookData = loadJSON("assets/data/bookTitles.json");
    tvData = loadJSON("assets/data/tvShows.json");
    countryData = loadJSON("assets/data/countriesAndCapitals.json");
    brandData = loadJSON("assets/data/brandsAndLogos.json");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    displayMenu(); // Display the main menu initially
}

function draw() {
    if (!inMainMenu && selectedTheme) {
        displayThemePage(); // Display the theme page when a theme is selected
        updateTimer(); // Update the timer
        drawTimer(); // Draw the timer
    }
}

/**
 * Displays the theme page when a theme is selected.
 */
function displayThemePage() {
    background(255);

    textSize(24);
    textAlign(CENTER, TOP);
    fill(50);

    // Show theme-specific content
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

    // Create a button to return to the main menu
    let backButton = createButton("Return to Menu");
    backButton.position(width / 2 - 100, height - 100);
    backButton.size(200, 40);
    backButton.mousePressed(() => {
        backButton.remove(); // Remove the back button
        displayMenu(); // Go back to the main menu
    });
}
