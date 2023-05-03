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
const scorePlayerMetric  = document.getElementById('score-player');
const scoreComputerMetric = document.getElementById('score-computer');

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

//function to remove the flip funtion to all the cards

const resetFlipCardEventListener = () => {
  cards.forEach(card => {card.classList.remove('flip');
  card.addEventListener('click', flipCard);
  });
};

// whe a match is true solo Mode

const soloModeTrueMatch = () => {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matches += 1;
    matchesSpan.textContent = `${matches} / ${numOfPair}`;
    tries += 1;
    triesSpan.textContent = tries;
    const musicAcierto = new Audio ("audio/audio-dbz/radar-dragonball.mp3");
    musicAcierto.play("audio/audio-dbz/radar-dragonball.mp3");
};

// whe a match is false solo Mode
const soloModeFalseMatch = () => {
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        lockBoard = false;
        misses += 1;
        missesSpan.textContent = misses;
        tries += 1;
        triesSpan.textContent = tries;
        const musicFallo = new Audio ("audio/audio-dbz/ball-dragon-gt-jump.mp3");
        musicFallo.play("audio/audio-dbz/ball-dragon-gt-jump.mp3");
    }, 1500);
};

//function to check the 2 cards selected are the same and what happen if true or false
const checkMatch = () => {
  if (firstCard.dataset.framework === secondCard.dataset.framework) {
    soloModeTrueMatch();
    finishGame();
  } else {
    soloModeFalseMatch();
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
    resetFlipCardEventListener();
    finishPopUpSolo();
    gameLogCreator();
  }
};

//to include the game log at the end of each game
const gameLogCreator = () => {
    gameNumber++
    gameResults.push({ game: gameNumber, mode: selectedGameMode, dificulty: selectedDificulty, score: finalScore});
    let resultString = ` Game ${gameNumber}:Mode ${selectedGameMode} - Dificulty ${selectedDificulty} - Score ${finalScore} `;
    displayGameLog(resultString);

}

//POP UP RELATED FUNCTIONS

//finish Game Pop up
const finishPopUpSolo = () => {
  document.getElementById('startBtn').style.display = 'none';
  document.getElementById('playAgainBtn').style.display = 'block';
  document.getElementById('finishText').style.display = 'block';
  document.getElementById('welcomeText').style.display = 'none';
  document.getElementById('playAgainMessage').style.display = 'block';
  overlay.style.display = 'flex';
  popup.style.display = 'flex';
  endTime = new Date().getTime();
  let elapsedTime = calculateElapsedTime();
  const elapsedTimeFormatted = msToTime(elapsedTime);
  finalScore = Math.round(calculateFinalScore(elapsedTime, tries));
  finalResultSpan.textContent = `Your final result is ${misses} misses, ${matches} matches y ${tries}tries stoping the timer at ${elapsedTimeFormatted}. Your final score is ${finalScore}/1000`;
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
};

//SCORING SYTEM

// Calculate the final score
function calculateFinalScore(elapsedTime, tries) {
  let levelModificator;
  let modeModificator;

  if (selectedDificulty === 'easy') {
    levelModificator = 2;
  } else if (selectedDificulty === 'medium') {
    levelModificator = 1.5;
  } else if (selectedDificulty === 'hard') {
    levelModificator = 1;
  }

  if (selectedDificulty === 'solo') {
    modeModificator = 1.5;
  } else {
    modeModificator = 1;
  }

  const baseScore = 1000;
  const timePenalty = (elapsedTime/1000)(10 * modeModificator);
  const triesPenalty = tries * levelModificator;
  const finalScore = baseScore - timePenalty - triesPenalty;
  return finalScore > 0 ? finalScore : 0;
};

// Display game log
function displayGameLog(message) {
  const gameLog = document.getElementById("game-log");
  const newLogEntry = document.createElement("p");
  newLogEntry.textContent = message;
  gameLog.appendChild(newLogEntry);
};

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
};

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
};

//AI MODE


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
      aiFinishGame();
    } else {
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        lockBoard = false;
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
    aiFinishGame();
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      lockBoard = false;
      scorePlayerMetric.classList.add('turn');
      scoreComputerMetric.classList.remove('turn')
    }, 1500);
  }
  turn = 'human';
   }
 };
 
//random selection for the ai
function selectRandomCard(unflippedCards) {
  const randomIndex = Math.floor(Math.random() * unflippedCards.length);
  return unflippedCards[randomIndex];
};

//ai turn
const aiTurn = () => {
  if (turn === "human") {
    return;
  } else {
    scorePlayerMetric.classList.remove('turn')
    scoreComputerMetric.classList.add('turn');
    let availableCards = document.querySelectorAll('.memory-card:not(.no)');
    const unflippedCards = Array.from(availableCards).filter(card => !card.classList.contains('flip'));
    firstCard = selectRandomCard(unflippedCards);
    secondCard = selectRandomCard(unflippedCards.filter(card => card !== firstCard));
    firstCard.classList.add('flip');
    secondCard.classList.add('flip');
    setTimeout(() => {
      aiCheckMatch();
    }, 1500);
  }
};

//function to reset aiflipcards

const resetFlipCardEventListenerAi = () => {
  cards.forEach(card => {card.classList.remove('flip');
  card.addEventListener('click', aiflipCard);
  });
};


// ai finish game
const aiFinishGame = () => {
  if (humaMatches === numOfPair / 2 ){
    turn = 'human';
    stopTimer();
    resetFlipCardEventListenerAi();
    finishPopUphumanWins();
    gameLogCreator();
  } else if (aiMatches === numOfPair / 2 ) {
    stopTimer();
    resetFlipCardEventListenerAi();
    gameLogCreator();
    finishPopUpAiWins();
  }
  return
};

//finish Game Pop up
const finishPopUpAiWins = () => {
  document.getElementById('finishTextLose').style.display = 'block';
  document.getElementById('welcomeText').style.display = 'none';
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
  finalResultSpan.textContent = `You lost in ${elapsedTimeFormatted}. Your final score is ${finalScore}/1000`;
};

const finishPopUphumanWins = () => {
  document.getElementById('finishText').style.display = 'block';
  document.getElementById('welcomeText').style.display = 'none';
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
  finalResultSpan.textContent = `You Won againts the Team Rocket !!! You did it in ${elapsedTimeFormatted}. Your final score is ${finalScore}/1000`;
};


//reset stats

const resetStats = () => {
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
}

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

//----------EVENT LISTENERS------//

//Add interactivity to the Start button
//Disbale the pop up and allow to play when clicked

startBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  popup.style.display = "none";
  resetStats();
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
  resetStats();
  startTimer();
  shuffle();
});


//----------INITIATE THE GAME------//


initGame();


// musicgame

let mute = document.getElementById("mute");
let unmute = document.getElementById("unmute");


function playPause() {
  if (myAudio.paused) {
    mute.style.display = "";
    unmute.style.display = "none";
    myAudio.play();
  } else {
    myAudio.pause();
    mute.style.display = "none";
    unmute.style.display = "";
  }
}

const audio = new Audio("audio/audio-dbz/radar-dragonball.mp3");

const btn = document.querySelector("#startBtn");
btn.addEventListener('click', function() {
  audio.play(); 
});


const audio2 = new Audio("audio/audio-dbz/bola_de_dragon_z_prologo_del_capitulo.mp3");

const btn2 = document.querySelector("#playAgainBtn");
btn2.addEventListener('click', function() {
  audio2.play(); 
});
