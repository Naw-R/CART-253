/**
 * timer.js
 * Timer functionality for the Emoji Word Guessing Game
 */


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
/**
 * Updates the timer and handles timeout logic.
 */
function updateTimer() {
    if (timerRunning) {
        const currentTime = millis();
        if (currentTime - lastSecondTime >= 1000) { // Check if 1 second has passed
            timer--; // Decrement the timer
            lastSecondTime = currentTime; // Update lastSecondTime
        }
        if (timer <= 0) {
            timerRunning = false; // Stop the timer
            endGame(false); // Trigger game over (loss)
        }
    }
}

/**
 * Draws the timer on the canvas.
 */
function drawTimer() {
    if (timerRunning) {
        // Clear the area where the timer is drawn
        fill(255); // White background to "erase" previous timer text
        noStroke();
        rect(20, 20, 150, 40); // Clear the timer display area (adjust width/height as needed)

        // Draw the timer text
        textSize(24);
        fill(50); // Text color
        textAlign(LEFT, TOP);
        text(`Time Left: ${timer}s`, 20, 20); // Display the timer at a fixed position
    }
}

/**
 * Handles timeout logic when the timer reaches 0.
 */
function handleTimeOut() {
    console.log("Time's up! Revealing the correct phrase.");
    // Reveal the correct phrase or display a message
    endGame(false); // Call `endGame(false)` in game.js for losing condition
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

/**
 * Resets the timer
*/
function resetTimer() {
    timer = 60; // Example reset logic
    console.log("Timer reset to 60 seconds");
}

/**

 * Stops the timer.
 */
function stopTimer() {
    timerRunning = false; // Disable the timer
    console.log("Timer stopped."); // Log for debugging purposes
}

