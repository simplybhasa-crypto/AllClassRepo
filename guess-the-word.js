const wordBank = [
  { word: "PLANET", category: "Space" },
  { word: "ROCKET", category: "Space" },
  { word: "JUNGLE", category: "Nature" },
  { word: "TIGER", category: "Animals" },
  { word: "ORANGE", category: "Fruit" },
  { word: "GARDEN", category: "Nature" },
  { word: "COMPUTER", category: "Tech" },
  { word: "MUSIC", category: "Art" },
  { word: "FOREST", category: "Nature" },
  { word: "RAINBOW", category: "Nature" },
  { word: "PIZZA", category: "Food" },
  { word: "BREEZE", category: "Weather" },
  { word: "LANTERN", category: "Objects" },
  { word: "CLOUD", category: "Weather" },
  { word: "KEYBOARD", category: "Tech" },
  { word: "FALCON", category: "Animals" },
  { word: "CABIN", category: "Travel" },
  { word: "WATER", category: "Nature" },
  { word: "SUNFLOWER", category: "Nature" },
  { word: "BLOSSOM", category: "Nature" }
];

const state = {
  word: "",
  category: "",
  guessedLetters: [],
  usedLetters: [],
  lives: 6,
  finished: false
};

const wordDisplay = document.getElementById("word-display");
const livesDisplay = document.getElementById("lives");
const categoryDisplay = document.getElementById("category");
const guessInput = document.getElementById("guess-input");
const statusText = document.getElementById("status");
const usedLettersDisplay = document.getElementById("used-letters");
const guessForm = document.getElementById("guess-form");
const newWordButton = document.getElementById("new-word-btn");
const hangmanParts = [...document.querySelectorAll(".hangman-part")];

function getRandomWord() {
  return wordBank[Math.floor(Math.random() * wordBank.length)];
}

function startNewGame() {
  const nextWord = getRandomWord();

  state.word = nextWord.word;
  state.category = nextWord.category;
  state.guessedLetters = [];
  state.usedLetters = [];
  state.lives = 6;
  state.finished = false;

  guessInput.value = "";
  guessInput.focus();
  render();
}

function render() {
  livesDisplay.textContent = String(state.lives);
  categoryDisplay.textContent = state.category || "-";

  const displayLetters = state.word.split("").map((letter) => {
    if (state.guessedLetters.includes(letter)) {
      return `<span class="letter-box">${letter}</span>`;
    }

    return `<span class="letter-box empty">_</span>`;
  });

  wordDisplay.innerHTML = displayLetters.join("");

  hangmanParts.forEach((part, index) => {
    part.classList.toggle("show", index < 6 - state.lives);
  });

  const usedText = state.usedLetters.length ? state.usedLetters.join(" • ") : "—";
  usedLettersDisplay.textContent = usedText;

  if (state.finished && state.lives <= 0) {
    statusText.textContent = `Game over! The word was ${state.word}.`;
  } else if (state.finished) {
    statusText.textContent = `You won! The word was ${state.word}.`;
  } else {
    statusText.textContent = "Pick a letter or try the whole word.";
  }
}

function isSolved() {
  return state.word.split("").every((letter) => state.guessedLetters.includes(letter));
}

function addGuess(guess) {
  if (state.finished) {
    return;
  }

  const cleanGuess = guess.trim().toUpperCase();

  if (!cleanGuess) {
    statusText.textContent = "Type a guess first.";
    return;
  }

  if (state.usedLetters.includes(cleanGuess)) {
    statusText.textContent = `You already tried ${cleanGuess}.`;
    return;
  }

  const isSingleLetter = /^[A-Z]$/.test(cleanGuess);

  if (isSingleLetter) {
    if (state.word.includes(cleanGuess)) {
      state.guessedLetters.push(cleanGuess);
      state.usedLetters.push(cleanGuess);
      statusText.textContent = `Nice! ${cleanGuess} is in the word.`;

      if (isSolved()) {
        state.finished = true;
      }
    } else {
      state.usedLetters.push(cleanGuess);
      state.lives -= 1;
      statusText.textContent = `Nope — ${cleanGuess} is not in the word.`;

      if (state.lives <= 0) {
        state.finished = true;
      }
    }
  } else {
    state.usedLetters.push(cleanGuess);

    if (cleanGuess === state.word) {
      state.guessedLetters = Array.from(new Set([...state.guessedLetters, ...state.word.split("")]));
      state.finished = true;
      statusText.textContent = `Correct! You guessed the word ${state.word}.`;
    } else {
      state.lives -= 1;
      statusText.textContent = `Not quite — ${cleanGuess} is not the word.`;

      if (state.lives <= 0) {
        state.finished = true;
      }
    }
  }

  render();

  if (state.finished) {
    guessInput.value = "";
    guessInput.blur();
  }
}

guessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addGuess(guessInput.value);
  guessInput.value = "";
  guessInput.focus();
});

newWordButton.addEventListener("click", () => {
  startNewGame();
});

startNewGame();
