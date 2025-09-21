---
category: Teacher
order: 3
title: Assignment 
---

<script src="{{ site.baseurl }}/scripts/track.js">tracker();</script>
  <div id="assignmentSection">
    <!-- Assignment form and list will be dynamically inserted here -->
    <form id="assignmentForm">
      <label for="week">Week:</label>
      <select id="week" name="week">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <label for="assignmentType">Assignment Type:</label>
      <select id="assignmentType" name="assignmentType">
        <option value="உரையாடல் பயிற்சி">உரையாடல் பயிற்சி</option>
        <option value="கதை சொல்லுதல் பயிற்சி">கதை சொல்லுதல் பயிற்சி</option>
        <option value="கேட்டல்‌ கருத்தறிதல் பயிற்சி">கேட்டல்‌ கருத்தறிதல் பயிற்சி</option>
        <option value="தலைப்பு பயிற்சி">தலைப்பு பயிற்சி</option>
      </select>
      <label for="exercise">Exercise:</label>
      <select id="exercise" name="exercise">
        <!-- Options will be dynamically populated based on assignment type -->
      </select>
      <button type="button" onclick="loadExercises()">Load Exercises</button>
      <button type="button" onclick="previewExercise()">Preview Exercise</button>
      <button type="button" onclick="createCustomExercise()">Create Custom Exercise</button>

      <div id="exercisePreview"></div>

      <div id="customExerciseSection" style="display:none;">
        <label for="customExerciseText">Custom Exercise Text:</label>
        <textarea id="customExerciseText" name="customExerciseText" rows="4"></textarea>
      </div>

      <label for="dueDate">Due Date:</label>
      <input type="date" id="dueDate" name="dueDate">

      <label for="instructions">Instructions:</label>
      <textarea id="instructions" name="instructions" rows="4"></textarea>

      <label for="status">Status:</label>
      <select id="status" name="status">
        <option value="assigned">assigned</option>
      </select>

      <button type="button" onclick="createAssignment()">Create Assignment</button>
    </form>
  </div>

<script src="{{ site.baseurl }}/scripts/assignment.js"></script>
<div id="tracker"></div>

<div id="customExerciseSection" style="display:none;">
    <h2>Create Custom Exercise</h2
    <select id="customExerciseType" name="customExerciseType">
        <option value="உரையாடல் பயிற்சி">உரையாடல் பயிற்சி</option>
        <option value="கதை சொல்லுதல் பயிற்சி">கதை சொல்லுதல் பயிற்சி</option>
        <option value="கேட்டல்‌ கருத்தறிதல் பயிற்சி">கேட்டல்‌ கருத்தறிதல் பயிற்சி</option>
        <option value="தலைப்பு பயிற்சி">தலைப்பு பயிற்சி</option>
    </select><br><br>
    <!-- if custom exercise type is dialogue practice, show these fields -->
    <div id="dialogueFields" style="display:none;">
       <label for="title">Title:</label><br>
         <input type="text" id="title" name="title"><br><br>
         <label for="questions">questions, press button to add more</label><br>
         <input type="text" id="questions" name="questions"><br><br>
         <button type="button" onclick="addQuestionField()">Add Question</button><br><br>
    </div>
    <!-- if custom exercise type is story telling practice, show these fields -->
    <div id="storyFields" style="display:none;">
       <label for="storyTitle">Story Title:</label><br>
         <input type="text" id="storyTitle" name="storyTitle"><br><br>
         <label for="storyPrompt">Story Prompt:</label><br>
         <textarea id="storyPrompt" name="storyPrompt" rows="4" cols="  50"></textarea><br><br>
    </div>
    <!-- if custom exercise type is listening comprehension practice, show these fields -->
    <div id="listeningFields" style="display:none;">
       <label for="listeningTitle">Listening Title:</label><br>
         <input type="text" id="listeningTitle" name="listeningTitle"><br><br>
         <label for="listeningAudioURL">YouTube Embed URL:</label><br>
         <input type="text" id="listeningAudioURL" name="listeningAudioURL"><br><br>
         <label for="listeningQuestions">questions, press button to add more</label><br>
         <button type="button" onclick="addListeningQuestionField()">Add Question</button><br><br>
    </div>
    <!-- if custom exercise type is topic practice, show these fields -->
    <div id="topicFields" style="display:none;">
       <label for="topicTitle">Topic Title:</label><br>
         <input type="text" id="topicTitle" name="topicTitle"><br><br>
         <label for="topicKeywords">keywords, press button to add more</label><br>
         <input type="text" id="topicKeywords" name="topicKeywords"><br><br>
         <button type="button" onclick="addTopicKeywordField()">Add Keyword</button><br><br>
    </div>
    <button type="button" onclick="createCustomExercise()">Create Custom Exercise</button>
</div>
