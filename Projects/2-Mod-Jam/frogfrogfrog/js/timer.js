//this is timer.js

let timer = 60; // 60-second countdown

function startTimer() {
    setInterval(() => {
        if (gameState === "playing" && timer > 0) timer--;
    }, 1000);
}

function displayTimer() {
    fill(0);
    textSize(20);
    text(`Time: ${timer}s`, width - 100, 10);
}
