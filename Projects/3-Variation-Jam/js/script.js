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

// Variable to track if the game is waiting in the theme lobby
let inThemeLobby = true;

// Variable to store the "Start" button reference
let startButton = null;

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
            displayThemePage(); // Display the theme lobby with "Start" button
            displayStartButton();   // Display the start button
        } else {
            displayThemePage();
            updateTimer(); // Start updating the timer once the game starts
            drawTimer(); // Display the timer
        }
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
        resetGameState();
    });
}
function displayStartButton(){
    // Create the "Start" button if it doesn't exist
    if (!startButton) {
        startButton = createButton("Start Game");
        startButton.position(width / 2 - 50, height / 2); // Centered
        startButton.size(100, 50);
        startButton.mousePressed(() => {
            inThemeLobby = false; // Transition to gameplay
            startButton.remove(); // Remove the "Start" button
            startButton = null; // Reset the button reference
            startTimer(); // Begin the timer
        });
    }
}

/**
 * Resets the game state and navigates back to the main menu.
 */
function resetGameState() {
    // Remove any buttons
    if (startButton) startButton.remove();
    startButton = null;

    // Reset game variables
    selectedTheme = null;
    inThemeLobby = true;

    // Stop the timer
    timerActive = false;

    // Return to the main menu
    displayMenu();
}

function clearCanvas(){
    background(255);
}