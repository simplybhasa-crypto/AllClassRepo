const board = document.getElementById("game-board");
const scoreLabel = document.getElementById("score");
const bestScoreLabel = document.getElementById("best-score");
const statusText = document.getElementById("status-text");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const restartBtn = document.getElementById("restart-btn");
const gameOverOverlay = document.getElementById("game-over-overlay");

const gridSize = 16;
const initialSnake = [
  { x: 7, y: 8 },
  { x: 6, y: 8 },
  { x: 5, y: 8 },
];

let snake = [];
let food = { x: 10, y: 10 };
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let bestScore = 0;
let isRunning = false;
let isPaused = false;
let intervalId = null;
let newBestTimer = null;

const cells = [];
const newBestBadge = document.getElementById("new-best");

function getSavedBestScore() {
  try {
    const storedValue = Number(localStorage.getItem("arnav-snake-best") || 0);
    return Number.isFinite(storedValue) ? storedValue : 0;
  } catch (error) {
    return 0;
  }
}

function saveBestScore(value) {
  try {
    localStorage.setItem("arnav-snake-best", String(value));
  } catch (error) {
    // Ignore storage errors in private browsing or restricted settings.
  }
}

function buildBoard() {
  board.innerHTML = "";
  cells.length = 0;

  for (let i = 0; i < gridSize * gridSize; i += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    board.appendChild(cell);
    cells.push(cell);
  }
}

function updateBestScore() {
  bestScoreLabel.textContent = String(bestScore);
}

function triggerNewBestAnimation() {
  if (!newBestBadge) {
    return;
  }

  newBestBadge.classList.remove("show");
  void newBestBadge.offsetWidth;
  newBestBadge.classList.add("show");

  if (newBestTimer) {
    clearTimeout(newBestTimer);
  }

  newBestTimer = setTimeout(() => {
    newBestBadge.classList.remove("show");
  }, 1500);
}

function getIndex(x, y) {
  return y * gridSize + x;
}

function randomFoodPosition() {
  let newFood = {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize),
  };

  while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
    newFood = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  }

  food = newFood;
}

function drawBoard() {
  cells.forEach((cell) => {
    cell.classList.remove("snake", "food");
  });

  snake.forEach((segment) => {
    const cell = cells[getIndex(segment.x, segment.y)];
    if (cell) {
      cell.classList.add("snake");
    }
  });

  const foodCell = cells[getIndex(food.x, food.y)];
  if (foodCell) {
    foodCell.classList.add("food");
  }
}

function updateStatus(message) {
  statusText.textContent = message;
}

function showGameOver() {
  if (gameOverOverlay) {
    gameOverOverlay.classList.add("show");
  }
}

function hideGameOver() {
  if (gameOverOverlay) {
    gameOverOverlay.classList.remove("show");
  }
}

function resetGame() {
  snake = initialSnake.map((segment) => ({ ...segment }));
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  scoreLabel.textContent = "0";
  hideGameOver();
  randomFoodPosition();
  drawBoard();
  updateStatus("Press Start to begin.");
}

function stopLoop() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function startLoop() {
  stopLoop();
  intervalId = setInterval(tick, 140);
}

function startGame() {
  if (!isRunning) {
    isRunning = true;
    isPaused = false;
    updateStatus("Game on! Eat the fruit.");
    startLoop();
    return;
  }

  if (isPaused) {
    isPaused = false;
    updateStatus("Game on! Eat the fruit.");
    startLoop();
  }
}

function pauseGame() {
  if (!isRunning) {
    updateStatus("Press Start to begin.");
    return;
  }

  isPaused = true;
  stopLoop();
  updateStatus("Paused. Press Start to continue.");
}

function endGame() {
  isRunning = false;
  isPaused = false;
  stopLoop();

  if (score > bestScore) {
    bestScore = score;
    saveBestScore(bestScore);
    updateBestScore();
    triggerNewBestAnimation();
  }

  showGameOver();
  updateStatus("Game over! Press Restart to try again.");
}

function tick() {
  direction = nextDirection;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize) {
    endGame();
    return;
  }

  if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    scoreLabel.textContent = String(score);
    randomFoodPosition();
    if (score > bestScore) {
      bestScore = score;
      saveBestScore(bestScore);
      updateBestScore();
      triggerNewBestAnimation();
    }
  } else {
    snake.pop();
  }

  drawBoard();
}

function handleDirection(newDirection) {
  const isOpposite =
    newDirection.x === -direction.x && newDirection.y === -direction.y;

  if (!isOpposite) {
    nextDirection = newDirection;
  }
}

function handleKeydown(event) {
  const key = event.key.toLowerCase();
  const map = {
    arrowup: { x: 0, y: -1 },
    w: { x: 0, y: -1 },
    arrowdown: { x: 0, y: 1 },
    s: { x: 0, y: 1 },
    arrowleft: { x: -1, y: 0 },
    a: { x: -1, y: 0 },
    arrowright: { x: 1, y: 0 },
    d: { x: 1, y: 0 },
  };

  if (map[key]) {
    event.preventDefault();
    handleDirection(map[key]);
    if (!isRunning) {
      startGame();
    }
  }
}

startBtn.addEventListener("click", () => {
  startGame();
});

pauseBtn.addEventListener("click", () => {
  pauseGame();
});

restartBtn.addEventListener("click", () => {
  isRunning = false;
  isPaused = false;
  stopLoop();
  resetGame();
  updateStatus("Game restarted. Press Start to begin.");
});

document.addEventListener("keydown", handleKeydown);

document.querySelectorAll("[data-key]").forEach((button) => {
  button.addEventListener("click", () => {
    const directionMap = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
    };

    const nextMove = directionMap[button.dataset.key];
    if (nextMove) {
      handleDirection(nextMove);
      if (!isRunning) {
        startGame();
      }
    }
  });
});

bestScore = getSavedBestScore();
updateBestScore();
buildBoard();
resetGame();
