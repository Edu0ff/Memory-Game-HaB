//-------------------- VARIABLES--------------------//

//Base Game Variables

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

//Dificulty Mode Variables

let selectedDificulty = "easy";
const easyPairs = 6;
const mediumPairs = 8;
const hardPairs = 10;
let numOfPair;

//Variables for measuring metrics
let matches = 0;
let misses = 0;
let tries = 0;
let finalScore;

// Add timer variables

let startTime;
let timerInterval;
let endTime;
let time = 0;
let timer;
let elapsedTime = 0;

// Variables for game log
let gameNumber = 0;
let gameResults = [];

//-------------------- HTML SELECTORS--------------------//

//Selecting the cards
let cards = document.querySelectorAll('.memory-card');

//Selecting elements in the HTML for metrics
const matchesSpan = document.getElementById('matches');
const missesSpan = document.getElementById('misses');
const triesSpan = document.getElementById('tries');

//Pop up HTML selectors

const overlay = document.querySelector(".overlay");
const popup = document.querySelector(".popup");
const startBtn = document.querySelector("#startBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const selectorElems = document.querySelectorAll('input[name="selector"]');
const finalResultSpan = document.getElementById('playAgainMessage');

//Timer selector
const timerElement = document.getElementById("timer");

//game log
const gameLogDiv = document.getElementById("gameLog");


//-------------------- FUNCTIONS--------------------//

//BASE GAME

//function to flip the cards
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

//function to apply theflip funtion to all the cards
function addFlipCardEventListeners() {
  cards.forEach(card => card.addEventListener('click', flipCard));
};

//function to check the 2 cards selected are the same and what happen if true or false
const checkMatch = () => {
  if (firstCard.dataset.framework === secondCard.dataset.framework) {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matches += 1;
    matchesSpan.textContent = `${matches} / ${numOfPair}`;
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

//function to randmoly reorder the position of the cards

const shuffle = () => {
  cards.forEach(card => {
    let randomPosition = Math.floor(Math.random() * numOfPair * 2);
    card.style.order = randomPosition;
  });
};



//function that checks if the game is finished and trigger all the things associated to this phase

const finishGame = () => {
  if (matches === numOfPair) {
    stopTimer();
    cards.forEach
    (card => {
      card.classList.remove('flip');
      card.addEventListener('click', flipCard);
    });
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('playAgainBtn').style.display = 'block';
    document.getElementById('playAgainMessage').style.display = 'block';
    document.getElementById('startMessage').style.display = 'none';
    overlay.style.display = 'flex';
    popup.style.display = 'flex';
    endTime = new Date().getTime();
    let elapsedTime = calculateElapsedTime();
    const elapsedTimeFormatted = msToTime(elapsedTime);
    finalScore = Math.round(calculateFinalScore(elapsedTime, tries));
    gameNumber++
    finalResultSpan.textContent = `Your final result is misses: ${misses}, matches ${matches} y tries ${tries}. And the time is ${elapsedTimeFormatted}. Your final score is ${finalScore}/1000`;
    gameResults.push({ game: gameNumber, score: finalScore });
    let resultString = `Game ${gameNumber}: Score ${finalScore}`;
    console.log("Final Score: ", finalScore);
    console.log(gameResults);
    console.log(resultString);
    displayGameLog(resultString);
  }
};

// Update the timer function
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
};

// Misilecons translator to minutes and seconds to show it in the finnal mesage
function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60);

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return minutes + ":" + seconds;
}

// Calculate the final score
function calculateFinalScore(elapsedTime, tries) {
  const baseScore = 1000;
  const timePenalty = (elapsedTime/1000)*10;
  const triesPenalty = tries * 2;
  const finalScore = baseScore - timePenalty - triesPenalty;
  return finalScore > 0 ? finalScore : 0;
}

// Display game log
function displayGameLog(message) {
  const gameLog = document.getElementById("game-log");
  const newLogEntry = document.createElement("p");
  newLogEntry.textContent = message;
  gameLog.appendChild(newLogEntry);
}

//Dificulty Level Functions
const dificultyPairs = () => {
  switch (selectedDificulty) {
    case "easy":
      numOfPair = easyPairs;
      break;
    case "medium":
      numOfPair = mediumPairs;
      break;
    case "hard":
      numOfPair = hardPairs;
      break;
  };
}

function setDifficulty(difficulty = 'easy') {
  let pairsToShow;

  if (difficulty === 'easy') {
    pairsToShow = easyPairs;
  } else if (difficulty === 'medium') {
    pairsToShow = mediumPairs;
  } else if (difficulty === 'hard') {
    pairsToShow = hardPairs;
  }

  const cardsDificulty = document.querySelectorAll('.memory-card');
  cardsDificulty.forEach((card, index) => {
    card.classList.remove('easy', 'medium', 'hard'); // Remove existing difficulty classes
    card.classList.add(difficulty);// Add the new difficulty class

    if (index < pairsToShow * 2) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
  cards = document.querySelectorAll('.memory-card');
  shuffle();
  addFlipCardEventListeners();
}



//----------EVENT LISTENERS------//

//Add interactivity to the Start button
//Disbale the pop up and allow to play when clicked

startBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  popup.style.display = "none";
  startTimer();
});

//Selected Dificuklty level
selectorElems.forEach((elem) => {
  elem.addEventListener("click", () => {
    selectedDificulty = elem.value;
    setDifficulty(selectedDificulty);
    console.log(numOfPair);
  });
});

//Play again button
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
  shuffle();
});


//----------INITIATE THE GAME------//

setDifficulty(selectedDificulty);
dificultyPairs();
shuffle();






