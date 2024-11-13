class Component {
    constructor(width, height, color, x, y) {
        this.color = color;
        this.score = 0;
        this.width = width;
        this.height = height;    
        this.x = x;
        this.y = y;
    }

    update() {
        let context = zoneDuJeu.context;
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    
    crashWith(otherobj) {
        let myleft = this.x,
            myright = this.x + (this.width),
            mytop = this.y + 5,
            mybottom = this.y + (this.height) + 5,
            otherleft = otherobj.x,
            otherright = otherobj.x + (otherobj.width),
            othertop = otherobj.y,
            otherbottom = otherobj.y + (otherobj.height),
            crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

class Bale extends Component{
	constructor(width, height, color, x, y) {
        super(width, height, color, x, y);
	}

    update() {
        let context = zoneDuJeu.context;
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        this.x += 3;
    }
}

class Text extends Component{
	constructor(width, height, color, x, y) {
        super(width, height, color, x, y);
	}

    update() {
        let context = zoneDuJeu.context;
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);

        context.font = this.width + " " + this.height;
        context.fillStyle = this.color;
        context.fillText(this.text, this.x, this.y);
    }
}

class Emojy extends Component{
	constructor(width, height, color, x, y) {
        super(width, height, color, x, y);
        this.speedX = 0;
        this.speedY = 0;
        this.frameCount = 7;
		this.currentFrame = 1;
        this.image = new Image();
        this.image.src = color;
        this.gravity = 0;
        this.gravitySpeed = 0;
        this.munition = 3;
        this.direction = 1;
		this.nextDirection = 1;
		setInterval(() => {
			this.changeAnimation(); // Changer d'animation a chaque frame
		}, 100);
	}

    changeAnimation() {
		this.currentFrame =
			this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
	}

    changeDirectionIfPossible() {
		if (this.direction == this.nextDirection) return;
		let tempDirection = this.direction;
		this.direction = this.nextDirection;
	}

    update() {
        let context = zoneDuJeu.context;
        // context.drawImage(
        //     this.image, 
        //     this.x, 
        //     this.y,
        //     this.width,
        //     this.height
        // );
        this.changeDirectionIfPossible();
        context.save();
		context.translate(
			this.x + oneBlockSize / 2,
			this.y + oneBlockSize / 2
		);
		context.rotate((this.direction * Math.PI) / 180);
		context.translate(
			-this.x - oneBlockSize / 2,
			-this.y - oneBlockSize / 2
		);
		context.drawImage(
			EmojyFrames,
			(this.currentFrame - 1) * (oneBlockSize-10),
			0,
			oneBlockSize-10,
			oneBlockSize-10,
			this.x,
			this.y,
			this.width,
			this.height
		);
		context.restore();
    }

    newPos() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    
    hitBottom() {
        let surLeSol = canvas.height - this.height;
        if (this.y > surLeSol) {
            this.y = surLeSol;
            this.gravitySpeed = 0;
        } else if(this.y<0) {
            this.y = 0;
            this.gravitySpeed = 0;
        }
    }

    eat() {
        
    }
}