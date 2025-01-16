---
category: HSCP 3
order: 2
title: கதை சொல்லுதல் பயிற்சி 
---
<script src="{{ site.baseurl }}/scripts/track.js"></script>
<script src="{{ site.baseurl }}/scripts/speech.js"></script>

 <label for="weeks">Choose a week:</label>
    <select id="weeks">
    </select>
<button id="exercise-btn" onclick="getStoryExercise()">get exercise</button>
<div class="story-container">
    <div class="chat-container">  
        <button id="exercise-start-btn" disabled>start exercise</button>
        <div class="chat-box" id="chatBox">
        </div>
        <div><p type="text" id="userInput"></p> </div>
        <div class="input-area">
            <button id="story-start-btn" disabled>record</button>
            <button id="story-clear-btn" disabled>clear</button>
            <button id="story-send-btn" onclick="sendMessage()" disabled>send</button>
            <audio id="audioPlayer" controls></audio>
        </div>
    </div>
    <div class="story-image" id="storyImage">
        <div>
            <p type="text" id="topicSelected"></p>
        </div>
         <div id="imageplaceholder">
         </div> 
    </div>
</div>
<button id="story-saveButton" disabled>Finish Conversation</button>
 <div class="story-spinner" id="story-spinner"></div>
<script src="{{ site.baseurl }}/scripts/story.js"></script>
<script>
tracker();
 const image=  document.getElementById('imageplaceholder');
 image.innerHTML="<img src=\"{{ site.baseurl }}/images/story_18_10.png\" width=\"12\0" height=\"120\">"
</script>
<div id="tracker"></div>
