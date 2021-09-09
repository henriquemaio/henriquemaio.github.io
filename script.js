let dx = 10;
let dy = 0;
let score = 0;
let food_x;
let food_y;
let gameSpeed = 100;

let snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 },
];

var canvas = document.getElementById("gameBoard"),
  context = canvas.getContext("2d");

function drawSnakePart(snakePart) {
  context.fillStyle = "gainsboro";
  context.strokestyle = "darkblue";
  context.fillRect(snakePart.x, snakePart.y, 10, 10);
  context.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function move_snake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
  if (has_eaten_food) {
    score += 10;
    gameSpeed -= 5;
    document.getElementById("score").innerHTML = "Score: " + score;
    gen_food();
  } else {
    snake.pop();
  }
}

function clearCanvas() {
  context.fillStyle = "#2e7d32";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function change_direction(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;
  const goUp = dy === -10;
  const goDown = dy === 10;
  const goRight = dx === 10;
  const goLeft = dx === -10;

  if (keyPressed === LEFT_KEY && !goRight) {
    dx = -10;
    dy = 0;
  }

  if (keyPressed === UP_KEY && !goDown) {
    dx = 0;
    dy = -10;
  }

  if (keyPressed === RIGHT_KEY && !goLeft) {
    dx = 10;
    dy = 0;
  }

  if (keyPressed === DOWN_KEY && !goUp) {
    dx = 0;
    dy = 10;
  }
}

document.addEventListener("keydown", change_direction);

function has_game_ended() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > canvas.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > canvas.height - 10;

  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function random_food(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function drawFood() {
  context.fillStyle = "red";
  context.strokestyle = "black";
  context.fillRect(food_x, food_y, 10, 10);
  context.strokeRect(food_x, food_y, 10, 10);
}

function gen_food() {
  food_x = random_food(0, canvas.width - 10);
  food_y = random_food(0, canvas.height - 10);
  snake.forEach(function has_snake_eaten_food(part) {
    const has_eaten = part.x == food_x && part.y == food_y;
    if (has_eaten) gen_food();
  });
}

function main() {
  if (has_game_ended()) return;
  setTimeout(function onTick() {
    clearCanvas();
    drawFood();
    move_snake();
    drawSnake();
    main();
  }, gameSpeed);
}

main();
gen_food();
