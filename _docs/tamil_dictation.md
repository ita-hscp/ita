---
category: HSCP 1
order: 1
title: தமிழ் quiz
---
<script src="{{ site.baseurl }}/scripts/track.js">
    tracker();
</script>
<h1>Tamil-English Quiz</h1>
<button class="quiz start-button" id="quiz-start" onclick="start(this)">start</button>
<div class="question-box">
    <div class="question" id="question"></div>
     <div class="letter-box" id="letterBox"></div>
    <textarea class="input-box" id="textInput" rows="3"></textarea>
    <button class="clear-button" onclick="clearInput()">Clear</button>
    <button onclick="checkAnswer()">Submit</button>
</div>

<div class="result" id="result"></div>


<script src="{{ site.baseurl }}/scripts/dictation.js"></script>
