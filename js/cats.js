// Declare variables for cards, cards flipped, for locking the board, and for identifying both cards clicked

const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matches = 0;
let misses = 0;
let tries = 0;

// Add listener over the cards to be able to play with them

cards.forEach(card => card.addEventListener('click', flipCard));

//Variables for the score sistem and metrics

const matchesSpan = document.getElementById('matches');
const missesSpan = document.getElementById('misses');
const triesSpan = document.getElementById('tries');
const finalResultSpan = document.getElementById('playAgainMessage');



// This function includes the property flips to the cards so the effect
// is added using the CSS

function flipCard() {
  if (lockBoard) return;
  this.classList.add('flip');
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
  } else {
    hasFlippedCard = false;
    secondCard = this;
    checkMatch();
  }
};

// This function is meant to check if both cards selected by the users have the same image.
// If both cards are the same, the listener is erased so both cards remain flipped. 
//If not, both cards return to the original position.
//It also counts the tries, misses and matches and capture them to show them in the web

const checkMatch = () => {
  if (firstCard.dataset.framework === secondCard.dataset.framework) {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matches += 1;
    matchesSpan.textContent = matches;
    tries += 1;
    triesSpan.textContent = tries;
    finishGame();
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      lockBoard = false;
      misses += 1;
      missesSpan.textContent = misses;
      tries += 1;
      triesSpan.textContent = tries;
    }, 1500);
  }
};

// To make the cards appear randomly

const shuffle = () => {
  cards.forEach(card => {
    let randomPosition = Math.floor(Math.random() * 12);
    card.style.order = randomPosition;
  });
};

shuffle();


//Store the results

let gameNumber = 0;



// Check if the game is complete

const finishGame = () => {
  if (matches === 6) {
    stopTimer(); 
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('playAgainBtn').style.display = 'block';
    document.getElementById('playAgainMessage').style.display = 'block';
    document.getElementById('startMessage').style.display = 'none';
    overlay.style.display = 'flex';
    popup.style.display = 'flex';
    endTime = new Date().getTime();
    let elapsedTime = calculateElapsedTime();
    const elapsedTimeFormatted = msToTime(elapsedTime);
    let finalScore = Math.round(calculateFinalScore(elapsedTime,tries));
    gameNumber++
    finalResultSpan.textContent = `Your final result is misses: ${misses}, matches ${matches} y tries ${tries}. And the time is ${elapsedTimeFormatted}. Your final score is ${finalScore}/1000`;
    gameResults.push({game: gameNumber, score: finalScore});
    displayGameLog();
    console.log(gameResults);
  }
};


//Showing on and off the popup for starting the game
// Also reseting the game after clicking in play again.

const overlay = document.querySelector(".overlay");
const popup = document.querySelector(".popup");
const startBtn = document.querySelector("#startBtn");
const playAgainBtn = document.getElementById("playAgainBtn");


startBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  popup.style.display = "none";
  startTimer(); 
});

playAgainBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  popup.style.display = "none"; 
  matches = 0;
  misses = 0;
  tries = 0; 
  startTimer();
  matchesSpan.textContent = matches;
  missesSpan.textContent = misses;
  triesSpan.textContent = tries;

  cards.forEach
  (card => {
    card.classList.remove('flip');
    card.addEventListener('click', flipCard);
  });
  shuffle();
});

overlay.style.display = "flex";
popup.style.display = "flex";

// Add timer variables

let startTime;
let timerInterval;
const timerElement = document.getElementById("timer");
let endTime;
let time = 0;
let timer;
let elapsedTime = 0;

// Update the timer

function updateTimer() {
  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - startTime;
  const minutes = Math.floor(elapsedTime / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

// Start the timer

function startTimer() {
  startTime = new Date().getTime();
  timerInterval = setInterval(updateTimer, 1000);
};

// Stop the timer

function stopTimer() {
  clearInterval(timerInterval);
};

//calculate the elapsed time

function calculateElapsedTime() {
  const endTime = new Date().getTime();
  return endTime - startTime;
}


// Misilecons translator to minutes and seconds to show it in the finnal mesage

function msToTime(duration) {
  const milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60);

  return `${minutes}m ${seconds}s`;
};

//Socring system

const maxTime = 60000;
const maxTries = 12;
const minTries = 6;
const weightTime = 0.5;
const weightTries = 0.5;


function calculateFinalScore(elapsedTime, tries) {
  let timeFactor = (maxTime - elapsedTime) / maxTime;
  let triesFactor = 1 - ((tries - minTries) / (maxTries - minTries));
  let finalScore = 1000 * (timeFactor * weightTime + triesFactor * weightTries);

  return finalScore;
}
// game log system 

const gameLog = document.getElementById('game-log');
const gameResults = [];

// Function to display the game log
function displayGameLog() {
  gameLog.innerHTML = '';
  gameResults.forEach((result, index) => {
    const gameResultDiv = document.createElement('div');
    gameResultDiv.classList.add('game-result');
    gameResultDiv.innerHTML = `Game ${result.game}: Socore ${result.score} `;
    gameLog.appendChild(gameResultDiv);
  });
}
// Call the displayGameLog function initially to show any existing game results
displayGameLog();
