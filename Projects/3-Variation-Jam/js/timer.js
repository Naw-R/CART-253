/**
 * timer.js
 * Timer functionality for the Emoji Word Guessing Game
 */

// Timer variables
let timer = 60; // Start at 60 seconds
let lastSecondTime = 0; // Track the last time the timer updated
let timerRunning = false; // Flag to control when the timer is active

/**
 * Starts the timer.
 */
function startTimer() {
    timer = 60; // Reset timer to 60 seconds
    lastSecondTime = millis(); // Record the start time
    timerRunning = true; // Enable the timer
}

/**
 * Updates the timer every second.
 */
function updateTimer() {
    if (timerRunning) {
        let currentTime = millis();
        if (currentTime - lastSecondTime >= 1000) { // Check if 1 second has passed
            timer--; // Decrease the timer by 1
            lastSecondTime = currentTime; // Update the last time
        }
        if (timer <= 0) {
            timerRunning = false; // Stop the timer
            handleTimeOut(); // Call timeout logic
        }
    }
}

/**
 * Draws the timer on the canvas.
 */
function drawTimer() {
    textSize(24);
    textAlign(LEFT, TOP);
    fill(50);
    text(`Time Left: ${timer}s`, 20, 20); // Display the timer on the top left
}

/**
 * Handles timeout logic when the timer reaches 0.
 */
function handleTimeOut() {
    console.log("Time's up! Revealing the correct phrase.");
    // Reveal the correct phrase or display a message
    displayCorrectAnswer();
    // Add any transition logic (e.g., countdown to next round)
}

/**
 * Displays the correct answer on timeout.
 */
function displayCorrectAnswer() {
    background(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(255, 0, 0);
    text("Time's up! The correct phrase was:", width / 2, height / 2 - 50);
    text(selectedPhrase.title, width / 2, height / 2); // Replace with the correct phrase
}
