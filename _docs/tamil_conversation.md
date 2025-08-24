---
category: HSCP 1
order: 1
title: உரையாடல் பயிற்சி
---
<script src="{{ site.baseurl }}/scripts/track.js"></script>
<script src="{{ site.baseurl }}/scripts/speech_new.js"></script>
<script src="{{ site.baseurl }}/scripts/taskHandler.js"></script>

 <label for="weeks">Choose a week:</label>
    <select id="weeks">
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
<button id="conversation-preview-btn" disabled>Preview Before upload</button>
<div class="status" id="conversation-preview-status"></div>
<button id="conversation-saveButton" disabled>Finish Conversation</button>
<div>
        <audio id="audio-player" controls style="width: 100%; margin-top: 20px; display: none;"></audio>
</div>
 <div class="conversation-spinner" id="conversation-spinner"></div>
<!-- <div id="progressContainer" style="display: none;">
        <progress id="progressBar" value="0" max="100"></progress>
        <span id="progressText">0%</span>
</div> -->
<script src="{{ site.baseurl }}/scripts/conversation_v1.js"></script>
<script>
tracker();
</script>
<div id="tracker"></div>
