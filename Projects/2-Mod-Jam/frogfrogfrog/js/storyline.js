// this is storyline.js
let gameState = "intro"; // States: intro, playing, win, lose

function displayIntro() {
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Help Frodo catch flies before the feast begins!", width / 2, height / 2);
}

function displayWin() {
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Frodo feasts like a king!", width / 2, height / 2);
    noLoop();
}

function displayLose() {
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Time's up! Frodo's feast is over.", width / 2, height / 2);
    noLoop();
}

function updateGameState() {
    if (timer <= 0) {
        gameState = "lose";
        noLoop(); // Stop draw loop
        return;
    }
    if (score >= 10) {
        gameState = "win";
        noLoop(); // Stop draw loop
        return;
    }
}
