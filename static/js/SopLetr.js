const words = ['HOLA', 'ADIOS', 'GRACIAS', 'AMIGO', 'AYUDA', 'FAMILIA', 'COMER', 'BEBER', 'JUGAR', 'APRENDER'];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateGameBoard(words) {
    const gameContainer = document.getElementById('game-container');
    shuffleArray(words);

    words.forEach((word) => {
        const wordDiv = document.createElement('div');
        wordDiv.classList.add('word');

        for (let i = 0; i < word.length; i++) {
            const letterImg = document.createElement('img');
            letterImg.src = `imgsSeñas/${word[i].toLowerCase()}.png`; // Asegúrate de tener imágenes en la carpeta 'images'
            letterImg.alt = word[i];
            letterImg.addEventListener('click', () => selectLetter(letterImg));
            wordDiv.appendChild(letterImg);
        }

        gameContainer.appendChild(wordDiv);
    });
}

function generateWordList(words) {
    const wordListContainer = document.getElementById('words');

    words.forEach((word) => {
        const listItem = document.createElement('li');
        listItem.textContent = word;
        wordListContainer.appendChild(listItem);
    });
}

function selectLetter(letterImg) {
    letterImg.classList.add('selected');
    checkWordCompletion();
}

function checkWordCompletion() {
    const wordsList = document.getElementById('words');
    const wordContainers = document.querySelectorAll('.word');

    wordContainers.forEach((wordContainer) => {
        const letters = wordContainer.querySelectorAll('.selected');
        if (letters.length === wordContainer.children.length) {
            const word = wordContainer.textContent.trim();
            markWordAsCompleted(word);
        }
    });
}

function markWordAsCompleted(word) {
    const wordsList = document.getElementById('words');
    const wordItems = wordsList.children;

    for (let i = 0; i < wordItems.length; i++) {
        if (wordItems[i].textContent === word) {
            const checkIcon = document.createElement('span');
            checkIcon.classList.add('check');
            checkIcon.textContent = '✓';
            wordItems[i].appendChild(checkIcon);
            break;
        }
    }
}

generateGameBoard(words);
generateWordList(words);
