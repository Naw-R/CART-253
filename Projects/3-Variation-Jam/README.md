# **Emoji Word Guessing Game**

**Author**: Rowan Nasser  
[**View this project online**](URL_FOR_THE_RUNNING_PROJECT)

---

## **Description**

The Emoji Word Guessing Game challenges players to guess a phrase (e.g., a book title, movie title, etc.) within 60 seconds based on an emoji clue. Players type their guesses into an input field, receiving real-time feedback on their progress.

---

## **Objective**

The goal is to correctly guess the hidden phrase using the provided emoji clue. Players can type their guesses into the input field, and the game provides hints and visual feedback to assist them.

---

## **Game Setup and Rules**

### **1. Selecting a Theme**
- At the start of the game, players select a theme (e.g., Movie Titles, Book Titles).
- A random word/phrase is chosen from the selected theme.
- Words/phrases already used in the session will not repeat until all words in the theme have been played.

### **2. Game Display**
- **Emoji Clue**: An emoji representation of the phrase is displayed at the top of the screen (e.g., "📕✨" for *The Shining*).
- **Word Structure**:
  - Squares representing the number of letters in the phrase are displayed.
  - Visual gaps indicate spaces between words in multi-word phrases.
  - Correctly guessed letters appear in their respective squares.
- **Timer**: A countdown timer starts at 60 seconds.

### **3. Input and Feedback**
- Players type their guesses using the input field.
- **Real-Time Feedback**:
  - Correctly guessed letters immediately appear in their corresponding slots, and the square turns **green**.
  - Incorrect letters are ignored, and no penalties are applied.

### **4. Hints**
- After 30 seconds, the game automatically reveals a random unrevealed letter in the phrase.
- If the revealed letter appears multiple times, it is shown in all corresponding slots.

### **5. Win Condition**
- Players win the round if they guess the entire phrase before the timer expires.
- A success message is displayed, and the game transitions to the next word after a **5-second countdown**.

### **6. Lose Condition**
- If the timer runs out, the correct phrase is revealed to the player.
- A failure message is displayed, and the game transitions to the next word after a **5-second countdown**.

---

## **Credits**

This project was built using the following tools and resources:
- [p5.js](https://p5js.org) for canvas rendering and DOM manipulation.
- [Pippin Barr’s JSON Tutorial](https://pippinbarr.com/cart253/topics/data/json.html) for understanding JSON integration.

---

## **Attribution**

Special thanks to all contributing resources and tutorials that supported the development of this project.
