const cards = document.querySelectorAll(".card");
let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;
let timeLeft = 120; // Tiempo en segundos
let timerId;

const music = new Audio("./audio/pokemon-opening.mp3");
music.loop = true;
music.volume = 0.0;
music.play();

function flipCard({ target: clickedCard }) {
  if (cardOne !== clickedCard && !disableDeck) {
    clickedCard.classList.add("flip");
    if (!cardOne) {
      return cardOne = clickedCard;
    }
    cardTwo = clickedCard;
    disableDeck = true;
    let cardOneImg = cardOne.querySelector(".back-view img").src;
    let cardTwoImg = cardTwo.querySelector(".back-view img").src;
    matchCards(cardOneImg, cardTwoImg);
  }
}

cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    disableDeck = false;

function matchCards(img1, img2) {
  if (img1 !== img2) {
    const failSound = new Audio("./audio/eevee-starter.mp3");
    failSound.volume = 0.05;
    failSound.play();
  } else {
    const successSound = new Audio("./audio/mew-mew-mew_wz9wQhy.mp3");
    successSound.volume = 0.05;
    successSound.play();
    matched++;
    if (matched == 8) {
      setTimeout(() => {
        shuffleCard();
      }, 10000);
      const winSound = new Audio("./audio/pokemon-theme.mp3");
      winSound.play();
    }
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    disableDeck = false;
    // Baile de cartas para cuando se acierta
    cardOne.classList.add("dance");
    cardTwo.classList.add("dance");
    setTimeout(() => {
      cardOne.classList.remove("dance");
      cardTwo.classList.remove("dance");
    }, 30000);
  }
  setTimeout(() => {
    cardOne.classList.add("shake");
    cardTwo.classList.add("shake");
  }, 400);
  setTimeout(() => {
    cardOne.classList.remove("shake", "flip");
    cardTwo.classList.remove("shake", "flip");
    cardOne = cardTwo = "";
    disableDeck = false;
  }, 1200);
}

function shuffleCard() {
  matched = 0;
  disableDeck = false;
  cardOne = cardTwo = "";
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  arr.sort(() => Math.random() > 0.5 ? 1 : -1);
  cards.forEach((card, i) => {
    card.classList.remove("flip");
    let imgTag = card.querySelector(".back-view img");
    imgTag.src = `imagenes/img-${arr[i]}.svg`;
    card.addEventListener("click", flipCard);
  });

  
}
// Iniciar el temporizador
timeLeft = 60;
clearInterval(timerId);
timerId = setInterval(() => {
  timeLeft--;
  document.querySelector("#time-left").textContent = timeLeft;
  if (timeLeft === 0) {
    clearInterval(timerId);
    shuffleCard();
  }
}, 1000);



shuffleCard();

cards.forEach(card => {
  card.addEventListener("click", flipCard);
});

/* Function to pause or resume the background music
function pauseResumeMusic() {
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}*/

/* Event listener for the pause/resume button
const pauseResumeBtn = document.querySelector("#pause-resume-btn");
pauseResumeBtn.addEventListener("click", pauseResumeMusic);*/
