/*
Comment clearly, professionally
Explain each of the concepts covered
Make it look beautiful and be interactive in the browser window
*/



$(function() {
    var score = {
        'user': 0,
        'ai': 0
    };

    function updateScore() {
        $("#aiScore").html(score.ai);
        $("#humanScore").html(score.user);
    }
    //Setting width, height and context for the canvas
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

    var ball = new Ball(500, 300);
    var ballPosition;

    var interval;

    var inputY = 0;

    var aiY = 0;
    var aiDelay = 0;
    var userSpeedSetting;

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

    function render() {
        //Styling the background first
        context.fillStyle = '#E0FFFF';
        context.clearRect(0, 0, width, height);
        //Styling the paddle

        //y-100 because we want the mouse to be in the center of the paddle
        //How many times it calls the function
        ball.render();
        ballPosition = ball.update();

        var userPaddle = new Paddle('human', 'left');
        var aiPaddle = new Paddle('ai', 'right');
    }

    // PADDLE 

    //When the mouse moves, function that paddle moves along y-axis
    //The paddle will move along the y-axis

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

    Ball.prototype.delete = function() {
        context.clearRect(0, 0, width, height);
    }

    function delayAI() {
        aiDelay = Math.random() * 150 + 1
        //aiDelay = 0;
    }

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

    Ball.prototype.update = function() {

        this.hitsAPaddle();
        this.hitsAWall();

        this.x += this.speedX;
        this.y += this.speedY;

        return this.y;
    };

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