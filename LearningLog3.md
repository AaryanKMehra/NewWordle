# Learning Log: Iteration 3

### What feedback did your playtester give?
Playtesters really liked the core gameplay but mentioned that the game felt a bit jarring when it automatically restarted. They wanted more control over the pacing. Several also requested a "Dark Mode" to reduce eye strain, as that's a standard feature in modern web apps. 

### What bugs did you find?
The biggest challenge was moving away from the hardcoded word arrays. When I first implemented a live API to fetch random words, the free server would often "sleep," causing the game to hang infinitely on the "LOADING NEW WORD..." screen. I also encountered a state bug where if a user typed too fast while the tiles were still animating, the JavaScript would lose track of the grid and permanently lock the keyboard.

### How did you fix it?
To fix the API hanging issue, I swapped out the unreliable random word generator for the `Datamuse API`, which is much faster and incredibly stable. To fix the keyboard lockout, I implemented an `isAnimating` boolean "lock" in the JavaScript. This temporarily disables the event listeners while the `fetch` promises are resolving or the CSS animations are playing, unlocking only when it's safe for the user to type again.

### What's the difference between "it works" and "it's fun to play"?
"It works" is having a basic HTML button at the bottom of the screen that resets the board. "It's fun to play" is replacing that button with a premium, frosted-glass modal popup that slides in to congratulate the player and show their streak. Adding the Light/Dark mode toggle and giving the user a "Next Word" button to control their own pacing transformed this from a functional coding assignment into a polished, professional-feeling application.