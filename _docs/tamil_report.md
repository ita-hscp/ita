---
category: HSCP 1
order: 3
title: Student Report
---

<script src="{{ site.baseurl }}/scripts/track.js">
    tracker();
</script>
<br>
In Progress
<br>

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
