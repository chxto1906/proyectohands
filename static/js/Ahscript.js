const wordContainer = document.getElementById('wordContainer');
const startButton = document.getElementById('startButton');
const usedLettersElement = document.getElementById('usedLetters');

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.canvas.width = 0;
ctx.canvas.height = 0;

const bodyParts = [
    [4, 2, 1, 1],
    [4, 3, 1, 2],
    [3, 5, 1, 1],
    [5, 5, 1, 1],
    [3, 3, 1, 1],
    [5, 3, 1, 1]
];

const wordHints = {
    "LEON": "Ruge y es fuerte",
    "CABALLO": "Hay de tierra y hay de mar",
    "PERRO": "El mejor amigo del hombre",
    "GATO": "Son tiernos pero arañan",
    "NIEVE": "Es blanca y fria",
    "ROSA": "Es un nombre femenino y un color",
    "SOL": "Nos da luz y calor",
    "LUNA": "Sale cuando el sol se esconde",
    "GLOBO": "Se usa en fiestas y cumpleaños",
    "FLOR": "Atrae a las mariposas y abejas",
    // Agrega más palabras y pistas según lo desees
};

let selectedWord;
let selectedWordHint;
let usedLetters;
let mistakes;
let hits;

const addLetter = letter => {
    const letterElement = document.createElement('span');
    letterElement.innerHTML = letter.toUpperCase();
    usedLettersElement.appendChild(letterElement);
}

const addBodyPart = bodyPart => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(...bodyPart);
};

const wrongLetter = () => {
    addBodyPart(bodyParts[mistakes]);
    mistakes++;
    if (mistakes === bodyParts.length) endGame();
}

const endGame = () => {
    // Incrementa el marcador de la puntuación
    score++;
    // Actualiza el marcador en el HTML
    updateScoreCounter();
    // Elimina eventos de clic en las imágenes
    const letterImages = document.querySelectorAll('.letter-image');
    letterImages.forEach(image => {
        image.removeEventListener('click', imageClickEvent);
    });

    startButton.style.display = 'block';
}

const correctLetter = letter => {
    const { children } = wordContainer;
    for (let i = 0; i < children.length; i++) {
        if (children[i].innerHTML === letter) {
            children[i].classList.toggle('hidden');
            hits++;
        }
    }
    if (hits === selectedWord.length) endGame();
}

const letterInput = letter => {
    if (selectedWord.includes(letter)) {
        correctLetter(letter);
    } else {
        wrongLetter();
    }
    addLetter(letter);
    usedLetters.push(letter);
};

// Nuevo evento de clic para las imágenes
const imageClickEvent = event => {
    const letter = event.target.alt.toUpperCase();
    letterInput(letter);
};

const drawWord = () => {
    selectedWord.forEach(letter => {
        const letterElement = document.createElement('span');
        letterElement.innerHTML = letter.toUpperCase();
        letterElement.classList.add('letter');
        letterElement.classList.add('hidden');
        wordContainer.appendChild(letterElement);
    });

    // Muestra la pista correspondiente
    const hintElement = document.createElement('p');
    hintElement.innerHTML = `Pista: ${selectedWordHint}`;
    wordContainer.appendChild(hintElement);
};

const selectRandomWord = () => {
    const words = Object.keys(wordHints);
    let word = words[Math.floor((Math.random() * words.length))];
    selectedWord = word.split('');
    selectedWordHint = wordHints[word];
};

const drawHangMan = () => {
    ctx.canvas.width = 120;
    ctx.canvas.height = 160;
    ctx.scale(20, 20);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#d95d39';
    ctx.fillRect(0, 7, 4, 1);
    ctx.fillRect(1, 0, 1, 8);
    ctx.fillRect(2, 0, 3, 1);
    ctx.fillRect(4, 1, 1, 1);
};

const pistaFunction = (word) => {
    let hint = wordHints[word];
    if (hint) {
        ctx.fillStyle = "black";
        ctx.font = "bold 20px Courier";
        ctx.fillText(`Hint: ${hint}`, 10, 15);
    }
};

const startGame = () => {
    usedLetters = [];
    mistakes = 0;
    hits = 0;
    wordContainer.innerHTML = '';
    usedLettersElement.innerHTML = '';
    drawHangMan();
    selectRandomWord();
    drawWord();

    // Muestra las imágenes de las letras al iniciar el juego
    const letterImages = document.querySelectorAll('.letter-image');
    letterImages.forEach(image => {
        image.style.display = 'inline-block';
        image.addEventListener('click', imageClickEvent);
    });

    // Oculta el canvas si está presente
    canvas.style.display = 'block';

    // Oculta el botón "START"
    startButton.style.display = 'none';

    // Mostrar pista
    pistaFunction(selectedWord.join(''));
};

const restartGame = () => {
    // Reinicia el juego
    startGame();
    // Reinicia el contador de puntuación a cero
    score = 0;
    updateScoreCounter();
    // Verifica si el puntaje actual supera el mejor puntaje anterior
    if (score > bestScore) {
        bestScore = score;
        updateBestScoreCounter();
    }
};

let score = 0;
let bestScore = 0;
const scoreCounter = document.getElementById('scoreCounter');
const bestScoreCounter = document.getElementById('bestScoreCounter');

const updateScoreCounter = () => {
    scoreCounter.textContent = score;
};

const updateBestScoreCounter = () => {
    bestScoreCounter.textContent = bestScore;
};

// Agrega el evento click al botón "Nuevo"
const newButton = document.getElementById('newButton');
newButton.addEventListener('click', restartGame);

startButton.addEventListener('click', startGame);
