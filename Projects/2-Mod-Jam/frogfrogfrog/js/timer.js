/*
 * Timer Logic to Control Game Duration
 *
 * This code starts a 40-second countdown and makes sure the timer only runs once, 
 * preventing it from restarting if the player clicks multiple times. The timer decreases 
 * by 1 second every 1000 milliseconds and stops when the game ends or time runs out.
 */


let timer = 40; // 40-second countdown
let timerStarted = false; // Flag to prevent multiple timers

function startTimer() {
    if (!timerStarted) { // Start only if not already running
        timerStarted = true;
        setInterval(() => {
            if (gameState === "playing" && timer > 0) {
                timer--;
            }
        }, 1000); // Decrease every second
    }
}

function displayTimer() {
    fill(0); // Black text for visibility
    textSize(20);
    text(`Time: ${timer}s`, width - 100, 10); // Display timer
}
