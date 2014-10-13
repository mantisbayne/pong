$(function() {
    var score = {
        'user': 0,
        'ai': 0
    };

/**
 * @name updateScore
 * @description keeps track of score and renders in the DOM
*/

    function updateScore() {
        $("#aiScore").html(score.ai);
        $("#humanScore").html(score.user);
    }

/**
 * @description drawing the canvas
*/

    var width = 1000,
        height = 600,
        //Shorthand for JQuery object
        $canvas = $('canvas'),
        //JQuery returns an array, so we need the first object
        canvas = $canvas[0],
        context = canvas.getContext('2d'),
        PADDLE_HEIGHT = 200,
        PADDLE_WIDTH = 50;

    canvas.width = width;
    canvas.height = height;
    $canvas.width(width);
    $canvas.height(height);
    $canvas.css('background-color', 'rgba(158, 167, 184, 0.2)');
    //$canvas.style.border = 'solid 2px #9900CC';

/**
 * @name ball
 * @description creates the ball
*/

    var ball = new Ball(500, 300);

/**
 * @name ballPosition
 * @description find the ball's position
*/

    var ballPosition;

/**
 * @name interval
 * @description set up to stop game
*/

    var interval;

/**
 * @name inputY
 * @description finds the actual y-position
*/

    var inputY = 0;

/**
 * @name aiY, aiDelay
 * @description y-position and delay to make the game possible to win
*/
    var aiY = 0;
    var aiDelay = 0;


/**
 * @name restartGame
 * @description stops and restarts gameplay
*/

    var userSpeedSetting;

    //

    function restartGame() {

        $("#winner").hide();

        userSpeedSetting = $("#userSpeed").val();

        aiDelay = 0;

        clearInterval(interval);

        interval = setInterval(function() {
            render()
        }, 30);

        ball = new Ball(500, 300);

    }

/**
 * @name render
 * @description creates the game
*/

    function render() {
        //Styling the background first
        context.fillStyle = '#E0FFFF';
        context.clearRect(0, 0, width, height);
        //Styling the paddle


        ball.render();
        ballPosition = ball.update();

        var userPaddle = new Paddle('human', 'left');
        var aiPaddle = new Paddle('ai', 'right');
    }

    // PADDLE 

/**
 * @name Paddle
 * @description creates the paddle, defines how the paddle will move
*/

    $canvas.mousemove(function(event) {
        inputY = event.clientY;
    });


    function Paddle(user, side) { //color parameter
        this.user = user;
        this.side = side;
        this.height = PADDLE_HEIGHT;
        this.width = PADDLE_WIDTH;
        context.fillStyle = '#FF1493';

        if (user === 'human') {
            aiY = inputY;
        } else if (user === 'ai') {
            aiY = ballPosition - aiDelay;
        }

        var startingSide;
        if (side === 'left') {
            startingSide = 0;
        } else if (side === 'right') {
            startingSide = width - this.width;
        }

        context.fillRect(startingSide, aiY - this.height / 2, this.width, this.height);
    }

    // Ball

/**
 * @name Ball
 * @description creates the ball and defines how the ball will move
*/

    function Ball(x, y) {
        this.x = x;
        this.y = y;
        this.speedX = 15 * userSpeedSetting;
        this.speedY = 12 * userSpeedSetting;
        this.originalSpeedY = 12;
        this.radius = 8;
    }

    Ball.prototype.render = function() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = '#000000'
        context.fill();
    };

/**
 * @name delete
 * @description allows to clear the ball and start gameplay over
*/

    Ball.prototype.delete = function() {
        context.clearRect(0, 0, width, height);
    }

    function delayAI() {
        aiDelay = Math.random() * 150 + 1
        //aiDelay = 0;
    }

/**
 * @name hitsAPaddle
 * @description defines the movement of the ball when it hits one of the paddles
*/

    Ball.prototype.hitsAPaddle = function() {
        // left side
        if (this.x < PADDLE_WIDTH + 16 && this.x > 0 && this.y > inputY - PADDLE_HEIGHT / 2 && this.y < inputY + PADDLE_HEIGHT / 2) {
            this.speedX = Math.abs(this.speedX);
            yRatio = (this.y - inputY) / 100;
            this.speedY = this.originalSpeedY * yRatio;
            delayAI()
        }
        // right side
        else if (this.x > canvas.width - PADDLE_WIDTH - 16 && this.y > aiY - PADDLE_HEIGHT / 2 && this.y < aiY + PADDLE_HEIGHT / 2) {
            this.speedX *= -1;
        }
    }

/**
 * @name hitsAWall
 * @description defines what will happen when the ball hits a wall of the canvas
*/

    Ball.prototype.hitsAWall = function() {

        if (this.x < 0 || this.x > canvas.width) {
            this.speedX *= -1;
        }

        if (this.y < 0 || this.y > canvas.height) {
            this.speedY *= -1;
        }

        if (this.x < 0) {
            winner('ai')
        }

        if (this.x > canvas.width) {
            winner('user');
        }

    }

/**
 * @name update
 * @description what happens as the ball is moving
*/

    Ball.prototype.update = function() {

        this.hitsAPaddle();
        this.hitsAWall();

        this.x += this.speedX;
        this.y += this.speedY;

        return this.y;
    };

/**
 * @name winner
 * @description restarts game and displays who last scored
*/

    function winner(winner) {

        clearInterval(interval);

        score[winner] += 1;
        updateScore();

        $("#winner").html("winner: " + winner)
        $("#winner").show()

        setTimeout(function() {
            restartGame();
        }, 2000)
    }

    $("#startGame").on('click', function() {
        restartGame();
    });

    $("#endGame").on('click', function() {
        clearInterval(interval);

        score = {
            'user': 0,
            'ai': 0
        };

        $("#winner").html("Game Over")
        $("#winner").show()
    });


});