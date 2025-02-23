---
category: Teacher
order: 3
title: Student Report
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
        <option value="All">All</option>
    </select>  

<label for="assignmentTypeFilter">Filter by Assignment Type:</label>
    <select id="assignmentTypeFilter">
        <option value="conversation">Conversation</option>
        <option value="story">Story</option>
         <option value="listen">Listening</option>
        <option value="all">All</option>
    </select>
    
<button id="loadReport" onclick="loadReport()">Load Report</button>

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
                <th>Due Date</th>
                <th>Audio</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
</table>
</div>

<script src="{{ site.baseurl }}/scripts/student_report.js">
