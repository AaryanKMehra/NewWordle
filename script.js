const board = document.getElementById('board');
const keyboard = document.getElementById('keyboard');
const scoreDisplay = document.getElementById('current-score');
const message = document.getElementById('message-container');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let currentAttempt = 0;
let currentTile = 0;
let targetWord = "";

// These are only the words the computer will pick for you to guess
const targetWords = ["DRAMA", "APPLE", "BEACH", "BRAIN", "BREAD", "CHEST", "CHORD", "CLICK", "CLOCK", "CLOUD", "DANCE", "DIARY", "DRINK", "EARTH", "FLUTE", "FRUIT", "GHOST", "GRAPE", "GREEN", "HEART", "HOUSE", "JUICE", "LIGHT", "LEMON", "MELON", "MONEY", "MUSIC", "NIGHT", "OCEAN", "PARTY", "PIANO", "PILOT", "PLANE", "PHONE", "PIZZA", "PLANT", "RADIO", "RIVER", "ROBOT", "SHIRT", "SHOES", "SMILE", "SNAKE", "SPACE", "SPOON", "STORM", "TABLE", "TIGER", "TOAST", "TOUCH", "TRAIN", "TRUCK", "VOICE", "WATER", "WATCH", "WHALE", "WORLD", "WRITE", "YOUTH", "ZEBRA"];

function initGame(isFullReset = false) {
    if (isFullReset) score = 0; 
    
    targetWord = targetWords[Math.floor(Math.random() * targetWords.length)];
    currentAttempt = 0;
    currentTile = 0;
    scoreDisplay.innerText = score;
    message.innerText = "";
    restartBtn.classList.add('hidden');
    
    board.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('id', `tile-${i}`);
        board.appendChild(tile);
    }
    
    setupKeyboard(); 
}

function setupKeyboard() {
    keyboard.innerHTML = '';
    const rows = [
        'QWERTYUIOP'.split(''),
        'ASDFGHJKL'.split(''),
        ['ENTER', ...'ZXCVBNM'.split(''), 'DEL']
    ];

    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('key-row');
        row.forEach(key => {
            const btn = document.createElement('button');
            btn.textContent = key;
            btn.classList.add('key');
            btn.setAttribute('id', `key-${key}`);
            if (key === 'ENTER' || key === 'DEL') btn.style.maxWidth = '65px';
            btn.onclick = () => handleInput(key);
            rowDiv.appendChild(btn);
        });
        keyboard.appendChild(rowDiv);
    });
}

function handleInput(key) {
    if (!restartBtn.classList.contains('hidden')) return;
    const currentIdx = (currentAttempt * 5) + currentTile;

    if (key === 'DEL' && currentTile > 0) {
        currentTile--;
        document.getElementById(`tile-${(currentAttempt * 5) + currentTile}`).textContent = '';
    } else if (key === 'ENTER') {
        if (currentTile === 5) {
            checkWord();
        } else {
            message.innerText = "TOO SHORT";
            setTimeout(() => { if(message.innerText === "TOO SHORT") message.innerText = ""; }, 2000);
        }
    } else if (currentTile < 5 && key.length === 1 && key !== 'ENTER') {
        const tile = document.getElementById(`tile-${currentIdx}`);
        tile.textContent = key.toUpperCase();
        currentTile++;
    }
}

function checkWord() {
    const startIdx = currentAttempt * 5;
    let guess = "";
    for(let i=0; i<5; i++) {
        guess += document.getElementById(`tile-${startIdx + i}`).textContent;
    }

    // DICTIONARY CHECK REMOVED: Every 5-letter combination is now accepted

    for (let i = 0; i < 5; i++) {
        const tile = document.getElementById(`tile-${startIdx + i}`);
        const letter = guess[i];
        const keyBtn = document.getElementById(`key-${letter}`);
        
        if (letter === targetWord[i]) {
            tile.classList.add('correct');
            keyBtn.classList.add('correct');
        } else if (targetWord.includes(letter)) {
            tile.classList.add('present');
            if (!keyBtn.classList.contains('correct')) keyBtn.classList.add('present');
        } else {
            tile.classList.add('absent');
            keyBtn.classList.add('absent');
        }
    }

    if (guess === targetWord) {
        score++;
        message.innerText = "SUCCESS!";
        setTimeout(() => initGame(false), 1500); 
    } else if (currentAttempt === 5) {
        message.innerText = `WORD: ${targetWord}`;
        restartBtn.classList.remove('hidden'); 
    } else {
        currentAttempt++;
        currentTile = 0;
    }
}

window.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();
    if (key === 'ENTER') handleInput('ENTER');
    else if (key === 'BACKSPACE') handleInput('DEL');
    else if (/^[A-Z]$/.test(key)) handleInput(key);
});

initGame();