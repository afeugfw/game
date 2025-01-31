const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreContainer = document.getElementById("score");
const highScoreContainer = document.getElementById("high-score");

const ground = new Image();
ground.src = "image/ground_3.jpg";

let box = 32;
let score = 0;


let highScore = localStorage.getItem("highScore") || 0;

function generateFood() {
    let columns = Math.floor(canvas.width / box);
    let rows = Math.floor(canvas.height / box);

    food = {
        x: Math.floor(Math.random() * (columns - 2) + 1) * box,
        y: Math.floor(Math.random() * (rows - 2) + 1) * box,
    };
}

generateFood();

let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box
};

document.addEventListener("keydown", direction);

let dir;
function direction(event) {
    if (event.keyCode == 37 && dir != "right") dir = "left";
    else if (event.keyCode == 38 && dir != "down") dir = "up";
    else if (event.keyCode == 39 && dir != "left") dir = "right";
    else if (event.keyCode == 40 && dir != "up") dir = "down";
}
function checkCollision(head, snake) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            clearInterval(game); 
            alert("Вы проиграли, врезались в хвост"); 
            return true;
        }
    }
    return false;
}

function drawGame() {
    
    ctx.drawImage(ground, 0, 0);
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box / 2, box / 2);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? "green" : "red";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }

    if (
        snakeX < 0 || snakeX + box > canvas.width ||
        snakeY < 0 || snakeY + box > canvas.height
    ) {
        clearInterval(game);
        alert("Вы проиграли!");
        
        
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        return;
    }

    if (dir == "left") snakeX -= box;
    if (dir == "right") snakeX += box;
    if (dir == "up") snakeY -= box;
    if (dir == "down") snakeY += box;

    let newHead = { x: snakeX, y: snakeY };
    snake.unshift(newHead);

    if (checkCollision(newHead, snake)) {
        return;
    }

  
    scoreContainer.innerText = "Счет: " + score;
    highScoreContainer.innerText = "Лучший счет: " + highScore;
}

let game = setInterval(drawGame, 100);
