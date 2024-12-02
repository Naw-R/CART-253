/**
 * timer.js
 * Timer functionality for the Emoji Word Guessing Game
 */


/**
 * Starts the timer.
 */
function startTimer() {
    timerRunning = true; // Enable the timer
    lastSecondTime = millis(); // Record the starting time
    timer = 60; // Reset to the default 60 seconds (or use puzzle-specific time if needed)
    console.log("Timer started!");
}

/**
 * Updates the timer countdown logic and triggers game over when time runs out.
 */
function updateTimer() {
    if (!timerRunning) return; // Exit if the timer is not active

    const currentTime = millis();
    if (currentTime - lastSecondTime >= 1000) { // Check if 1 second has passed
        timer--; // Decrement the timer
        lastSecondTime = currentTime; // Update the last recorded time

        // Handle timer running out
        if (timer <= 0) {
            console.log("Time's up!");
            timerRunning = false; // Stop the timer
            gameOver(); // Trigger game over logic
        }
    }

    // Update the visual representation of the timer
    drawTimerBar(timer);
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
    console.log("Timer stopped!");
}

/**
 * Handles the logic when the timer runs out.
 */
function gameOver() {
    console.log("Game Over! Timer ran out.");

    // End the current puzzle
    timerRunning = false; // Ensure the timer is stopped
    alert(`Time's up! The correct answer was: ${inGameState.puzzle.title}`);

    // Transition to the next puzzle or theme lobby
    loadNextPuzzle(); // Move to the next puzzle
}

/**
 * Draws the timer bar and numerical display.
 * @param {number} remainingTime - The remaining time in seconds.
 */
function drawTimerBar(remainingTime) {
    const timerProgress = map(remainingTime, 0, 60, 0, 1); // Map timer to a 0-1 range
    let timerColor;

    if (remainingTime > 20) {
        timerColor = color(0, 255, 0); // Green
    } else if (remainingTime > 10) {
        timerColor = color(255, 165, 0); // Orange
    } else {
        timerColor = color(255, 0, 0); // Red
    }

    // Draw the timer bar visually
    noStroke();
    fill(timerColor);
    const timerWidth = width * timerProgress; // Adjust bar width based on time remaining
    rect(20, 2, timerWidth, 10, 20); // Draw the timer bar at the top of the screen

    // Draw numerical time
    textSize(24);
    fill(0);
    textAlign(RIGHT, TOP);
    text(`Time: ${remainingTime}s`, width - 20, 20);
}