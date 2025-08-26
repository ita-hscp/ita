---
category: HSCP 2
order: 2
title: கதை சொல்லுதல் பயிற்சி 
---
<script src="{{ site.baseurl }}/scripts/track.js"></script>
<script src="{{ site.baseurl }}/scripts/speech.js"></script>
<script src="{{ site.baseurl }}/scripts/taskHandler.js"></script>
<script>
  function setStoryImage(name){
   const image=  document.getElementById('imageplaceholder');
  image.innerHTML="<img id=\"storyImagePh\" src=\"{{ site.baseurl }}/images/"+name+"\" width=\"120\" height=\"120\">"
 }
</script>

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
            <button id="story-clear-btn" >clear</button>
            <button id="story-send-btn" onclick="sendMessage()" disabled>send</button>
            <audio id="audioPlayer" controls></audio>
        </div>
    </div>
    <div class="story-image" id="storyImage">
        <div>
            <p type="text" id="topicSelected"></p>
        </div>
         <div id="imageplaceholder" class="story-image">
         </div> 
    </div>
</div>
<button id="story-saveButton" disabled>Finish Conversation</button>
 <div class="story-spinner" id="story-spinner"></div>
<script src="{{ site.baseurl }}/scripts/story_v1.js"></script>
<script>
tracker();
</script>
<div id="tracker"></div>
