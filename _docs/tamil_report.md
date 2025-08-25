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
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
    </select>  

<label for="assignmentTypeFilter">Filter by Assignment Type:</label>
    <select id="assignmentTypeFilter">
        <option value="உரையாடல் பயிற்சி">உரையாடல் பயிற்சி</option>
        <option value="கதை சொல்லுதல் பயிற்சி">கதை சொல்லுதல் பயிற்சி</option>
        <option value="கேட்டல்‌ கருத்தறிதல் பயிற்சி">கேட்டல்‌ கருத்தறிதல் பயிற்சி</option>
        <option value="அனைத்து">அனைத்து</option>
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
