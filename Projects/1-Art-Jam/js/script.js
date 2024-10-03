/**
 * Art Jam Project
 * Author : Rowan Nasser
 * For the class : CART 253 A 2242 (Fall 2024)
 * For the teacher : Pippin Barr
 * 
 * Date of Creation : September 19th 2024
 * Due Date ; October 3rd 2024
 * 
 * The project is about a Blue ball that bounces over the Boundary defined by the black square
 * The goal is to make the Blue ball bounce away from the Red ball cursor
 * 
 * Objectives :
 * Get comfortable with starting, coding, and distributing a simple JavaScript project 
 * Develop familiarity with the p5 library and its drawing functions and variables in particular 
 * Build confidence in understanding variables both in terms of how they work and how they can contribute to expressive work
 * 
 * Brief : 
 * Use variables to create change of different kinds (movement, scale, colour, and more)
 * Use mouseX and mouseY to allow for some user interaction/input
 * Use p5’s map() function in some capacity (learn about it by reading the map() reference page)
 * Use at least one conditional to make the program respond to a changing variable
 */

let ballX, ballY;   // Create Ball position X and Y
let ballSize = 50;  //Create Ball Size
let ballSpeedX = 2; //Create ball Speed in the X axis
let ballSpeedY = 2; //Create ball spead in the Y axis
let margin = 10;    //Create margin for the boundry

let storyStage = 0;  // Track the current stage of the story
let isGameStarted = false; // Track whether the game has started
let lastClickTime = 0; // Track the time of the last valid click
let clickDelay = 500;  // 500ms delay between clicks

let continueButtonX;
let skipButtonX;
let buttonY;
let buttonWidth = 100;
let buttonHeight = 40;


let score = 0;  // Initialize the score
let lastScoredTime = 0;  // Track the last time the score was incremented
let scoreDelay = 1000;   // Delay (in milliseconds) before the score can increase again



let storyLines = [
    "Welcome to the battle between the Brain and the Heart.",
    "The Blue Ball represents your Brain, logical and calculating.",
    "The Red Ball represents your Heart, filled with emotion and desire.",
    "Your task is simple: keep the Heart away from the Brain's rational logic.",
    "Will you let your emotions win, or will reason prevail?",
    "Let's find out."
];

/**
 * Create a canvas
*/
function setup() {
    // A window Size canvas 
    createCanvas(windowWidth, windowHeight);

    // Set beginning ball location to a random place in the screen
    // The margin allows the ball not to be hiddin outside the boundries of the screen
    ballX = random(margin + ballSize, width - margin - ballSize);
    ballY = random(margin + ballSize, height - margin - ballSize);

    // Set the positions for Continue and Skip buttons
    continueButtonX = width / 2 - buttonWidth - 20;  // Continue button on the left side
    skipButtonX = width / 2 + 20;  // Skip button on the right side
    buttonY = height - 100;  // Y position of the buttons (near the bottom of the screen)
}

/**
 * Draw the map and the components of the game
*/
function draw() {
    if (!isGameStarted) {
        displayStory();  // Show the story if the game hasn't started
    } else {
        // If the game has started, continue with the existing game code
        background('#FFFFFF');

        drawMouse();

        drawBall();

        drawBoundarySquare();

        pushBallAway();

        // Display the score
        fill(0);
        textSize(32);
        text("Score: " + score, 80, 50);  // Display the score at the top left
    }

}

function drawMouse() {
    // Draw a red circle at the position of the mouse
    push();
    // No line around the shape
    noStroke();
    // Make it red
    fill(255, 0, 0);
    // Draw a 50x50 circle at the mouse position
    ellipse(mouseX, mouseY, 50, 50);
    pop();
}
function drawBoundarySquare() {
    // Draw a square to define the movement boundary of the blue ball
    push();
    stroke(0); // Black outline
    strokeWeight(10);
    noFill();  // No fill color for the boundary
    // Draw the square with a margin around the ball's allowed movement area
    rect(margin, margin, width - 2 * margin, height - 2 * margin);
    pop();
}

function drawBall() {
    // Calculate the distance between the ball and the mouse
    let distance = dist(mouseX, mouseY, ballX, ballY);

    // Use map() to adjust the ball size based on its distance from the mouse
    let dynamicBallSize = map(distance, 0, 500, 70, 30); // Size changes from 70 to 30 pixels

    // Constrain the ball size to avoid extreme values
    dynamicBallSize = constrain(dynamicBallSize, 30, 70);

    // Make it Blue (RGB)
    fill(0, 0, 255);
    // No line around the ball
    noStroke();
    // Draw the circle with a dynamic size
    ellipse(ballX, ballY, dynamicBallSize);

    // Make the ball move in the window
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Make the ball bounce on the walls
    checkBoundry();
}


function checkBoundry() {
    // Check X boundaries and adjust position if necessary
    if (ballX > width - ballSize) {
        ballX = width - ballSize;
        ballSpeedX *= -1;
    } else if (ballX < ballSize) {
        ballX = ballSize;
        ballSpeedX *= -1;
    }

    // Check Y boundaries and adjust position if necessary
    if (ballY > height - ballSize) {
        ballY = height - ballSize;
        ballSpeedY *= -1;
    } else if (ballY < ballSize) {
        ballY = ballSize;
        ballSpeedY *= -1;
    }
}

function pushBallAway() {
    // Calculate the distance between the Mouse's X, Y, and the Ball's X, Y
    let distance = dist(mouseX, mouseY, ballX, ballY);

    // If the ball is within a certain distance of the mouse, push it away
    if (distance < 500) {
        let angle = atan2(ballY - mouseY, ballX - mouseX); // Calculate direction away from the mouse
        // Adjust ball speed to push it away from the mouse with controlled strength
        ballSpeedX += cos(angle) * 0.2; // Control the push strength horizontally
        ballSpeedY += sin(angle) * 0.2; // Control the push strength vertically
    }

    // Increment score if red ball (mouse) touches the blue ball and enough time has passed
    if (distance < ballSize / 2 + 25 && millis() - lastScoredTime > scoreDelay) {
        score++;  // Increment score
        lastScoredTime = millis();  // Update the last score time
    }

    // Limit the ball's speed to prevent it from becoming too fast
    ballSpeedX = constrain(ballSpeedX, -10, 10);
    ballSpeedY = constrain(ballSpeedY, -10, 10);
}

// Function to display the story line by line
function displayStory() {
    background('#F4ECE2');  // Set the background to a light beige color

    fill(0);  // Set text color to black
    textAlign(CENTER, CENTER);
    textSize(32);
    text(storyLines[storyStage], width / 2, height / 2);  // Display the current story line

    drawContinueButton();
    drawSkipButton();
    checkButtons();

}

// Function to start the game after the story
function startGame() {
    // Don't show the cursor
    noCursor();
    isGameStarted = true;  // Change flag to indicate the game has started
    storyStage = 0;  // Reset the story stage for future use if needed
    background('#FFFFFF');
}

function drawContinueButton() {
    // Draw Continue button
    fill(0);
    rect(continueButtonX, buttonY, buttonWidth, buttonHeight);
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Continue", continueButtonX + buttonWidth / 2, buttonY + buttonHeight / 2);

}

function drawSkipButton() {
    // Draw Skip button
    fill(0);
    rect(skipButtonX, buttonY, buttonWidth, buttonHeight);
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Skip", skipButtonX + buttonWidth / 2, buttonY + buttonHeight / 2);
}

function checkButtons(){
    // Check if the user clicked the Skip button
    if (mouseIsPressed && mouseX > skipButtonX && mouseX < skipButtonX + buttonWidth &&
        mouseY > buttonY && mouseY < buttonY + buttonHeight) {
        startGame();  // Skip the story and start the game
    }

    // Check if the user clicked the Continue button
    if (mouseIsPressed && mouseX > continueButtonX && mouseX < continueButtonX + buttonWidth &&
        mouseY > buttonY && mouseY < buttonY + buttonHeight && millis() - lastClickTime > clickDelay) {
        lastClickTime = millis();
        if (storyStage < storyLines.length - 1) {
            storyStage++;
        } else {
            startGame();  // Start the game when the story is complete
        }
    }
}


