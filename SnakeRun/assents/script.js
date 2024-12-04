// Seleciona o elemento <canvas> e define o contexto 2D para desenho.
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Seleciona os elementos da interface do usuário.
const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

// Define o tamanho de cada segmento da cobra.
const size = 30;

// Define a posição inicial da cobra e cria a cobra como um array com um único segmento.
const initialPosition = { x: 270, y: 240 };
let snake = [initialPosition];

// Função para incrementar a pontuação em 10 pontos.
const incrementScore = () => {
  score.innerText = +score.innerText + 10;
};

// Função para gerar um número aleatório entre um mínimo e um máximo.
const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

// Função para gerar uma posição aleatória dentro do canvas.
const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size);
  return Math.round(number / size) * size;
};


// Função para gerar uma cor aleatória.
const randomColor = () => {
  const red = randomNumber(0, 255);
  const green = randomNumber(0, 255);
  const blue = randomNumber(0, 255);
  return `rgb(${red}, ${green}, ${blue})`;
};

// Define a posição e cor iniciais da "comida".
const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor(),
};

let direction, loopId;

// Função para desenhar a "comida" no canvas.
const drawFood = () => {
  const { x, y, color } = food;

  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.shadowBlur = 0;
};

// Função para desenhar a cobra no canvas.
const drawSnake = () => {
  ctx.fillStyle = "#66CDAA";

  snake.forEach((position, index) => {
    // O último segmento da cobra é desenhado com uma cor diferente.
    if (index === snake.length - 1) {
      ctx.fillStyle = "#FFA500";
    }

    ctx.fillRect(position.x, position.y, size, size);
  });
};

// Função para mover a cobra na direção atual.
const moveSnake = () => {
  if (!direction) return;

  const head = snake[snake.length - 1];

  // Adiciona um novo segmento à cobra dependendo da direção.
  if (direction === "right") {
    snake.push({ x: head.x + size, y: head.y });
  }

  if (direction === "left") {
    snake.push({ x: head.x - size, y: head.y });
  }

  if (direction === "down") {
    snake.push({ x: head.x, y: head.y + size });
  }

  if (direction === "up") {
    snake.push({ x: head.x, y: head.y - size });
  }

  // Remove o primeiro segmento para manter o tamanho da cobra.
  snake.shift();
};

// Função para desenhar a grade do canvas.
const drawGrid = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#DCDCDC";

  for (let i = size; i < canvas.width; i += size) {
    ctx.beginPath();
    ctx.lineTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }
};

// Função para verificar se a cobra comeu a "comida".
const checkEat = () => {
  const head = snake[snake.length - 1];

  if (head.x === food.x && head.y === food.y) {
    incrementScore();
    snake.push(head);

    // Gera uma nova posição aleatória para a comida.
    let x = randomPosition();
    let y = randomPosition();

    // Garante que a nova posição da comida não seja ocupada pela cobra.
    while (snake.find((position) => position.x === x && position.y === y)) {
      x = randomPosition();
      y = randomPosition();
    }

    food.x = x;
    food.y = y;
    food.color = randomColor();
  }
};

// Função para verificar colisões com a parede ou com o próprio corpo.
const checkCollision = () => {
  const head = snake[snake.length - 1];
  const canvasLimit = canvas.width - size;
  const neckIndex = snake.length - 2;

  // Verifica colisão com as paredes.
  const wallCollision =
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

  // Verifica colisão com o próprio corpo.
  const selfCollision = snake.find((position, index) => {
    return index < neckIndex && position.x === head.x && position.y === head.y;
  });

  // Se houver colisão, termina o jogo.
  if (wallCollision || selfCollision) {
    gameOver();
  }
};

// Função para exibir a tela de "Game Over".
const gameOver = () => {
  direction = undefined;

  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
  canvas.style.filter = "blur(2px)";
};

// Função principal que atualiza o jogo em loop.
const gameLoop = () => {
  clearInterval(loopId);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawFood();
  moveSnake();
  drawSnake();
  checkEat();
  checkCollision();

  // Chama a próxima iteração do gameLoop após 300ms.
  loopId = setTimeout(() => {
    gameLoop();
  }, 300);
};

// Inicia o loop do jogo.
gameLoop();

// Evento de teclado para controlar a direção da cobra.
document.addEventListener("keydown", ({ key }) => {
  if (key === "ArrowRight" && direction !== "left") {
    direction = "right";
  }

  if (key === "ArrowLeft" && direction !== "right") {
    direction = "left";
  }

  if (key === "ArrowDown" && direction !== "up") {
    direction = "down";
  }

  if (key === "ArrowUp" && direction !== "down") {
    direction = "up";
  }
});

// Evento para reiniciar o jogo ao clicar no botão "Jogar de Novo".
buttonPlay.addEventListener("click", () => {
  score.innerText = "00";
  menu.style.display = "none";
  canvas.style.filter = "none";

  snake = [initialPosition];
});
