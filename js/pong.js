/*
Comment clearly, professionally
Explain each of the concepts covered
Unit tests?
Make it look beautiful and be interactive in the browser window
*/



$(function() {
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

    //The paddle will move along the y-axis
    var y = 0;

    function render() {
        //Styling the background first
        context.fillStyle = '#E0FFFF';
        context.clearRect(0, 0, width, height);
        //Styling the paddle
        context.fillStyle = '#FF1493';
        //y-100 because we want the mouse to be in the center of the paddle
        context.fillRect(0, y - PADDLE_HEIGHT / 2, PADDLE_WIDTH, PADDLE_HEIGHT);
        //How many times it calls the function
        ball.render();
        ball.update();
        setTimeout(render, 30)
    }
    setTimeout(render, 30);

    //When the mouse moves, function that paddle moves along y-axis
    $canvas.mousemove(function(event) {
        y = event.clientY;
    });



    function Ball(x, y) {
        this.x = x;
        this.y = y;
        this.speedX = 15;
        this.speedY = 12;
        this.originalSpeedY = 12;
        this.radius = 8;
    }

    Ball.prototype.render = function() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = '#000000'
        context.fill();
    };

    var update = function() {
        ball.update();
    };

    Ball.prototype.update = function() {

        if (this.x < PADDLE_WIDTH+16 && this.x > 0 && this.y > y - PADDLE_HEIGHT / 2 && this.y < y + PADDLE_HEIGHT / 2) {
            this.speedX = Math.abs(this.speedX);
            yRatio = (this.y - y) / 100;
            this.speedY = this.originalSpeedY * yRatio;
        } else {
            if (this.x < 0 || this.x > canvas.width) {
                this.speedX *= -1;
            }

            if (this.y < 0 || this.y > canvas.height) {
                this.speedY *= -1;
            }
        }


        this.x += this.speedX;
        this.y += this.speedY;
    };
});