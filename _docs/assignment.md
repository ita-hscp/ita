---
category: Teacher
order: 3
title: Assignment Handling
---

<script src="{{ site.baseurl }}/scripts/track.js">tracker();</script>

<h1>Assignment Handling</h1>
<p>This section is under development. Please check back later for updates.</p>

/* Show a Form to create and assign assignments to students */
/* Show a list of assignments with options to edit, delete, and view submissions */
/* Allow filtering assignments by week, type, and status */
<!-- Future implementation will go here -->
<div id="tracker"></div>
<script src="{{ site.baseurl }}/scripts/assignment.js"></script>

<div id="AssignmentSection">
    <!-- Assignment form and list will be dynamically inserted here -->
    <form id="AssignmentForm">
        <label for="week">Week:</label>
        <select id="week" name="week">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select><br><br>
        <label for="assignmentType">Assignment Type:</label>
        <select id="assignmentType" name="assignmentType">
            <option value="உரையாடல் பயிற்சி">உரையாடல் பயிற்சி</option>
            <option value="கதை சொல்லுதல் பயிற்சி">கதை சொல்லுதல் பயிற்சி</option>
            <option value="கேட்டல்‌ கருத்தறிதல் பயிற்சி">கேட்டல்‌ கருத்தறிதல் பயிற்சி</option>
            <option value="தலைப்பு பயிற்சி">தலைப்பு பயிற்சி</option>
        </select><br><br>
        <label for="exercise">exercise:</label>
        <select id="exercise" name="exercise">
            <!-- Options will be dynamically populated based on assignment type -->
        </select><br><br>
        <label for="dueDate">Due Date:</label>
        <input type="date" id="dueDate" name="dueDate"><br><br>
        <label for="instructions">Instructions:</label><br>
        <textarea id="instructions" name="instructions" rows="4" cols="50"></textarea><br><br>
        <label for="status">Status:</label>
        <select id="status" name="status">
            <option value="Assigned">Assigned</option>
        </select><br><br>
        <button type="button" onclick="createAssignment()">Create Assignment</button>
    </form>
    <div id="AssignmentList">
        <!-- List of assignments will be dynamically inserted here -->
    </div>
</div>