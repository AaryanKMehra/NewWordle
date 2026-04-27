# Learning Log: Iteration 1

## What HTML structure did you choose?
I chose a modular container structure. I used a <header> for the title and score tracking, a <div> with an ID of board for the game tiles, and a <div> for the interactive keyboard. The board uses a CSS Grid with grid-template-columns: repeat(5, 1fr) to ensure the tiles align perfectly in five columns regardless of screen size.

## What did you keep and what did you change from the AI suggestions?
- **Kept:** I kept the logic of using JavaScript to dynamically generate the 30 tile divs. This keeps the HTML file clean and makes it easier to reset the board for "Infinite Mode".
- **Changed:** I completely overhauled the suggested color scheme. I replaced the standard Wordle colors (green/yellow) with a strictly black, white, and grey palette to match my minimalist design preference. I also adjusted the grid gaps to create a more spacious, modern feel.

## Why?
I made these changes to ensure the project felt like a professional product rather than just a replica of an existing game. Using JavaScript for the layout injection allows for the seamless "new word" transition required for the infinite scoring mechanic.