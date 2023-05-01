const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
    if(lockBoard) return;
    if(this === firstCard) return;
    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;

        console.log({hasFlippedCard, firstCard});
    } else {
        hasFlippedCard = false;
        secondCard = this;
        
        checkMatch();

    };
};

const checkMatch = () => {
    if ( firstCard.dataset.framework === secondCard.dataset.framework) {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            lockBoard = false;
        }, 1500);
        
    };
};

const shuffle = () => {

    cards.forEach(card => {
        let randomPosition =Math.floor(Math.random() * 12);
        card.style.order =randomPosition;
    });
};

shuffle();
cards.forEach(card => card.addEventListener('click',flipCard));

