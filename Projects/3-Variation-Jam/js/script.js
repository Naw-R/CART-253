/**
 * Emoji Word Guessing Game
 * Rowan Nasser
 * 
 */

"use strict";

// Global variables to store JSON data for each theme
let movieData, songData, bookData, tvData, countryData, brandData;

// Variable to track the currently selected theme
let selectedTheme = null;

// Variable to track whether the user is in the main menu or a theme page
let inMainMenu = true;

// Array to store references to buttons in the main menu
let menuButtons = [];

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
    }
}

// Function to display the main menu
function displayMenu() {
    background(255);
    inMainMenu = true;
    selectedTheme = null;

    // Clear existing buttons from previous screens
    clearMenuButtons();

    // Display the welcome screen
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(50);
    text("Welcome to the Crossword Emoji Game!", width / 2, 100);

    // Create buttons for each theme
    textSize(20);
    createThemeButton("Movie Titles", 200, () => selectTheme("movies"));
    createThemeButton("Song Lyrics", 260, () => selectTheme("songs"));
    createThemeButton("Book Titles", 320, () => selectTheme("books"));
    createThemeButton("TV Shows", 380, () => selectTheme("tv"));
    createThemeButton("Countries and Capitals", 440, () => selectTheme("countries"));
    createThemeButton("Brands and Logos", 500, () => selectTheme("brands"));
}

// Function to display the theme page
function displayThemePage() {
    background(255);
    inMainMenu = false;

    // Clear existing buttons from the main menu
    clearMenuButtons();

    textSize(24);
    textAlign(CENTER, CENTER);
    fill(50);

    // Show theme-specific content
    switch (selectedTheme) {
        case "movies":
            text("Movies Theme Selected!", width / 2, height / 2 - 100);
            break;
        case "songs":
            text("Song Lyrics Theme Selected!", width / 2, height / 2 - 100);
            break;
        case "books":
            text("Book Titles Theme Selected!", width / 2, height / 2 - 100);
            break;
        case "tv":
            text("TV Shows Theme Selected!", width / 2, height / 2 - 100);
            break;
        case "countries":
            text("Countries and Capitals Theme Selected!", width / 2, height / 2 - 100);
            break;
        case "brands":
            text("Brands and Logos Theme Selected!", width / 2, height / 2 - 100);
            break;
        default:
            text("No theme selected.", width / 2, height / 2 - 100);
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

// Function to create a button for each theme
function createThemeButton(label, y, onClick) {
    let button = createButton(label);
    button.position(width / 2 - 100, y);
    button.size(200, 40);
    button.mousePressed(onClick);
    menuButtons.push(button); // Store the button reference for later removal
}

// Function to handle theme selection
function selectTheme(theme) {
    selectedTheme = theme;
    console.log(`Selected theme: ${theme}`);
    inMainMenu = false;
    redraw(); // Trigger draw to show the theme page
}

// Function to remove all buttons created in the main menu
function clearMenuButtons() {
    for (let button of menuButtons) {
        button.remove(); // Remove each button
    }
    menuButtons = []; // Clear the menuButtons array
}
