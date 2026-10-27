const questionSets = {
  fractions: [
    { prompt: "What is ¾ written as a decimal?", answer: "0.75", hint: "Divide the numerator, 3, by the denominator, 4." },
    { prompt: "What is ⅖ of 30?", answer: "12", hint: "First divide 30 into 5 equal groups, then take 2 groups." },
    { prompt: "What is 25% of 80?", answer: "20", hint: "25% is one quarter. Divide 80 by 4." },
    { prompt: "Which decimal is equal to ⅗?", answer: "0.6", hint: "Divide 3 by 5." }
  ],
  ratios: [
    { prompt: "There are 12 apples shared equally among 3 friends. How many apples does each friend get?", answer: "4", hint: "Divide the total number of apples by the number of friends." },
    { prompt: "A car travels 150 km in 3 hours. What is its average speed in km per hour?", answer: "50", hint: "A unit rate is the total distance divided by the number of hours." },
    { prompt: "The ratio of red to blue beads is 2:3. If there are 10 red beads, how many blue beads are there?", answer: "15", hint: "The red part grew from 2 to 10. Multiply the blue part by the same number." },
    { prompt: "A recipe uses 4 cups of flour for 8 servings. How many cups are needed for 4 servings?", answer: "2", hint: "Four servings is half of eight servings." }
  ],
  algebra: [
    { prompt: "Solve for x: x + 7 = 19", answer: "12", hint: "Subtract 7 from both sides to get x by itself." },
    { prompt: "Solve for n: 4n = 28", answer: "7", hint: "Divide both sides by 4." },
    { prompt: "If y = 3, what is the value of 2y + 5?", answer: "11", hint: "Replace y with 3, then multiply before adding." },
    { prompt: "Simplify: 5a + 2a", answer: "7a", hint: "These are like terms. Add the number parts and keep the a." }
  ],
  geometry: [
    { prompt: "A rectangle is 8 cm long and 5 cm wide. What is its area in square centimeters?", answer: "40", hint: "Area of a rectangle = length × width." },
    { prompt: "A square has sides of 6 cm. What is its perimeter in centimeters?", answer: "24", hint: "A square has 4 equal sides. Add the sides or multiply 6 by 4." },
    { prompt: "Two angles in a triangle are 50° and 60°. What is the third angle?", answer: "70", hint: "Angles in a triangle add up to 180°." },
    { prompt: "A rectangle is 9 m long and 4 m wide. What is its perimeter in meters?", answer: "26", hint: "Add all four sides: two lengths and two widths." }
  ]
};

const topicNames = {
  fractions: "FRACTIONS & DECIMALS",
  ratios: "RATIOS & RATES",
  algebra: "EXPRESSIONS & EQUATIONS",
  geometry: "GEOMETRY"
};

const questionTitle = document.querySelector("#question-title");
const questionTopic = document.querySelector("#question-topic");
const questionCount = document.querySelector("#question-count");
const hintText = document.querySelector("#question-hint");
const answerForm = document.querySelector("#answer-form");
const answerInput = document.querySelector("#answer-input");
const feedback = document.querySelector("#answer-feedback");
const hintButton = document.querySelector("#hint-button");
const nextButton = document.querySelector("#next-button");
const scoreLabel = document.querySelector("#score");
const streakLabel = document.querySelector("#streak");
const topicButtons = document.querySelectorAll("[data-topic]");

let selectedTopic = "fractions";
let currentQuestion;
let previousQuestionIndex = -1;
let questionNumber = 1;
let score = 0;
let streak = 0;
let answered = false;

function showQuestion() {
  const questions = questionSets[selectedTopic];
  let questionIndex = Math.floor(Math.random() * questions.length);
  if (questions.length > 1 && questionIndex === previousQuestionIndex) {
    questionIndex = (questionIndex + 1) % questions.length;
  }
  previousQuestionIndex = questionIndex;
  currentQuestion = questions[questionIndex];
  questionTitle.textContent = currentQuestion.prompt;
  questionTopic.textContent = topicNames[selectedTopic];
  questionCount.textContent = `Question ${questionNumber}`;
  hintText.hidden = true;
  hintText.textContent = currentQuestion.hint;
  feedback.textContent = "";
  feedback.classList.remove("is-wrong");
  answerInput.value = "";
  answerInput.disabled = false;
  answered = false;
  answerInput.focus({ preventScroll: true });
}

function normalizeAnswer(value) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function isCorrectAnswer(value) {
  const submitted = normalizeAnswer(value);
  const expected = normalizeAnswer(currentQuestion.answer);
  if (!submitted) return false;
  const submittedNumber = Number(submitted);
  const expectedNumber = Number(expected);
  if (Number.isFinite(submittedNumber) && Number.isFinite(expectedNumber)) {
    return Math.abs(submittedNumber - expectedNumber) < 0.000001;
  }
  return submitted === expected;
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (answered) return;
  if (!answerInput.value.trim()) {
    feedback.textContent = "Type an answer first, then check it.";
    feedback.classList.add("is-wrong");
    answerInput.focus();
    return;
  }

  answered = true;
  answerInput.disabled = true;
  if (isCorrectAnswer(answerInput.value)) {
    score += 1;
    streak += 1;
    scoreLabel.textContent = String(score);
    streakLabel.textContent = String(streak);
    feedback.textContent = "That's right! Nice work.";
    feedback.classList.remove("is-wrong");
  } else {
    streak = 0;
    streakLabel.textContent = "0";
    feedback.textContent = `Not quite this time. The answer is ${currentQuestion.answer}. Take a look at the hint and try another!`;
    feedback.classList.add("is-wrong");
  }
});

hintButton.addEventListener("click", () => {
  hintText.hidden = false;
});

nextButton.addEventListener("click", () => {
  questionNumber += 1;
  showQuestion();
});

(() => {
  const mazeMap = [
    "#################",
    "#.......#.......#",
    "#.#.##..#..##.#.#",
    "#...............#",
    "#.###.#####.###.#",
    "#...............#",
    "#.#.##..#..##.#.#",
    "#.......#.......#",
    "###.#.#####.#.###",
    "#...............#",
    "#.#.##..#..##.#.#",
    "#.......#.......#",
    "#################"
  ];

  const canvas = document.querySelector("#pacman-canvas");
  const context = canvas.getContext("2d");
  const pacmanStatus = document.querySelector("#pacman-status");
  const pacmanScore = document.querySelector("#pacman-score");
  const pacmanStartButton = document.querySelector("#pacman-start");
  const tileSize = 30;
  const playerStart = { x: 1, y: 1 };
  const ghostStart = { x: 15, y: 11 };
  const directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  let player = { ...playerStart };
  let ghost = { ...ghostStart };
  let playerDirection = directions.right;
  let requestedDirection = directions.right;
  let pellets = new Set();
  let totalPellets = 0;
  let gameTimer = null;
  let gameTick = 0;
  let gameRunning = false;

  function tileKey(position) {
    return `${position.x},${position.y}`;
  }

  function isOpenTile(position) {
    return mazeMap[position.y]?.[position.x] === ".";
  }

  function resetMaze() {
    pellets = new Set();
    mazeMap.forEach((row, y) => {
      [...row].forEach((tile, x) => {
        if (tile === ".") pellets.add(tileKey({ x, y }));
      });
    });
    totalPellets = pellets.size;
    player = { ...playerStart };
    ghost = { ...ghostStart };
    playerDirection = directions.right;
    requestedDirection = directions.right;
    gameTick = 0;
    pacmanScore.textContent = `0 / ${totalPellets}`;
    drawMaze();
  }

  function drawMaze() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#111a40";
    context.fillRect(0, 0, canvas.width, canvas.height);

    mazeMap.forEach((row, y) => {
      [...row].forEach((tile, x) => {
        const centerX = x * tileSize + tileSize / 2;
        const centerY = y * tileSize + tileSize / 2;
        if (tile === "#") {
          context.fillStyle = "#354a9a";
          context.fillRect(x * tileSize + 2, y * tileSize + 2, tileSize - 4, tileSize - 4);
        } else if (pellets.has(tileKey({ x, y }))) {
          context.beginPath();
          context.fillStyle = "#ffe6a1";
          context.arc(centerX, centerY, 3, 0, Math.PI * 2);
          context.fill();
        }
      });
    });

    const playerCenterX = player.x * tileSize + tileSize / 2;
    const playerCenterY = player.y * tileSize + tileSize / 2;
    const facingAngle = Math.atan2(playerDirection.y, playerDirection.x);
    context.beginPath();
    context.fillStyle = "#ffd84d";
    context.moveTo(playerCenterX, playerCenterY);
    context.arc(playerCenterX, playerCenterY, 11, facingAngle + 0.35, facingAngle + Math.PI * 2 - 0.35);
    context.closePath();
    context.fill();

    const ghostCenterX = ghost.x * tileSize + tileSize / 2;
    const ghostCenterY = ghost.y * tileSize + tileSize / 2;
    context.beginPath();
    context.fillStyle = "#ff7187";
    context.arc(ghostCenterX, ghostCenterY, 10, Math.PI, 0);
    context.lineTo(ghostCenterX + 10, ghostCenterY + 9);
    context.lineTo(ghostCenterX + 4, ghostCenterY + 5);
    context.lineTo(ghostCenterX, ghostCenterY + 9);
    context.lineTo(ghostCenterX - 5, ghostCenterY + 5);
    context.lineTo(ghostCenterX - 10, ghostCenterY + 9);
    context.closePath();
    context.fill();
    context.fillStyle = "#fff";
    context.beginPath();
    context.arc(ghostCenterX - 4, ghostCenterY - 1, 2.7, 0, Math.PI * 2);
    context.arc(ghostCenterX + 4, ghostCenterY - 1, 2.7, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#23305c";
    context.beginPath();
    context.arc(ghostCenterX - 3, ghostCenterY - 1, 1.2, 0, Math.PI * 2);
    context.arc(ghostCenterX + 5, ghostCenterY - 1, 1.2, 0, Math.PI * 2);
    context.fill();
  }

  function moveToNextTile(position, direction) {
    const nextPosition = { x: position.x + direction.x, y: position.y + direction.y };
    return isOpenTile(nextPosition) ? nextPosition : position;
  }

  function findGhostStep() {
    const queue = [{ ...ghost, firstStep: null }];
    const visited = new Set([tileKey(ghost)]);

    while (queue.length) {
      const current = queue.shift();
      if (current.x === player.x && current.y === player.y) return current.firstStep;

      Object.values(directions).forEach((direction) => {
        const next = { x: current.x + direction.x, y: current.y + direction.y };
        const nextKey = tileKey(next);
        if (isOpenTile(next) && !visited.has(nextKey)) {
          visited.add(nextKey);
          queue.push({
            ...next,
            firstStep: current.firstStep || { x: direction.x, y: direction.y }
          });
        }
      });
    }
    return null;
  }

  function finishGame(won) {
    gameRunning = false;
    window.clearInterval(gameTimer);
    gameTimer = null;
    pacmanStartButton.textContent = "Play again";
    pacmanStatus.textContent = won ? "You did it! All the dots are collected. Great brain break!" : "The ghost caught you! Take a breath and play again.";
  }

  function tickMaze() {
    const nextPlayerTile = moveToNextTile(player, requestedDirection);
    if (nextPlayerTile !== player) {
      player = nextPlayerTile;
      playerDirection = requestedDirection;
    }

    if (pellets.delete(tileKey(player))) {
      const collected = totalPellets - pellets.size;
      pacmanScore.textContent = `${collected} / ${totalPellets}`;
    }

    if (tileKey(player) === tileKey(ghost)) {
      finishGame(false);
      drawMaze();
      return;
    }

    gameTick += 1;
    if (gameTick % 2 === 0) {
      const ghostStep = findGhostStep();
      if (ghostStep) ghost = moveToNextTile(ghost, ghostStep);
    }

    drawMaze();
    if (tileKey(player) === tileKey(ghost)) {
      finishGame(false);
    } else if (pellets.size === 0) {
      finishGame(true);
    }
  }

  function startMazeGame() {
    window.clearInterval(gameTimer);
    resetMaze();
    gameRunning = true;
    pacmanStatus.textContent = "Go! Collect the dots and watch out for the ghost.";
    pacmanStartButton.textContent = "Restart game";
    gameTimer = window.setInterval(tickMaze, 170);
  }

  function chooseDirection(directionName) {
    requestedDirection = directions[directionName];
    if (!gameRunning) startMazeGame();
  }

  pacmanStartButton.addEventListener("click", startMazeGame);
  document.querySelectorAll("[data-direction]").forEach((button) => {
    button.addEventListener("click", () => chooseDirection(button.dataset.direction));
  });

  document.addEventListener("keydown", (event) => {
    const activeElement = document.activeElement;
    if (activeElement.matches("input, textarea, select, [contenteditable='true']")) return;

    const directionNames = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right"
    };
    const directionName = directionNames[event.key];
    if (!directionName) return;

    event.preventDefault();
    chooseDirection(directionName);
  });
  resetMaze();
})();

topicButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedTopic = button.dataset.topic;
    previousQuestionIndex = -1;
    topicButtons.forEach((topicButton) => {
      const isSelected = topicButton.dataset.topic === selectedTopic;
      if (topicButton.classList.contains("topic-chip")) {
        topicButton.classList.toggle("is-selected", isSelected);
        topicButton.setAttribute("aria-pressed", String(isSelected));
      }
    });
    questionNumber = 1;
    showQuestion();
    document.querySelector("#practice").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

showQuestion();
