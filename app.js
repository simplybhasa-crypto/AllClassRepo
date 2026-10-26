const myName = 'Praval';

const cats = [
  {
    name: 'Mochi',
    mood: 'Sleepy & smug',
    text: 'Mochi is choosing a sunbeam over every chore.'
  },
  {
    name: 'Juniper',
    mood: 'Curious & brave',
    text: 'Juniper has spotted a tiny toy and is plotting the perfect pounce.'
  },
  {
    name: 'Maple',
    mood: 'Playful & bossy',
    text: 'Maple is demanding a round of attention and an extra treat for being adorable.'
  }
];

let activeIndex = 0;
let fishCount = 0;
let loveCount = 0;

const moodLabel = document.getElementById('moodLabel');
const moodText = document.getElementById('moodText');
const fishCountEl = document.getElementById('fishCount');
const loveCountEl = document.getElementById('loveCount');
const creatorNameEl = document.getElementById('creatorName');
const petButtons = document.querySelectorAll('.pet-button');
const feedBtn = document.getElementById('feedBtn');
const petBtn = document.getElementById('petBtn');
const nextCatBtn = document.getElementById('nextCatBtn');
const catCards = document.querySelectorAll('.cat-card');

if (creatorNameEl) {
  creatorNameEl.textContent = myName;
}

function renderMood() {
  const selectedCat = cats[activeIndex];
  moodLabel.textContent = selectedCat.mood;
  moodText.textContent = selectedCat.text;

  catCards.forEach((card, index) => {
    card.classList.toggle('active', index === activeIndex);
  });
}

function setActiveCat(index) {
  activeIndex = (index + cats.length) % cats.length;
  renderMood();
}

petButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.cat-card');
    const index = Number(card.dataset.index);
    setActiveCat(index);
    loveCount += 1;
    loveCountEl.textContent = String(loveCount);
  });
});

feedBtn.addEventListener('click', () => {
  fishCount += 1;
  fishCountEl.textContent = String(fishCount);
  const selectedCat = cats[activeIndex];
  moodLabel.textContent = selectedCat.mood + ' & rewarded';
  moodText.textContent = `${selectedCat.name} is delighted by the snack and ready to nap in style.`;
});

petBtn.addEventListener('click', () => {
  loveCount += 1;
  loveCountEl.textContent = String(loveCount);
  const selectedCat = cats[activeIndex];
  moodLabel.textContent = selectedCat.mood;
  moodText.textContent = `${selectedCat.name} purrs loudly and leans in for one more chin scratch.`;
});

nextCatBtn.addEventListener('click', () => {
  setActiveCat(activeIndex + 1);
});

renderMood();
