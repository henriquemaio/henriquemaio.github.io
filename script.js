const microphoneBtn = document.querySelector("#microphone");
const output = document.querySelector("#output");

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

  const has_eaten_food = (snake[0].x >= food_x && snake[0].x <= food_x + 20) && (snake[0].y >= food_y && snake[0].y <= food_y + 20);

  // const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
  
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


function has_game_ended() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
}

function has_hitted_wall() {
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > canvas.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > canvas.height - 10;
  
  if (hitLeftWall) {
    snake[0].x = canvas.width;
  }

  if (hitRightWall) {
    snake[0].x = -10;
  }

  if (hitToptWall) {
    snake[0].y = canvas.height;
  }

  if (hitBottomWall) {
    snake[0].y = -10;
  }
}

function random_food(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function drawFood() {
  context.fillStyle = "red";
  context.strokestyle = "black";
  context.fillRect(food_x, food_y, 30, 30);
  context.strokeRect(food_x, food_y, 30, 30);
}

function gen_food() {
  food_x = random_food(0, canvas.width - 10);
  food_y = random_food(0, canvas.height - 10);
  snake.forEach(function has_snake_eaten_food(part) {
    const has_eaten = part.x == food_x && part.y == food_y;
    if (has_eaten) gen_food();
  });
}

function change_direction_by_key(event) {
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
    move_left();
  }

  if (keyPressed === UP_KEY && !goDown) {
    move_north();
  }

  if (keyPressed === RIGHT_KEY && !goLeft) {
    move_right();
  }

  if (keyPressed === DOWN_KEY && !goUp) {
    move_down();
  }
}
function move_north() {
  dx = 0;
  dy = -10;
}

function move_down() {
  dx = 0;
  dy = 10;
}

function move_right() {
  dx = 10;
  dy = 0;
}

function move_left() {
  dx = -10;
  dy = 0;
}

function change_direction_by_voice(word) {
  switch (word.toUpperCase()) {
    case "CIMA":
    case "ACIMA":
    case "SIM":
    case "NORTE":
      move_north();
      break;
    case "BAIXO":
    case "BAIXA":
    case "ABAIXO":
    case "ABAIXA":
    case "SUL":
    case "SOU":
      move_down();
      break;
    case "ESQUERDA":
    case "ESQUERDO":
    case "LESTE":
      move_left();
      break;
    case "DIREITA":
    case "DIREITO":
    case "OESTE":
      move_right();
      break;
    default:
      break;
  }
}

function main() {
  if (has_game_ended()) {
    if (confirm(`Você fez ${score} pontos! \n Deseja jogar novamente?`)) {
      document.location.reload();
    } 
    return
  };
  has_hitted_wall();
  setTimeout(function onTick() {
    clearCanvas();
    drawFood();
    move_snake();
    drawSnake();
    main();
  }, gameSpeed);
}

function start() {
  const recognition = new webkitSpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = "pt-BR";
  recognition.continuous = true;
  recognition.start();
  recognition.onstart = function () {
    main();
    gen_food();
  };
  
  recognition.onresult = function (event) {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const content = event.results[i][0].transcript.trim();
      output.textContent = content;
      change_direction_by_voice(content);
    }
  };
}

start();
document.addEventListener("keydown", change_direction_by_key);