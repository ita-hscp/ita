---
category: HSCP 2
order: 3
title: Student Report
---

<script src="{{ site.baseurl }}/scripts/track.js">
    tracker();
</script>

<button id="loadReport" onclick="loadReport()">Load Report</button>

<div id="classReport">
<table id="jsonTable">
        <thead>
            <tr>
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
