//This is in score.js

// Initialize score
let score = 0;

/**
 * Increase the score and adjust the background music rate
 */
function increaseScore() {
    score++;
    let rate = map(score, 0, 20, 1, 1.5); // Adjust music speed based on score
    backgroundMusic.rate(rate);
}

/**
 * Display the current score on the screen
 */
function displayScore() {
    fill(0); // Black text color
    textSize(24); // Set text size
    textAlign(LEFT, TOP); // Align text to the top-left corner
    text(`Score: ${score}`, 10, 10); // Display the score
}

