//this is timer.js

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
