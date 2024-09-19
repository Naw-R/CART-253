/**
 * Ball Interaction Game
 * Rowan Nasser
 * 
 * This game allows the player to interact with a bouncing ball using the mouse.
 * The ball changes direction when it gets close to the mouse and the edges of 
 * the screen. The player can push the ball away, making for an engaging experience.
 * 
 * Controls:
 * - Mouse moves the cursor to influence the ball's direction.
 * 
 * Uses:
 * p5.js
 * https://p5js.org
 */

// Variables for the ball's properties
let ballX, ballY; // Ball's position
let ballSize = 50; // Size of the ball
let xSpeed = 5; // Ball's horizontal speed
let ySpeed = 5; // Ball's vertical speed

/**
 * Sets up the canvas and initializes the ball's starting position.
 */
function setup() {
    createCanvas(windowWidth, windowHeight); // Create a full-window canvas
    ballX = random(ballSize, width - ballSize); // Random starting position for the ball
    ballY = random(ballSize, height - ballSize);
}

// p5.js draw function
function draw() {
    background(240); // Light grey background

    // Draw the ball
    fill(50, 150, 250); // Blue color for the ball
    noStroke();
    ellipse(ballX, ballY, ballSize);

    // Move the ball
    ballX += xSpeed;
    ballY += ySpeed;

    // Bounce the ball off the edges of the canvas
    if (ballX > width - ballSize / 2 || ballX < ballSize / 2) {
        xSpeed = -xSpeed; // Reverse horizontal direction
    }
    if (ballY > height - ballSize / 2 || ballY < ballSize / 2) {
        ySpeed = -ySpeed; // Reverse vertical direction
    }

    // Check the distance between the mouse and the ball
    let distance = dist(mouseX, mouseY, ballX, ballY);

    // Use map() to adjust the ball's speed based on the distance from the mouse
    let speedAdjustment = map(distance, 0, 300, 2, 8); // Map distance to a speed range between 2 and 8
    xSpeed = xSpeed > 0 ? speedAdjustment : -speedAdjustment; // Adjust speed while maintaining direction
    ySpeed = ySpeed > 0 ? speedAdjustment : -speedAdjustment;

    // If the ball is within a certain distance of the mouse, push it away
    if (distance < 100) {
        let angle = atan2(ballY - mouseY, ballX - mouseX); // Calculate direction away from the mouse
        xSpeed += cos(angle); // Push horizontally
        ySpeed += sin(angle); // Push vertically
    }

    // Draw the player's mouse interaction element
    fill(150, 0, 0); // Red color for the mouse indicator
    ellipse(mouseX, mouseY, 20); // Small circle representing the mouse
}