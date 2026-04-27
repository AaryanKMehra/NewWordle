# Learning Log: Iteration 2

### What was the hardest part of the game logic?
The hardest part was managing the logic for the "Infinite" mode. I had to create a conditional reset within my `initGame` function. If the player wins, the function is called with `false` to keep the score variable intact. If the player loses, the "Try Again" button triggers the function with `true`, resetting the score to zero. Ensuring the board cleared properly while maintaining the global score state required careful use of variables.

### What JavaScript concepts did you use?
- **Global vs Local Scope**: Used to keep track of the `score` and `currentAttempt`.
- **Event Listeners**: Added `window.addEventListener` for 'keydown' so the game works with both the on-screen and physical keyboard.
- **DOM Manipulation**: Used `document.createElement` to generate the board and `classList.add` to change tile colors based on the guess.
- **Conditionals and Loops**: Used `if/else` logic to check for correct, present, or absent letters.

### What did AI help you figure out?
The AI helped me structure the keyboard generation using a nested array (QWERTY layout), which made the code much cleaner than manually writing 26 button elements in HTML. It also helped me implement the `setTimeout` function so the player can actually see their final correct guess before the board clears for the next word.