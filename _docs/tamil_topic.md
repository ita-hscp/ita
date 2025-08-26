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
<div class="story-container">
    <button id="exercise-btn" onclick="getStoryExercise()">get exercise</button>
    <div id="topic-chat-container">
        <button id="exercise-start-btn" disabled>start exercise</button>
        <div id="chatBox"></div>
        <div id="userInput" contenteditable="true"></div>
        <button id="story-start-btn" disabled>record</button>
        <button id="story-clear-btn" >clear</button>
        <button id="story-send-btn" onclick="sendMessage()" disabled>send</button>
        <audio id="audioPlayer" controls></audio>
        <span id="topic-score">Score: 0</span>
    </div>
    <div id="topic-keywords-container">
        <h3>Key Words</h3>
        <ul id="topic-keywords-list">
            <!-- Key words will be dynamically inserted here -->
        </ul>
    </div>  
</div>

<button id="story-saveButton" disabled>Finish Conversation</button>
<div class="story-spinner" id="story-spinner"></div>
<script src="{{ site.baseurl }}/scripts/story_v1.js"></script>
<script>
tracker();
</script>
<div id="tracker"></div>
<script src="/scripts/topic_practice.js"></script>
