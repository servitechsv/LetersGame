const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameOverElement = document.getElementById('game-over');
let score = 0;
let lives = 3;
let escapedLetters = 0;
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'];

function getRandomLetter() {
    return letters[Math.floor(Math.random() * letters.length)];
}

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function createLetter() {
    const letter = document.createElement('div');
    letter.classList.add('letter');
    letter.textContent = getRandomLetter();
    letter.style.color = getRandomColor();
    letter.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
    letter.style.top = '0px';
    gameContainer.appendChild(letter);

    const fallInterval = setInterval(() => {
        const top = parseInt(letter.style.top, 10);
        if (top > window.innerHeight) {
            clearInterval(fallInterval);
            gameContainer.removeChild(letter);
            escapedLetters++;
            if (escapedLetters >= 10) {
                loseLife();
                escapedLetters = 0; // Reiniciar el contador de letras escapadas
            }
        } else {
            letter.style.top = `${top + 2}px`;
        }
    }, 20);
}

function createParticles(x, y) {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${x + Math.random() * 20 - 10}px`; // Dispersar partículas
        particle.style.top = `${y + Math.random() * 20 - 10}px`;
        gameContainer.appendChild(particle);
        setTimeout(() => {
            gameContainer.removeChild(particle);
        }, 500);
    }
}

function shootRay(target) {
    const ray = document.createElement('div');
    ray.classList.add('ray');
    const spaceshipRect = document.getElementById('spaceship').getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    // Posición del rayo desde la nave/castillo hasta la letra
    ray.style.left = `${spaceshipRect.left + spaceshipRect.width / 2}px`;
    ray.style.bottom = `${window.innerHeight - spaceshipRect.top}px`;
    ray.style.height = `${targetRect.top - spaceshipRect.top}px`;
    gameContainer.appendChild(ray);

    setTimeout(() => {
        gameContainer.removeChild(ray);
    }, 300);

    // Destruir la letra y crear partículas
    createParticles(targetRect.left + 15, targetRect.top + 15);
    gameContainer.removeChild(target);
    score += 10;
    scoreElement.textContent = `Puntuación: ${score}`;
}

function loseLife() {
    lives--;
    livesElement.textContent = `Vidas: ${lives}`;
    if (lives <= 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(letterInterval); // Detener la generación de letras
    gameOverElement.style.display = 'block'; // Mostrar mensaje de fin de juego
}

document.addEventListener('keydown', (event) => {
    const keyPressed = event.key.toUpperCase();
    const lettersOnScreen = document.querySelectorAll('.letter');
    lettersOnScreen.forEach(letter => {
        if (letter.textContent === keyPressed) {
            shootRay(letter);
        }
    });
});

const letterInterval = setInterval(createLetter, 1000);
