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
    </select>  

<label for="assignmentTypeFilter">Filter by Assignment Type:</label>
    <select id="assignmentTypeFilter">
        <option value="உரையாடல் பயிற்சி">உரையாடல் பயிற்சி</option>
        <option value="கதை சொல்லுதல் பயிற்சி">கதை சொல்லுதல் பயிற்சி</option>
        <option value="கேட்டல்‌ கருத்தறிதல் பயிற்சி">கேட்டல்‌ கருத்தறிதல் பயிற்சி</option>
        <option value="தலைப்பு பயிற்சி">தலைப்பு பயிற்சி</option>
        <option value="அனைத்து">அனைத்து</option>
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
    <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
        <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onclick="closeModal()">&times;</button>
        <div class="mb-4 flex gap-4">
        <button id="playBtn-modal" class="bg-green-500 text-white px-4 py-2 rounded" onclick="playButtonListener()">Play</button>
        <button id="stopBtn-modal" class="bg-red-500 text-white px-4 py-2 rounded" onclick="stopAudio()">Stop</button>
        </div>
        <div class="status" id="status"></div>
        <div class="reportchat-container border rounded p-3 max-h-60 overflow-y-auto bg-gray-100" id="reportChatContainer">
        <div class="chat-box" id="chatBox">
        </div>
        </div>
    </div>
    <div class="feedbackDiv">
    <!-- <h3>Add Feedback</h3> -->
    <label>Score:</label>
    <input type="text" id="modalScore"><br><br>
    <label>Feedback:</label>
    <textarea id="modalComments" class="transliterate"></textarea><br><br>
    <button id="submitFeedback">Submit</button>
    <button id="closeModal">Cancel</button>
    </div>
</div>




<script src="{{ site.baseurl }}/scripts/class_report.js">
