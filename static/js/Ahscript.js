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
    "FLOR": "Puede ser de diversos colores y aromas",
    "LAPIZ": "Se usa para dibujar y escribir",
    "GATO": "Son tiernos pero arañan",
    "LIBRO": "Contiene páginas y se lee",
    "VIOLETA": "Es un nombre femenino y un color",
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

let lostWordAudio; // Variable global para almacenar el audio

const cargarIconos = () => {
    // Crear un nuevo elemento de audio y establecer la fuente manualmente
    lostWordAudio = new Audio('/static/sounds/lostword.mp3');
}

let findWordAudio; // Variable global para almacenar el audio

const cargarIconos2 = () => {
    // Crear un nuevo elemento de audio y establecer la fuente manualmente
    findWordAudio = new Audio('/static/sounds/findword.mp3');
}

const lostMessage = () => {
    const messageElement = document.createElement('p');
    messageElement.textContent = '¡Has perdido! Pulsa Next!';
    messageElement.style.fontSize = '24px'; // Tamaño de fuente más grande
    messageElement.style.fontWeight = 'bold'; // Texto en negrita
    wordContainer.appendChild(messageElement);

    lostWordAudio.play();

};

const endGame = () => {
    // Elimina eventos de clic en las imágenes
    const letterImages = document.querySelectorAll('.letter-image');
    letterImages.forEach(image => {
        image.removeEventListener('click', imageClickEvent);
    });

    // Mostrar mensaje "Pasa a la siguiente" si se completa la palabra correctamente
    if (hits === selectedWord.length) {
        // Reproducir sonido de respuesta correcta
        showNextMessage();
    } else if (mistakes === bodyParts.length) {
        // Reproducir sonido de respuesta incorrecta
        lostMessage();
    }

    // Verifica si todas las palabras han sido completadas
    let allWordsCompleted = true;
    for (const word of Object.keys(wordHints)) {
        if (!wordContainer.textContent.includes(word)) {
            allWordsCompleted = false;
            break;
        }
    }

    if (allWordsCompleted) {
        // Redirigir a la página MemorFelicita.html si todas las palabras se han completado correctamente
        window.location.href = "/juegos/ahorcado/felicidades";
    } else if (currentWord === "VIOLETA" && hits === selectedWord.length) {
        // Redirigir a la página MemorFelicita.html si la palabra actual es "VIOLETA" y se ha completado correctamente
        window.location.href = "/juegos/ahorcado/felicidades";
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

let wordIndex = 0; // Variable para almacenar el índice de la palabra actual seleccionada
let currentWord; // Variable para almacenar la palabra actual que estás intentando adivinar

const selectNextWord = () => {
    const words = Object.keys(wordHints);
    const currentIndex = words.indexOf(currentWord);
    const nextIndex = (currentIndex + 1) % words.length; // Avanzar al siguiente índice circularmente
    currentWord = words[nextIndex];
    selectedWord = currentWord.split('');
    selectedWordHint = wordHints[currentWord];
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
    messageElement.textContent = 'Pasa a la siguiente !Next¡';
    messageElement.style.fontSize = '24px'; // Tamaño de fuente más grande
    messageElement.style.fontWeight = 'bold'; // Texto en negrita
    wordContainer.appendChild(messageElement);

    findWordAudio.play();

};

const newButton = document.getElementById('newButton');
newButton.style.display = 'none';

const startGame = () => {
    usedLetters = [];
    mistakes = 0;
    hits = 0;
    wordContainer.innerHTML = '';
    usedLettersElement.innerHTML = '';
    cargarIconos();
    cargarIconos2();
    drawHangMan();
    selectNextWord(); // Utiliza la función selectNextWord en lugar de selectRandomWord
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

    newButton.style.display = 'block';

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
newButton.addEventListener('click', restartGame);

startButton.addEventListener('click', startGame);
