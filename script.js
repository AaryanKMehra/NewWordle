const board = document.getElementById('board');
const keyboard = document.getElementById('keyboard');
const scoreDisplay = document.getElementById('current-score');
const message = document.getElementById('message-container');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let currentAttempt = 0;
let currentTile = 0;
let targetWord = "";
const wordList = ["SMART", "BUILD", "CLEAN", "LOGIC", "START", "PLATE", "FOUND", "BRICK", "TRADE"];

function initGame(isFullReset = false) {
    if (isFullReset) score = 0;
    
    // Reset state
    targetWord = wordList[Math.floor(Math.random() * wordList.length)];
    currentAttempt = 0;
    currentTile = 0;
    scoreDisplay.innerText = score;
    message.innerText = "";
    restartBtn.classList.add('hidden');
    
    // Clear and build board
    board.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('id', `tile-${i}`);
        board.appendChild(tile);
    }
    
    // Build keyboard only once
    if (keyboard.innerHTML === '') setupKeyboard();
}

function setupKeyboard() {
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
            if (key === 'ENTER' || key === 'DEL') btn.style.maxWidth = '65px';
            btn.onclick = () => handleInput(key);
            rowDiv.appendChild(btn);
        });
        keyboard.appendChild(rowDiv);
    });
}

function handleInput(key) {
    if (restartBtn.classList.contains('hidden') === false) return;

    const currentIdx = (currentAttempt * 5) + currentTile;

    if (key === 'DEL' && currentTile > 0) {
        currentTile--;
        document.getElementById(`tile-${(currentAttempt * 5) + currentTile}`).textContent = '';
    } else if (key === 'ENTER' && currentTile === 5) {
        checkWord();
    } else if (currentTile < 5 && key.length === 1 && key !== 'ENTER') {
        const tile = document.getElementById(`tile-${currentIdx}`);
        tile.textContent = key;
        currentTile++;
    }
}

function checkWord() {
    const startIdx = currentAttempt * 5;
    let guess = "";
    for(let i=0; i<5; i++) {
        guess += document.getElementById(`tile-${startIdx + i}`).textContent;
    }

    // Apply colors
    for (let i = 0; i < 5; i++) {
        const tile = document.getElementById(`tile-${startIdx + i}`);
        const letter = guess[i];
        
        if (letter === targetWord[i]) {
            tile.classList.add('correct');
        } else if (targetWord.includes(letter)) {
            tile.classList.add('present');
        } else {
            tile.classList.add('absent');
        }
    }

    if (guess === targetWord) {
        score++;
        message.innerText = "EXCELLENT";
        setTimeout(() => initGame(false), 1500); // New word, keep score
    } else if (currentAttempt === 5) {
        message.innerText = `WORD WAS: ${targetWord}`;
        restartBtn.classList.remove('hidden'); // Lose state, score will reset on click
    } else {
        currentAttempt++;
        currentTile = 0;
    }
}

initGame();