---
category: விளையாட்டு
order: 2
title: தமிழ் வார்த்தையை கண்டுபிடி
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
            <div><p type="text" id="userInput"></p> </div>
            <div class="input-area">
                <button id="conversation-start-btn" disabled>record</button>
                <button id="conversation-clear-btn" disabled>clear</button>
                <button id="conversation-send-btn" onclick="sendMessage()" disabled>submit</button>
                <button id="conversation-add-btn" onclick="addword()" disabled>add</button>
                <audio id="audioPlayer" controls></audio>
            </div>
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