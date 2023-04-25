// declare vairbles for cards, cards flipped, for locking the board , and for identifying both cards clicked
const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matches = 0;
let misses = 0;
let tries = 0;
const matchesSpan = document.getElementById('matches');
const missesSpan = document.getElementById('misses');
const triesSpan = document.getElementById('tries');
let time = 0;
let timer;


// we add listener over the cards to be able to play with them

cards.forEach(card => card.addEventListener('click',flipCard));

// this functions inclludes the property flips to the cards so the effect is added using the CSS
function flipCard() {
    if(lockBoard) return;
    //if(this === firstCard) return;
    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
    } else {
        hasFlippedCard = false;
        secondCard = this;
        
        checkMatch();

    };
};

//This function is meant to check if both card selected by the users has the same image. If both cards are the same the listener are erased so both card remain flipped. If not both card return to originalposition.
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

//to make the card appear randmly

const shuffle = () => {

    cards.forEach(card => {
        let randomPosition =Math.floor(Math.random() * 12);
        card.style.order =randomPosition;
    });
};

// we call the function to make the 

shuffle();


// check if the game is complete

const finishGame = () => {
    if (matches === 6) {
      console.log(`you win motherfucker`);
      cards.forEach(card => card.addEventListener('click',flipCard));

        // Show the popup
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
  
      // reset game
      matches = 0;
      misses = 0;
      tries = 0;
      matchesSpan.textContent = matches;
      missesSpan.textContent = misses;
      triesSpan.textContent = tries;
      cards.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click',flipCard);
      });
      shuffle();
    };
  };
  
//timer 

function startTimer() {
  timer = setInterval(() => {
    time++;
    console.log(time);
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

