/*
 * Score Management Logic
 *
 * This module handles the tracking and display of the player’s score and dynamically adjusts 
 * the background music speed to enhance the gameplay experience. The score is shown in the 
 * top-left corner to provide real-time feedback on the player’s progress towards the goal.
 *
 * Functions:
 * - increaseScore() – Increases the score by 1 and maps the score to adjust the background music speed.
 * - displayScore() – Renders the current score on the screen in the top-left corner for player feedback.
 */


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
    text(`Score: ${score}/${scorelevel}`, 10, 10); // Display the score
}

