class component {
    constructor(width, height, color, x, y, type) {
        this.type = type;
        if (type == "image") {
            this.image = new Image();
            this.image.src = color;
        }
        this.color = color;
        this.score = 0;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;    
        this.x = x;
        this.y = y; 
        this.gravity = 0;
        this.gravitySpeed = 0;
        this.direction = DIRECTION_UP;
        this.nextDirection = this.direction;
        this.currentFrame = 1;
        this.frameCount = 7;
    }

    update() {
        let context = zoneDuJeu.context;
        if (this.type == "image") {
            context.drawImage(
                this.image, 
                this.x, 
                this.y,
                this.width,
                this.height
            );
        } else {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
        }
        if (this.type == "text") {
            context.font = this.width + " " + this.height;
            context.fillStyle = this.color;
            context.fillText(this.text, this.x, this.y);
        }
        if (this.color == "red") {
            this.x += 3;
        }
    }

    newPos() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    
    hitBottom() {
        var surLeSol = canvas.height - this.height;
        if (this.y > surLeSol) {
            this.y = surLeSol;
            this.gravitySpeed = 0;
        } else if(this.y<0) {
            this.y = 0;
            this.gravitySpeed = 0;
        }
    }
    
    crashWith(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }

    eat() {
        
    }

    draw() {
        canvasContext.save();
        canvasContext.translate(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2
        );
        canvasContext.rotate((this.direction * 90 * Math.PI) / 180)
        
        canvasContext.translate(
            -this.x - oneBlockSize / 2,
            -this.y - oneBlockSize / 2
        );

        canvasContext.restore();
    }
}