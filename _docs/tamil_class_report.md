---
category: Teacher
order: 3
title: Class Report
---

<script src="{{ site.baseurl }}/scripts/track.js">
    tracker();
</script>

 <label for="weekFilter">Filter by Week:</label>
    <select id="weekFilter">
        <option value="17">17</option>
        <option value="18">18</option>
        <option value="20">20</option>
        <option value="21">21</option>
        <option value="22">22</option>
        <option value="23">23</option>
        <option value="24">24</option>
        <option value="25">25</option>
        <option value="26">26</option>
         <option value="27">27</option>
        <option value="28">28</option>
        <option value="29">29</option>
        <option value="30">30</option>
        <option value="31">31</option>
    </select>  

<label for="assignmentTypeFilter">Filter by Assignment Type:</label>
    <select id="assignmentTypeFilter">
        <option value="conversation">Conversation</option>
        <option value="storyTelling">Story</option>
         <option value="listen">Listening</option>
        <option value="all">All</option>
    </select>
    
<button id="loadReport" onclick="loadReport()">Load Report</button>
<button id="saveReport" onclick="saveReport()">Save Report</button>

<div id="classReport">
<table id="jsonTable">
        <thead>
            <tr>
                <th>ID</th>
                <th>Week</th>
                <th>Assignment Type</th>
                 <th>Status</th>
                <th>Score</th>
                <th>Comments</th>
                <th>Completion Date</th>
                <th>Audio</th>
                <th>Add Feedback</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
</table>
</div>

<!-- Modal Popup -->
<div id="feedbackModal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border: 1px solid #ccc; z-index: 1000;">
    <h3>Add Feedback</h3>
    <label>Score:</label>
    <input type="text" id="modalScore"><br><br>
    <label>Feedback:</label>
    <textarea id="modalComments"></textarea><br><br>
    <button id="submitFeedback">Submit</button>
    <button id="closeModal">Cancel</button>
</div>


<script src="{{ site.baseurl }}/scripts/class_report.js">
