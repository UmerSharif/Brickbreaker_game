var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var ballX = canvas.width / 2;
var ballY = canvas.height - 30;

var ballSpeedX = 2;
var ballSpeedY = -2;

var ballRadius = 10;

const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 75;
var paddleX = (canvas.width - PADDLE_WIDTH)/2;
var paddleY = canvas.height - PADDLE_HEIGHT;

var rightArrowPressed = false;
var leftArrowPressed = false;

// bricks variable
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

// brick variable

var myScore = 0;
var lives = 4;


window.onload = function() {


    // event listener for keydown and keyup inputs
    document.addEventListener("keydown", keyDownHandle, false);
    document.addEventListener("keyup", keyUpHandle, false);
    document.addEventListener("mousemove",mouseHandler, false);

// can also be used insted of request animation frame
    setInterval(function() {
        draw();
        move();
    }, 10);


    //draw(); in case of request animation frame only call these two insted of setinterval
    //move();
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    drawBricks();

//requestAnimationFrame(draw); // can also be implemented with setinterval function
}

function move() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // collision detection
    //top and bottom
    // if (ballY - ballRadius <= 0 || ballY + ballRadius >= canvas.height)
    // substracting and adding radius so that the ball bounce off from the edge of the wall
    // now bounce only from the top
    if (ballY - ballRadius <= 0) {
          ballSpeedY = -ballSpeedY;
      }

      // bouncing the ball off the paddle
    if(ballY + ballRadius >= canvas.height){
        if(ballX >= paddleX && ballX <= paddleX + PADDLE_WIDTH){
            ballSpeedY = -ballSpeedY;

            // when the ball hit above the center give it upward angle and speed and vise versa.
             // when it hit center the net valuse will be 0 and the ball will move horizontal.
            var Dx = ballX - (paddleX + (PADDLE_WIDTH/2));
            ballSpeedX = Dx * 0.13;
        }
        // add lives scene here instead of just draw
        else {
        lives--;
        if(lives <= 0) { // game over when no lives are left
                alert("GAME OVER");
                document.location.reload();
            }
            else { // setting ball and padle to initial position
                ballX = canvas.width/2;
                ballY = canvas.height-30;
                paddleX = (canvas.width-PADDLE_WIDTH)/2;
            }
        }
    }



    // right and left
    // substracting and adding radius so that the ball bounce off from the edge of the wall
    if (ballX + ballRadius >= canvas.width || ballX - ballRadius <= 0) {
        ballSpeedX = -ballSpeedX;
    }

    if(rightArrowPressed){
        paddleX += 7;
    }
    else if(leftArrowPressed){
        paddleX -= 7;
    }

    // restrict paddle within the boundaries of canvas
    if(paddleX + PADDLE_WIDTH >= canvas.width){
        paddleX = canvas.width - PADDLE_WIDTH;
    } else if(paddleX <= 0){
        paddleX = 0;
    }

    //requestAnimationFrame(move); // can also be implemented with setinterval function

}
// function for handling key inputs

function keyDownHandle(evt) {
    if (evt.keyCode === 39) {
        rightArrowPressed = true;

    }
    else if (evt.keyCode === 37) {
        leftArrowPressed = true;
    }
}

function keyUpHandle(evt){
    if(evt.keyCode === 39){
        rightArrowPressed = false;
    }
    else if(evt.keyCode === 37){
        leftArrowPressed = false;
    }
}
// mouse handler function

function mouseHandler(pos){
    var relativeX = pos.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - PADDLE_WIDTH/2;
    }
}

// brick collision function
function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(bricks[c][r].status === 1){
            if(ballX > b.x && ballX < b.x+brickWidth && ballY > b.y && ballY < b.y+brickHeight) {
                ballSpeedY = -ballSpeedY;
                bricks[c][r].status = 0;
                myScore++;

                //winning message
                if(myScore === (brickColumnCount*brickRowCount)){
                    alert(" You Win");
                    window.location.reload();
                }
              }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function drawBricks(){

    for( var c  = 0; c < brickColumnCount; c++){
        for(var r = 0; r < brickRowCount; r++){
            if(bricks[c][r].status === 1){
            var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
           }
        }
    }
}

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+myScore, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}
