---
category: HSCP 1
order: 2
title: "தலைப்பு பயிற்சி"
---
<script src="{{ site.baseurl }}/scripts/track.js"></script>
<script src="{{ site.baseurl }}/scripts/speech.js"></script>
<script src="{{ site.baseurl }}/scripts/taskHandler.js"></script>
 <label for="weeks">Choose a week:</label>
    <select id="weeks">
    </select>
<button id="exercise-btn" onclick="getStoryExercise()">get exercise</button>

<div class="story-container">
    <div id="topic-chat-container">
        <div>
            <p type="text" id="topicSelected"></p>
        </div>
        <button id="exercise-start-btn" disabled>start exercise</button>
        <div id="chatBox"></div>
        <div id="userInputTopic">
            <canvas id="waveform" width="400" height="100"></canvas>
            <p type="text" id="timeRemaining"> Total Time Remaining: 5 minutes </p>
            <p type="text" id="timeRecorded"> Total Time Recorded: 0 seconds </p>
            <p type="text" id="topic-score"> Words used: 0</p>
        </div>
        <button id="story-start-btn" disabled>record</button>
        <button id="story-clear-btn" >clear</button>
        <button id="story-send-btn" disabled>save</button>
        <audio id="audioPlayer" controls></audio>
    </div>
    <div id="topic-keywords-container">
    <!-- Key words will be dynamically inserted here. Show in a text box -->
        <p>முக்கிய சொற்கள்</p>
        <ul id="topic-keywords-list">
        </ul>
    </div>  
</div>

<button id="story-saveButton" disabled>Finish Conversation</button>
<div class="story-spinner" id="story-spinner"></div>
<script>
tracker();
</script>
<div id="tracker"></div>
<script src="{{ site.baseurl }}/scripts/topic_practice.js"></script>
