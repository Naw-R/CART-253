/*
 * Audio Management
 *
 * Preloads all game sound assets and controls their playback. 
 * The background music plays in a loop with adjusted volume, and 
 * the buzz sound’s volume changes based on the distance to the player.
 * 
 * Functions:
 * - preloadAudio(); – Preloads all sound assets to prevent lag during gameplay.
 * - playBackgroundMusic(); – Plays background music on loop with adjusted volume.
 * - updateBuzzSound(distance); – Adjusts the buzz sound volume dynamically based on the frog’s distance.
 */

// Audio Variables
let backgroundMusic;
let frogSound;
let buzzSound;
let powerupSound;

/**
 * Preloads all sound assets.
 */
function preloadAudio() {
    backgroundMusic = loadSound('assets/sounds/background.mp3');
    frogSound = loadSound('assets/sounds/frog.mp3');
    buzzSound = loadSound('assets/sounds/buzz.mp3');
    powerupSound = loadSound('assets/sounds/powerup.mp3');
}

/**
 * Plays the background music in a loop with adjusted volume.
 */
function playBackgroundMusic() {
    backgroundMusic.loop();
    backgroundMusic.setVolume(0.3);
}

/**
 * Adjusts buzz sound volume based on distance.
 */
function updateBuzzSound(distance) {
    let volume = map(distance, 0, width, 1, 0);
    buzzSound.setVolume(volume);
    if (!buzzSound.isPlaying()) {
        buzzSound.loop();
    }
}
