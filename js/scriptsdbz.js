
const cards = document.querySelectorAll('.memory-card');
const scoresSpan = document.getElementById('scores');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

const miBoton = document.getElementById("botonMusic");

miBoton.addEventListener("click", function() {
  const music = new Audio ("audio/audio-dbz/Goodbye Warriors.mp3");
  music.play ("audio/audio-dbz/Goodbye Warriors.mp3");
  music.loop = true;
  
});


function flipCard() {
  
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  // insertar musica para el acierto y el fallo de parejas
  if (firstCard.dataset.framework === secondCard.dataset.framework) {
    
    const musicAcierto = new Audio ("audio/audio-dbz/radar-dragonball.mp3");
    musicAcierto.play("audio/audio/radar-dragonball.mp3");
    musicAcierto.loop = false;
  } else {
    const musicFallo = new Audio ("audio/audio-dbz/ball-dragon-gt-jump.mp3");
    musicFallo.play("audio/audio/radar-dragonball.mp3");
    musicFallo.loop = false;
  }

  checkForMatch();
};

let aciertos = 0;
let fallos = 0;
let intentos = 0;

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch ? disableCards() : unflipCards();
  
  // if(aciertos === 8) {
  //   cards.forEach(card => card.addEventListener('click', flipCard));
  //   console.log(`terminado`)
  // }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  aciertos += 1;
  intentos += 1;
  scoresSpan.textContent = `Aciertos: ${aciertos} Fallos: ${fallos} Intentos: ${intentos}`
  
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  fallos += 1;
  intentos += 1;
  scoresSpan.textContent = `Aciertos: ${aciertos} Fallos: ${fallos} Intentos: ${intentos}`
  
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
  
}



(function shuffle() {
  cards.forEach(card => {
    let ramdomPos = Math.floor(Math.random() * 16);
    card.style.order = ramdomPos;
   
  });
})();



cards.forEach(card => card.addEventListener('click', flipCard));



// contador tiempo

let segundos = 0;
let minutos = 0;


function contadorTiempo() {
  segundos++;
  if (segundos == 60) {
    segundos = 0;
    minutos++;
  }
  if (minutos == 60) {
    minutos = 0;
    horas++;
  }
  if (segundos == 90) {
    alert(`Freezer Wins!`)
  }
  document.getElementById("contador").innerHTML = minutos + ":" + segundos;
}

setInterval(contadorTiempo, 1000);


// reseteo de cartas


function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch ? disableCards() : unflipCards();
  
  if(aciertos === 8) {
    resetGame();
  }
}

function resetGame() {
  cards.forEach(card => card.removeEventListener('click', flipCard));
  setTimeout(() => {
    cards.forEach(card => {
      card.classList.remove('flip');
      card.addEventListener('click', flipCard);
    });
    shuffleCards();
    aciertos = 0;
    fallos = 0;
    intentos = 0;
    segundos = 0;
    minutos = 0;
    document.getElementById("contador").innerHTML = minutos + ":" + segundos;
    scoresSpan.textContent = `Aciertos: ${aciertos} Fallos: ${fallos} Intentos: ${intentos}`
  }, 2000);
}


// reseteo de contadores



