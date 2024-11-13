class ZoneDuJeu {
    start() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight/2;
        this.context = canvasContext;
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, val);
    }

    clear() {
        this.context.clearRect(0, 0, canvas.width, canvas.height);
    }

    stop() {
        clearInterval(this.interval);
    }

    continues() {
        this.interval = setInterval(updateGameArea, val);
    }
}

const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const EmojyFrames = document.getElementById("animations");

let emojy;
let val = 12;
let pause = true;
let bareDeVie;
let createRect = (x, y, width, heigth, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, heigth);
}

let fps = 30;
let oneBlockSize = 30;
let score = 0;

let Obstacles = [];
let sound;
let soundHitObstacle;
let Score;
let munitionText;
let bale = []
let zoneDuJeu = new ZoneDuJeu()

let container = document.querySelector(".container");
let a = 200;
let currentFrame = 0;

const DIRECTION_UP = -45;
const DIRECTION_BOTTOM = 45;
const DIRECTION_RIGHT = 1;

function startGame() {
    createNewEmojy();
    emojy.gravity = 0.05;
    Score = new Text("30px", "Consolas", "blue", 20, 50);
    munitionText = new Text("20px", "Consolas", "rgb(221, 42, 42)", 20, 80);
    bareDeVie = new Component(30, 5, "green", emojy.x, emojy.y - 5);
    sound = new Sound("./assets/sound/bounce.mp3");
    soundHitObstacle = new Sound("./assets/sound/eatpill.mp3");
    zoneDuJeu.start();
}

function updateGameArea() {
    for (i = 0; i < Obstacles.length; i += 1) {
        if (emojy.crashWith(Obstacles[i])) {
            bareDeVie.width -= 10;
            if (bareDeVie.width <= 0) {
                sound.play();
                zoneDuJeu.stop();
                container.style.display = "block";
                return;
            } else if (bareDeVie.width <= 10) {
                bareDeVie.color = "red";
            } else if (bareDeVie.width <= 20) {
                bareDeVie.color = "rgb(255, 166, 0)";
            }
            soundHitObstacle.play();
            destroy(Obstacles, i)
        }
    }
    zoneDuJeu.clear();
    zoneDuJeu.frameNo += 1;
    currentFrame++;

    levelUp(zoneDuJeu);
    drawObstacles();
    shoots();
    drawText();
    emojy.newPos();
    emojy.update();
}

let levelUp = (zoneDuJeu) => {
    if ((zoneDuJeu.frameNo/12) % 100 == 0) {
        emojy.munition++;
    }
    if ((zoneDuJeu.frameNo/12 >= 100)&&(zoneDuJeu.frameNo/12 < 300)){
        a = 225;
    } else if (zoneDuJeu.frameNo/12 >= 500) {
        a = 240;
    }
}

let drawObstacles = () => {
    if (zoneDuJeu.frameNo == 1 || everyinterval(a)) {
        const x = canvas.width,
            minHeight = 30,
            maxHeight = 200,
            height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight),
            minGap = 50,
            maxGap = 200,
            gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        Obstacles.push(new Component(Math.floor(Math.random()*(30)+10), height, "rgb(0, 158, 250)", x, 0));
        Obstacles.push(new Component(Math.floor(Math.random()*(30)+10), x - height - gap, "rgb(0, 158, 250)", x, height + gap));
    }

    for (i = 0; i < Obstacles.length; i += 1) {
        if (zoneDuJeu.frameNo/12 < 500) {
            Obstacles[i].x -= (1 + zoneDuJeu.frameNo/1500);
        } else if (zoneDuJeu.frameNo/12 >= 500) {
            Obstacles[i].x -= 5;
        }
        if (Obstacles[i].width >= 20) {
            if (currentFrame<=100) {
                if (Obstacles[i].y == 0) {
                    Obstacles[i].height += 1.3;
                } else {
                    Obstacles[i].y += 1;
                }
            } else if (currentFrame <= 200) {
                if (Obstacles[i].y == 0) {
                    Obstacles[i].height -= 1.3;
                } else {
                    Obstacles[i].y -= 1;
                }
            } else {
                currentFrame = 0;
            }
            Obstacles[i].color = "rgb(28, 190, 23)";
        }

        Obstacles[i].update();
    }
}

let drawText = () => {
    bareDeVie.x = emojy.x;
    bareDeVie.y = emojy.y - 10;
    bareDeVie.update();
    Score.text="SCORE: " + Math.floor(zoneDuJeu.frameNo/12);
    Score.update();
    munitionText.text="Munition: " + emojy.munition;
    munitionText.update();
}

let drawFoods = () => {
    
}

let shoots = () => {
    for (let j = 0; j < bale.length; j++) {
        bale[j].update();
        for (i = 0; i < Obstacles.length; i += 1) {
            if (bale[j].crashWith(Obstacles[i])) {
                soundHitObstacle.play();
                destroy(Obstacles, i)
                destroy(bale, j)
                break;
            }
        }
    }
}

function destroy(obj, i) {
    obj[i] = obj[obj.length-1];
    obj.pop();
}

let createNewEmojy = () => {
    emojy = new Emojy(
        oneBlockSize,
        oneBlockSize,
        EmojyFrames,
        100,
        120
    );
};

let restart = ()=> {
    container.style.display = "none";
    Obstacles = [];
    zoneDuJeu.stop();
    bale = []
    startGame();
}

window.addEventListener("keydown", (event) => {
    let k = event.keyCode;
    let option = document.querySelector(".option");
    setTimeout(() =>{
        if (k == 37 || k == 81) {
            move();
            moveleft();
        } else if ((k == 38 || k == 90)&&(pause)) {
            sound.play();
            accelerate(-0.2,true);
            // emojy.nextDirection = DIRECTION_UP;
        } else if ( k == 39 || k == 68) {
            move();
            moveright();
        } else if (k == 27) {
            if (pause) {
                option.style.display = "block";
                pause = false;
                zoneDuJeu.stop();
            } else {
                option.style.display = "none";
                pause = true;
                zoneDuJeu.continues();
            }

        } else if ((k == 70)&&(pause)) {
            if (emojy.munition > 0) {
                bale.push(new Bale(20, 2, "red", emojy.x+(oneBlockSize/2), emojy.y+(oneBlockSize/2)));
                emojy.munition--;
            }
        }
    }, 1)
})

window.addEventListener("keyup", (event) => {
    let k = event.keyCode

    setTimeout(() =>{
        if (k == 38 || k == 90) {
            accelerate(0.05,false);
        }
        clearmove();
        idlMove();
    }, 1)
});

function move() {
    // emojy.image.src = "./assets/gif/angry.gif";
}

function clearmove() {
    // emojy.image.src = "./assets/gif/smiley.gif";
}

function everyinterval(n) {
    if ((zoneDuJeu.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function moveleft() {
    emojy.speedX = -1; 
}

function moveright() {
    emojy.speedX = 1; 
}

function idlMove() {
    emojy.speedX = 0;
}

function accelerate(n,k) {
    if (k){
        move();
    }else{
        clearmove();
    }
    emojy.gravity = n;
}