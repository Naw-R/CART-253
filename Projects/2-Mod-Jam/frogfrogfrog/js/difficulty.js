/*
 * Difficulty Adjustment
 *
 * Increases the fly’s speed every time the score is a multiple of 3, 
 * making the game more challenging as the player catches more flies.
 */

function increaseDifficulty() {
    if (score % 3 === 0) fly.speed += 1; // Increase fly speed every 5 flies
}
