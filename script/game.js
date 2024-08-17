const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");

const EmojyFrames = document.getElementById("animations");

let Emojy;
let val = 12;
let pause = true;
let weap;
let bareDeVie;

let createRect = (x, y, width, heigth, color)=>{
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, heigth);
}

let fps = 30;
let oneBlockSize = 30;
let score = 0;

const DIRECTION_RIGHT = 4
const DIRECTION_UP = 3
const DIRECTION_LEFT = 2
const DIRECTION_BOTTOM = 1

let Obstacles = [];
let Sound;
let SoundHitObstacle;
let Score;
let munitionText;
let munition = 3;
let bale = []

function startGame() {
    createNewEmojy();
    Emojy.gravity = 0.05;
    Score = new component("30px", "Consolas", "blue", 20, 50, "text");
    munitionText = new component("20px", "Consolas", "rgb(221, 42, 42)", 20, 80, "text");
    bareDeVie = new component(30, 5, "green", Emojy.x, Emojy.y - 5);
    Sound = new sound("./assets/sound/bounce.mp3");
    SoundHitObstacle = new sound("./assets/sound/eatpill.mp3");
    zoneDuJeu.start();
}

let zoneDuJeu = {
    start : function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight/2;
        this.context = canvasContext;
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, val);
    },
    clear : function() {
        this.context.clearRect(0, 0, canvas.width, canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    },
    continues : function() {
        this.interval = setInterval(updateGameArea, val);
    }
}

let container = document.querySelector(".container");

let a = 200;

let currentFrame = 0;

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < Obstacles.length; i += 1) {
        if (Emojy.crashWith(Obstacles[i])) {
            bareDeVie.width -= 10;
            if (bareDeVie.width <= 0) {
                Sound.play();
                zoneDuJeu.stop();
                container.style.display = "block";
                return;
            } else if (bareDeVie.width <= 10) {
                bareDeVie.color = "red";
            } else if (bareDeVie.width <= 20) {
                bareDeVie.color = "rgb(255, 166, 0)";
            }
            SoundHitObstacle.play();
            Obstacles[i] = Obstacles[Obstacles.length-1];
            Obstacles.pop();
        }
    }
    zoneDuJeu.clear();
    zoneDuJeu.frameNo += 1;
    currentFrame++;

    if ((zoneDuJeu.frameNo/12) % 100 == 0) {
        munition++;
    }

    if ((zoneDuJeu.frameNo/12 >= 100)&&(zoneDuJeu.frameNo/12 < 300)){
        a = 225;
    } else if (zoneDuJeu.frameNo/12 >= 500) {
        a = 240;
    }

    if (zoneDuJeu.frameNo == 1 || everyinterval(a)) {
        x = canvas.width;
        minHeight = 30;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        Obstacles.push(new component(Math.floor(Math.random()*(30)+10), height, "rgb(0, 158, 250)", x, 0));
        Obstacles.push(new component(Math.floor(Math.random()*(30)+10), x - height - gap, "rgb(0, 158, 250)", x, height + gap));
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

    for (let j = 0; j < bale.length; j++) {
        bale[j].update();
        for (i = 0; i < Obstacles.length; i += 1) {
            if (bale[j].crashWith(Obstacles[i])) {
                SoundHitObstacle.play();
                Obstacles[i] = Obstacles[Obstacles.length-1];
                Obstacles.pop();
                bale[j] = bale[bale.length-1];
                bale.pop();
                break;
            }
        }
    }

    bareDeVie.x = Emojy.x;
    bareDeVie.y = Emojy.y - 10;

    Score.text="SCORE: " + Math.floor(zoneDuJeu.frameNo/12);
    Score.update();
    munitionText.text="Munition: " + munition;
    munitionText.update();
    Emojy.newPos();
    Emojy.update();
    Emojy.draw();
    bareDeVie.update();
}

let drawFoods = () => {
    
}

function destroy(obj) {
    SoundHitObstacle.play();
    obj = Obstacles[Obstacles.length-1];
    Obstacles.pop();
}

let createNewEmojy = () => {
    Emojy = new component(
        oneBlockSize,
        oneBlockSize,
        "./assets/gif/smiley.gif",
        100,
        120,
        "image"
    );
};

let restart = ()=> {
    container.style.display = "none";
    Obstacles = [];
    zoneDuJeu.stop();
    bale = []
    tire = false;
    munition = 3;
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
            Sound.play();
            accelerate(-0.2,true);
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
            if (munition > 0) {
                // weap = new component(20, 2, "red", Emojy.x+20, Emojy.y+5);
                bale.push(new component(20, 2, "red", Emojy.x+20, Emojy.y+5));
                munition--;
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

let ctx = function() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

function move() {
    Emojy.image.src = "./assets/gif/angry.gif";
}

function clearmove() {
    Emojy.image.src = "./assets/gif/smiley.gif";
}

function everyinterval(n) {
    if ((zoneDuJeu.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function moveleft() {
    Emojy.speedX = -1; 
}

function moveright() {
    Emojy.speedX = 1; 
}

function idlMove() {
    Emojy.speedX = 0;
}

function accelerate(n,k) {
    if (k){
        move();
    }else{
        clearmove();
    }
    Emojy.gravity = n;
}