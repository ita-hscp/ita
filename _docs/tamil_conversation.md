---
category: HSCP 1
order: 1
title: உரையாடல் பயிற்சி
---
<script src="{{ site.baseurl }}/scripts/track.js"></script>
<script src="{{ site.baseurl }}/scripts/speech.js"></script>

 <label for="weeks">Choose a week:</label>
    <select id="weeks">
         <option value="1">17</option>
         <option value="2">18</option>
          <option value="3">5</option>
    </select>
<button id="exercise-btn" onclick="getExercise()">start exercise</button>
<div>
    <p type="text" id="topicSelected"></p>
</div>
  <div class="chat-container">
    <div class="chat-box" id="chatBox">
    </div>
    <div><p type="text" id="userInput"></p> </div>
    <div class="input-area">
        <button id="conversation-start-btn" disabled>record</button>
        <button id="conversation-clear-btn" disabled>clear</button>
        <button id="conversation-send-btn" onclick="sendMessage()" disabled>send</button>
        <audio id="audioPlayer" controls></audio>
    </div>
  </div>
<button id="conversation-saveButton" disabled>Finish Conversation</button>
 <div class="conversation-spinner" id="conversation-spinner"></div>
<!-- <div id="progressContainer" style="display: none;">
        <progress id="progressBar" value="0" max="100"></progress>
        <span id="progressText">0%</span>
</div> -->
<script src="{{ site.baseurl }}/scripts/conversation.js"></script>
<script>
tracker();
</script>
<div id="tracker"></div>
