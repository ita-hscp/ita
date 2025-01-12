---
category: HSCP 3
order: 2
title: தமிழ் guess
---
<script src="{{ site.baseurl }}/scripts/track.js">
    tracker();
</script>

  <div class="game-container">
        <h1>Guess the Word!</h1>
        <div class="word-box">
            <div class="scrolling-container" id="scrollingContainer"></div>
        </div>
        <div class="input-container">
            <input type="text" id="userInput" placeholder="Enter your guess">
            <button onclick="checkGuess()">Submit</button>
        </div>
        <div class="input-container">
            <input type="text" id="newWord" placeholder="Add a new word">
            <button onclick="addNewWord()">Add Word</button>
        </div>
        <div class="input-container">
            <button onclick="clearWords()">Clear Words</button>
        </div>
        <div class="message" id="message"></div>
    </div>

---
<script src="{{ site.baseurl }}/scripts/guess.js">