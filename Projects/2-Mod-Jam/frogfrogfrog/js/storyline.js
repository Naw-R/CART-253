// this is storyline.js
let gameState = "intro"; // States: intro, playing, win, lose
let scorelevel = 10;

function displayIntro() {
    background(255); // Ensure a white background clears the canvas
    textSize(24);
    textAlign(CENTER, CENTER);
    fill(0); // Black text color
    text("Help Frodo catch flies before the feast begins!", width / 2, height / 2);
    text("Goal : catch 10 flies before the timeout!", width / 2, height / 2 + 40);

    textSize(16);
    text("Click to Start", width / 2, height / 2 + 80); // Prompt user to start
}

function displayWin() {
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(0); // Black text color
    text("Frodo feasts like a king!", width / 2, height / 2);
    text("You Win!", width / 2, height / 2 + 40);
    noLoop();
}

function displayLose() {
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(0); // Black text color
    text("Time's up! Frodo's feast is over.", width / 2, height / 2);
    text("You Lost!", width / 2, height / 2 + 40);
    noLoop();
}

function updateGameState() {
    if (timer <= 0) {
        gameState = "lose";
        noLoop(); // Stop draw loop
        return;
    }
    if (score >= scorelevel) {
        gameState = "win";
        noLoop(); // Stop draw loop
        return;
    }
}
