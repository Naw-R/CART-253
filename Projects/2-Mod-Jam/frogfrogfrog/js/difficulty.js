/*
 * Difficulty Adjustment Logic
 *
 * This module dynamically increases the fly's speed as the player progresses, 
 * adding challenge to the gameplay. The speed increases every time the score 
 * reaches a multiple of 3, ensuring that the game becomes progressively harder 
 * as more flies are caught.
 *
 * Function:
 * - increaseDifficulty(); – Checks if the score is a multiple of 3 and increases the fly’s speed accordingly.
 */

function increaseDifficulty() {
    if (score % 3 === 0) goodFly.speed += 1; // Increase fly speed every 3 flies
}

function decreaseDifficulty(){
    const b = dist(frog.tongue.x, frog.tongue.y, badFly.x, badFly.y);
    if (b < frog.tongue.size / 2 + badFly.size / 2) {
        goodFly.speed -= 1; // Decrease fly speed every bad fly
    }
    
}
