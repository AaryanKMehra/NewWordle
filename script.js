const board = document.getElementById('board');
const keyboard = document.getElementById('keyboard');
const scoreDisplay = document.getElementById('current-score');
const message = document.getElementById('message-container');
const themeToggleBtn = document.getElementById('theme-toggle');

// Modal Elements
const endModal = document.getElementById('end-modal');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalScore = document.getElementById('modal-score');
const modalBtn = document.getElementById('modal-btn');

let score = 0;
let currentAttempt = 0;
let currentTile = 0;
let targetWord = "";
let isAnimating = true; 

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggleBtn.innerText = "☀️ Light Mode";
    } else {
        themeToggleBtn.innerText = "🌙 Dark Mode";
    }
});

// Fetch words from the highly stable Datamuse API
async function initGame(isFullReset = false) {
    if (isFullReset) {
        score = 0; 
    }
    
    isAnimating = true; 
    message.innerText = "LOADING NEW WORD...";
    endModal.classList.add('hidden'); 
    
    try {
        // Datamuse query: sp=????? means "spelled with exactly 5 letters", max=500 gets 500 results
        const response = await fetch('https://api.datamuse.com/words?sp=?????&max=500');
        if (!response.ok) throw new Error("API failed");
        
        const data = await response.json();
        
        // Pick a random word from the 500 returned
        const randomItem = data[Math.floor(Math.random() * data.length)];
        targetWord = randomItem.word.toUpperCase();
        
        console.log("Target Word (Cheat Code):", targetWord);
    } catch (error) {
        console.error("API Error:", error);
        message.innerText = "NETWORK ERROR. REFRESH PAGE.";
        return; // Halts the game completely if API fails
    }

    currentAttempt = 0;
    currentTile = 0;
    scoreDisplay.innerText = score;
    message.innerText = "";
    
    board.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('id', `tile-${i}`);
        board.appendChild(tile);
    }
    
    setupKeyboard(); 
    isAnimating = false; 
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
            if (key === 'ENTER' || key === 'DEL') btn.classList.add('wide');
            btn.onclick = () => handleInput(key);
            rowDiv.appendChild(btn);
        });
        keyboard.appendChild(rowDiv);
    });
}

function handleInput(key) {
    if (!endModal.classList.contains('hidden') || isAnimating) return;
    
    const currentIdx = (currentAttempt * 5) + currentTile;

    if (key === 'DEL' && currentTile > 0) {
        currentTile--;
        document.getElementById(`tile-${(currentAttempt * 5) + currentTile}`).textContent = '';
    } else if (key === 'ENTER') {
        if (currentTile === 5) checkWordWithAPI();
        else showTempMessage("TOO SHORT");
    } else if (currentTile < 5 && key.length === 1 && key !== 'ENTER') {
        const tile = document.getElementById(`tile-${currentIdx}`);
        tile.textContent = key.toUpperCase();
        
        tile.classList.add('pop');
        setTimeout(() => tile.classList.remove('pop'), 150);
        
        currentTile++;
    }
}

function showTempMessage(txt) {
    message.innerText = txt;
    setTimeout(() => { if(message.innerText === txt) message.innerText = ""; }, 2000);
}

async function checkWordWithAPI() {
    const startIdx = currentAttempt * 5;
    let guess = [];
    for(let i=0; i<5; i++) {
        guess.push(document.getElementById(`tile-${startIdx + i}`).textContent);
    }
    const guessStr = guess.join('');

    isAnimating = true; 
    message.innerText = "CHECKING...";

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${guessStr}`);
        
        if (!response.ok) {
            showTempMessage("NOT IN WORD LIST");
            isAnimating = false; 
            return;
        }
        
        message.innerText = "";
        processColors(guess, guessStr, startIdx);

    } catch (error) {
        showTempMessage("CONNECTION ERROR");
        isAnimating = false;
    }
}

function processColors(guess, guessStr, startIdx) {
    const targetArr = targetWord.split('');
    const result = new Array(5).fill('absent');
    const letterCount = {};

    for (let letter of targetArr) {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    for (let i = 0; i < 5; i++) {
        if (guess[i] === targetArr[i]) {
            result[i] = 'correct';
            letterCount[guess[i]]--; 
        }
    }

    for (let i = 0; i < 5; i++) {
        if (result[i] !== 'correct') {
            if (targetArr.includes(guess[i]) && letterCount[guess[i]] > 0) {
                result[i] = 'present';
                letterCount[guess[i]]--; 
            }
        }
    }

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const tile = document.getElementById(`tile-${startIdx + i}`);
            const keyBtn = document.getElementById(`key-${guess[i]}`);
            
            tile.classList.add('flip');
            setTimeout(() => {
                tile.classList.remove('flip');
                tile.classList.add(result[i]);
            }, 150);
            
            if (!keyBtn.classList.contains('correct')) {
                if (result[i] === 'correct' || !keyBtn.classList.contains('present')) {
                    keyBtn.classList.add(result[i]);
                }
            }
        }, i * 200); 
    }

    // Modal Trigger Logic
    setTimeout(() => {
        if (guessStr === targetWord) {
            score++; 
            scoreDisplay.innerText = score; 
            
            modalTitle.innerText = "EXCELLENT!";
            modalTitle.style.color = "var(--correct)";
            modalSubtitle.innerText = `You found the word in ${currentAttempt + 1} guesses.`;
            modalScore.innerText = score;
            modalBtn.innerText = "NEXT WORD";
            modalBtn.onclick = () => initGame(false); 
            
            endModal.classList.remove('hidden');
            isAnimating = false; 
            
        } else if (currentAttempt === 5) {
            modalTitle.innerText = "GAME OVER";
            modalTitle.style.color = "var(--text-color)";
            modalSubtitle.innerText = `The word was ${targetWord}`;
            modalScore.innerText = score;
            modalBtn.innerText = "TRY AGAIN";
            modalBtn.onclick = () => initGame(true); 
            
            endModal.classList.remove('hidden');
            isAnimating = false; 
            
        } else {
            currentAttempt++;
            currentTile = 0;
            isAnimating = false; 
        }
    }, 5 * 200 + 400); 
}

window.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();
    if (key === 'ENTER') handleInput('ENTER');
    else if (key === 'BACKSPACE') handleInput('DEL');
    else if (/^[A-Z]$/.test(key)) handleInput(key);
});

initGame();