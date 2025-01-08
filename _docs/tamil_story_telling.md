---
category: HSCP 3
order: 2
title: கதை சொல்லுதல் பயிற்சி 
---
<script src="{{ site.baseurl }}/scripts/track.js"></script>
<script src="{{ site.baseurl }}/scripts/speech.js"></script>

 <label for="weeks">Choose a week:</label>
    <select id="weeks">
         <option value="1">17</option>
    </select>
<button id="exercise-btn" onclick="getStoryExercise()">start exercise</button>
<div>
    <p type="text" id="topicSelected"></p>
</div>
<div class="storyImage" id="storyImage"></div>
  <div class="chat-container">
    <div class="chat-box" id="chatBox">
    </div>
    <div><p type="text" id="userInput"></p> </div>
    <div class="input-area">
        <button id="story-start-btn" disabled>record</button>
        <button id="story-clear-btn" >clear</button>
        <button id="story-send-btn" onclick="sendMessage()" disabled>send</button>
        <audio id="audioPlayer" controls></audio>
    </div>
  </div>
<button id="story-saveButton" disabled>Finish Conversation</button>
 <div class="story-spinner" id="'story-spinner"></div>
<!-- <div id="progressContainer" style="display: none;">
        <progress id="progressBar" value="0" max="100"></progress>
        <span id="progressText">0%</span>
</div> -->
<script src="{{ site.baseurl }}/scripts/story.js"></script>
<script>
tracker();
</script>
<div id="tracker"></div>
