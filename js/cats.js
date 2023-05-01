//-------------------- VARIABLES--------------------//

//board and Cards Variables
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

//Dificulty Mode Variables
let selectedDificulty = "easy";
const easyPairs = 6;
const mediumPairs = 8;
const hardPairs = 10;
let numOfPair;

//Game mode
let selectedGameMode ='solo';

//ai mode variabnles
let aiMatches = 0; 
let humaMatches = 0;
let turn = 'human';
let aiEnabled = false;
let firstRandomCard;
let secondRandomCard;

//Variables for Solo mode
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
let availableCards = document.querySelectorAll('.memory-card:not(.no)');

//Selecting elements in the HTML for metrics
const score = document.getElementById('score');
const vs = document.getElementById('vs');
const matchesSpan = document.getElementById('matches');
const missesSpan = document.getElementById('misses');
const triesSpan = document.getElementById('tries');
const humaMatchesSpan = document.getElementById('huma-matches');
const aiMatchesSpan = document.getElementById('aiMatches');

//Pop up HTML selectors
const overlay = document.querySelector(".overlay");
const popup = document.querySelector(".popup");
const startBtn = document.querySelector("#startBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const selectorElems = document.querySelectorAll('input[name="selector"]');
const finalResultSpan = document.getElementById('playAgainMessage');
const gameModeSelector = document.querySelectorAll('input[name="mode"]');

//Timer selector
const timerElement = document.getElementById("timer");

//game log
const gameLogDiv = document.getElementById("gameLog");


//-------------------- FUNCTIONS--------------------//

//SOLO MODE FUNCTIONS

//function to flip the cards
function flipCard() {
  if (lockBoard || (selectedGameMode === 'ai')) return;
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

//function to apply the flip funtion to all the cards
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
    displayGameLog(resultString);
  }
};

//TIMER FUNCTIONS

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

//SCORING SYTEM

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

//DIFICULTY FUNCTIONS

//translate dificulty to number of pairs
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

//apply selected dificulty
function setDifficulty(difficulty = 'easy') {

  if (difficulty === 'easy') {
    numOfPair = easyPairs;
  } else if (difficulty === 'medium') {
    numOfPair = mediumPairs;
  } else if (difficulty === 'hard') {
    numOfPair = hardPairs;
  }

  const cardsDificulty = document.querySelectorAll('.memory-card');
  cardsDificulty.forEach((card, index) => {
    card.classList.remove('easy', 'medium', 'hard'); // Remove existing difficulty classes
    card.classList.add(difficulty);// Add the new difficulty class

    if (index < numOfPair * 2) {
      card.style.display = '';
      card.classList.remove('no');
    } else {
      card.style.display = 'none';
      card.classList.add('no');
    }
  });
  cards = document.querySelectorAll('.memory-card');
}


//GAME STATES

//AI MODE
//ai functions 

//ad listener for ai mode

// AI-specific event listeners
function addAiFlipCardEventListeners() {
  cards.forEach(card => card.addEventListener('click', aiflipCard));
  console.log('adding aiFipcard');
}

// AI-specific flipCard function
function aiflipCard() {
  if (lockBoard) return;
  this.classList.add('flip');
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
  } else {
    hasFlippedCard = false;
    secondCard = this;
    aiCheckMatch();
  }
};

// AI-specific checkMatch function
const aiCheckMatch = () => {
  if (turn === 'human') {
    if (firstCard.dataset.framework === secondCard.dataset.framework) {
      console.log('iguales humano');
      firstCard.removeEventListener('click', aiflipCard);
      secondCard.removeEventListener('click', aiflipCard);
      humaMatches += 1;
 
      humaMatchesSpan.textContent = `${humaMatches} / ${Math.floor(numOfPair / 2)}`;
      console.log('iguales humano');
      console.log(humaMatches);
      console.log(numOfPair /2);
      aiFinishGame();
    } else {
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        lockBoard = false;
        console.log('diferentes humano');
        console.log(humaMatches);
        console.log(numOfPair /2);
      }, 1500);
    }
    turn = 'ai'
    setTimeout(() => {
      aiTurn()
    }, 1700);
   } else { 
    if (firstCard.dataset.framework === secondCard.dataset.framework) {
    console.log('iguales ia');
    firstCard.removeEventListener('click', aiflipCard);
    secondCard.removeEventListener('click', aiflipCard);
    aiMatches += 1;
    aiMatchesSpan.textContent = `${aiMatches} / ${numOfPair / 2}`;
    console.log('iguales ia');
    console.log(aiMatches);
    console.log(numOfPair /2);
    aiFinishGame();
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      lockBoard = false;
      console.log('diferentes ia');
      console.log(humaMatches);
      console.log(numOfPair /2);
    }, 1500);
  }
  turn = 'human';
   }
 }
 
//random selection for the ai

function selectRandomCard(unflippedCards) {
  const randomIndex = Math.floor(Math.random() * unflippedCards.length);
  return unflippedCards[randomIndex];
}

//ai turn


const aiTurn = () => {
  if (turn === "human") {
    return;
  } else {
    let availableCards = document.querySelectorAll('.memory-card:not(.no)');
    console.log(availableCards);
    const unflippedCards = Array.from(availableCards).filter(card => !card.classList.contains('flip'));
    console.log(unflippedCards);
    firstCard = selectRandomCard(unflippedCards);
    console.log(firstCard);
    secondCard = selectRandomCard(unflippedCards.filter(card => card !== firstCard));
    console.log(secondCard);
    firstCard.classList.add('flip');
    secondCard.classList.add('flip');
    setTimeout(() => {
      aiCheckMatch();
    }, 1500);
  }
};


// ai finish game

const aiFinishGame = () => {
  if (humaMatches === numOfPair / 2 ){
    turn = 'human';
    stopTimer();
    cards.forEach
    (card => {
      card.classList.remove('flip');
      card.addEventListener('click', aiflipCard);
    });
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('playAgainBtn').style.display = 'block';
    document.getElementById('playAgainMessage').style.display = 'block';
    document.getElementById('startMessage').style.display = 'none';
    overlay.style.display = 'flex';
    popup.style.display = 'flex';
    finalResultSpan.textContent = `You Won the Machine`;
  } else if (aiMatches === numOfPair / 2 ) {
    stopTimer();
    cards.forEach
    (card => {
      card.classList.remove('flip');
      card.addEventListener('click', aiflipCard);
    });
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('playAgainBtn').style.display = 'block';
    document.getElementById('playAgainMessage').style.display = 'block';
    document.getElementById('startMessage').style.display = 'none';
    overlay.style.display = 'flex';
    popup.style.display = 'flex';
    finalResultSpan.textContent = `You lose againts Machine`;
  }
  return
}


//----------EVENT LISTENERS------//

// game initation 

const initGame = () => {
  if (selectedGameMode === 'solo') {
    setDifficulty(selectedDificulty);
    shuffle();
    addFlipCardEventListeners();
    score.style.display = '';
    vs.style.display = 'none';
  } else {
    setDifficulty(selectedDificulty);
    shuffle();
    addAiFlipCardEventListeners();
    score.style.display = 'none';
    vs.style.display = '';
  };
};


//Add interactivity to the Start button
//Disbale the pop up and allow to play when clicked

startBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  popup.style.display = "none";
  matches = 0;
  misses = 0;
  tries = 0;
  aiMatches = 0; 
  humaMatches = 0;
  matchesSpan.textContent = `${matches} / ${numOfPair}`;
  missesSpan.textContent = misses;
  triesSpan.textContent = tries;
  humaMatchesSpan.textContent = `${humaMatches} / ${numOfPair / 2}`;
  aiMatchesSpan.textContent = `${aiMatches} / ${numOfPair / 2}`;
  startTimer();
  initGame();
});

//Selected Dificuklty level
selectorElems.forEach((elem) => {
  elem.addEventListener("click", () => {
    selectedDificulty = elem.value;
    setDifficulty(selectedDificulty);
  });
});

//select game mode
gameModeSelector.forEach((elem) => {
  elem.addEventListener("click", () => {
    selectedGameMode = elem.value;
  });
});

//Play again button
playAgainBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  popup.style.display = "none";
  matches = 0;
  misses = 0;
  tries = 0;
  aiMatches = 0; 
  humaMatches = 0;
  startTimer();
  matchesSpan.textContent = `${matches} / ${numOfPair}`;
  missesSpan.textContent = misses;
  triesSpan.textContent = tries;
  humaMatchesSpan.textContent = `${humaMatches} / ${Math.floor(numOfPair / 2)}`;
  aiMatchesSpan.textContent = `${aiMatches} / ${numOfPair / 2}`;
  shuffle();
});


//----------INITIATE THE GAME------//


initGame();





