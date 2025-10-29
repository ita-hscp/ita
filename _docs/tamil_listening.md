---
category: HSCP 1
order: 1
title: கேட்டல்‌ கருத்தறிதல் பயிற்சி
---
<script src="{{ site.baseurl }}/scripts/track.js"></script>
<script src="{{ site.baseurl }}/scripts/speech.js"></script>

 <label for="weeks">Choose a exercise:</label>
    <select id="weeks">
    </select>
<button id="exercise-btn" onclick="getExercise()">start exercise</button>
<div>
    <p type="text" id="topicSelected"></p>
</div>
<div id="videoContainer" style="display: none;">
  <iframe width="560" height="315" src="" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
<div id="div-link"></div>
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
  <div>
<div>
  <button id="conversation-preview-btn" disabled>Preview Before upload</button>
  <div class="status" id="conversation-preview-status"></div>
  <button id="conversation-saveButton" disabled>Finish Conversation</button>
</div>
<button id="conversation-saveButton" disabled>Finish Conversation</button>
 <div class="conversation-spinner" id="conversation-spinner"></div>
<!-- <div id="progressContainer" style="display: none;">
        <progress id="progressBar" value="0" max="100"></progress>
        <span id="progressText">0%</span>
</div> -->
<script src="{{ site.baseurl }}/scripts/listen.js"></script>
<script>
tracker();
</script>
<div id="tracker"></div>
