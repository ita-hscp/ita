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
        <label for="class">Class:</label>
        <select id="class" name="class">
            <option value="HSCP1">HSCP1</option>
            <option value="HSCP2">HSCP2</option>
            <option value="HSCP3">HSCP3</option>
            <option value="HSCP4">HSCP4</option>
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
        <button type="button" onclick="showCustomExercise()">Create Custom Exercise</button>
        <div id="exercisePreview">
            <div id="customExerciseSection" style="display:none;">
                <h2>Create Custom Exercise</h2>
                <label for="title">Title:</label><br>
                <input type="text" id="title" name="title"><br><br>
                <label for="description">Description:</label><br>
                <textarea id="description" name="description" rows="4" cols="50"></textarea><br><br>
            <!-- Dialogue practice fields -->
                <div id="dialogueFields" style="display:none;">
                    <label for="intro">Introduction (optional):</label><br>
                    <textarea id="intro" name="intro" rows="4" cols="50"></textarea><br><br>
                    <input type=text id="questions" name="questions" placeholder="Enter a question"><button type="button" onclick="addQuestionField()">+</button><br><br>
                </div>
                <!-- Storytelling practice fields -->
                <div id="storyFields" style="display:none;">
                    <label for="storyTitle">Story Title:</label><br>
                    <input type="text" id="storyTitle" name="storyTitle"><br><br>
                    <label for="storyPrompt">Story Prompt:</label><br>
                    <textarea id="storyPrompt" name="storyPrompt" rows="4" cols="50"></textarea><br><br>
                </div>
                <!-- Listening comprehension practice fields -->
                <div id="listeningFields" style="display:none;">
                    <label for="listeningAudioURL">YouTube Embed URL:</label><br>
                    <input type="text" id="listeningAudioURL" name="listeningAudioURL"><br><br>
                    <input type=text id="questions" name="listeningQuestions" placeholder="Enter a question"><button type="button" onclick="addListeningQuestionField()">+</button><br><br>
                </div>
                <!-- Topic practice fields -->
                <div id="topicFields" style="display:none;">
                    <input type=text id="keyword" name="keywords" placeholder="Enter keyword"><button type="button" onclick="addTopicQuestionField()">+</button><br><br>
                </div>
                <button type="button" onclick="saveCustomExercise()">Create Custom Exercise</button>
            </div>
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


<div id="tracker"></div>
<script src="{{ site.baseurl }}/scripts/assignment.js"></script>
