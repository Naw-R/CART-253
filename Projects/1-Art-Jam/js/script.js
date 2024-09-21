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
 * 
 * 
 */

let ballX, ballY;   // Create Ball position X and Y
let ballSize = 50;  //Create Ball Size
let ballSpeedX = 2; //Create ball Speed in the X axis
let ballSpeedY = 2; //Create ball spead in the Y axis
let margin = 10; //Create margin for the boundry


/**
 * Create a canvas
*/
function setup() {
    // A window Size canvas 
    createCanvas(windowWidth, windowHeight);

    // Don't show the cursor
    noCursor();

    // Set beginning ball location to a random place in the screen
    // The margin allows the ball not to be hiddin outside the boundries of the screen
    ballX = random(margin + ballSize, width - margin - ballSize);
    ballY = random(margin + ballSize, height - margin - ballSize);
}

/**
 * Draw the map and the components of the game
*/
function draw() {
    // Make the background White (specified as hex)
    background('#FFFFFF');

    drawMouse();

    drawBall();

    drawBoundarySquare();

    pushBallAway();

}

function drawMouse() {
    // Draw a red circle at the position of the mouse
    push();
    // No line around the shape
    noStroke();
    // Make it red (RGB)
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

    // Limit the ball's speed to prevent it from becoming too fast
    ballSpeedX = constrain(ballSpeedX, -10, 10);
    ballSpeedY = constrain(ballSpeedY, -10, 10);
}
