//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 80; //width/height ratio = 408/228 = 17/12
let birdHeight = 60;
let birdX = boardWidth / 32;
let birdY = boardHeight / 8;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;
let highscore = 0;
let gameOvercek = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    // Load skor dan highscore dari localStorage
    highscore = localStorage.getItem("highscore") ? parseFloat(localStorage.getItem("highscore")) : 0;
    score = 0; // Memulai permainan baru, jadi score di-reset

    //load images
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 3000); //every 3 seconds
    document.addEventListener("keydown", moveBird);
}

document.getElementById('start-button').addEventListener('click', function () {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    gameOver = false;
    gameOvercek = false;
    velocityY = 0;
    alert('Permainan dimulai!');
});

document.getElementById('highscore-button').addEventListener('click', function () {
    alert('Highscore Anda: ' + highscore);
});

document.getElementById('credits-button').addEventListener('click', function () {
    alert('Kredit: Permainan ini dibuat oleh [Nama Anda].');
});

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        if (!gameOvercek) {
            checkHighscore();
            gameOvercek = true;
        }
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    
    context.fillStyle = "black";
    context.font = "35px sans-serif";
    context.fillText("Score:", 5, 30);
    context.fillText(score, 5, 70);

    context.fillText("Highscore:", 200, 30);
    context.fillText(highscore, 200, 70);

}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 3;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        velocityY = -8;

        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
            gameOvercek = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height && 
        a.y + a.height > b.y; 
}

function checkHighscore() {
    if (score > highscore) {
        highscore = score;
        localStorage.setItem("highscore", highscore);
        alert("Selamat! Anda mencetak rekor nilai tertinggi baru: " + highscore);
    } else {
        alert("Permainan selesai! Skor Anda: " + score);
    }
    var konfirmasi = confirm("Apakah Anda ingin memulai game lagi?");
    if (konfirmasi) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    } else {
        window.location.href = "index.html";
    }
}
