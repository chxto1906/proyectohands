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
    "VIOLETA": "Es un nombre femenino y un color",
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

// Añade las referencias a los elementos de audio
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

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
    if (mistakes === bodyParts.length) {
        // Reproducir sonido de respuesta incorrecta
        wrongSound.play();
        endGame();
    }
}


const endGame = () => {
    // Elimina eventos de clic en las imágenes
    const letterImages = document.querySelectorAll('.letter-image');
    letterImages.forEach(image => {
        image.removeEventListener('click', imageClickEvent);
    });

    // Mostrar mensaje "Pasa a la siguiente" si se completa la palabra correctamente
    if (hits === selectedWord.length) {
        // Reproducir sonido de respuesta correcta
        correctSound.play();
        showNextMessage();
    }
    
};

const correctLetter = letter => {
    const { children } = wordContainer;
    for (let i = 0; i < children.length; i++) {
        if (children[i].innerHTML === letter) {
            children[i].classList.toggle('hidden');
            hits++;
        }
    }
    if (hits === selectedWord.length) {
        // Reproducir sonido de respuesta correcta
        correctSound.play();
        endGame();
    }
};

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

const showNextMessage = () => {
    const messageElement = document.createElement('p');
    messageElement.textContent = 'Pasa a la siguiente';
    wordContainer.appendChild(messageElement);
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

// Agrega el evento click al botón "Nuevo"
const newButton = document.getElementById('newButton');
newButton.addEventListener('click', restartGame);

startButton.addEventListener('click', startGame);
