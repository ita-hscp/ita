
const modal = document.getElementById("feedbackModal");
const modalScore = document.getElementById("modalScore");
const modalComments = document.getElementById("modalComments");
const submitFeedbackBtn = document.getElementById("submitFeedback");
const closeModalBtn = document.getElementById("closeModal");
let isPlaying = false;
let audioContext = null;
let playButton = null;
let audioQueue = [];
const audioMap = new Map();
let selectedIndex = null;
let assignmentType =null
const tableBody = document.querySelector("#jsonTable tbody");
window.onload = function () {
    const weekFilter = document.getElementById("weekFilter");
    // Populate week filter options dynamically
    for (let i = 1; i <= 40; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        weekFilter.appendChild(option);
    }
}

async function getClassReport(reportQuery) {
    const apiUrl = 'https://infinite-sands-52519-06605f47cb30.herokuapp.com/assignment/report';
    // Fetch the json
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': sessionStorage.getItem('sessionToken'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportQuery)
    });
    if (response.status === 401) {
        // Redirect to login page if not authenticated
        window.location.href = "https://ita-hscp.github.io/ita/Login"; // Replace '/login' with your actual login URL
        return;
    }
    if (!response.ok) {
        return {}
    }
    return response.json()
}
let sampleData = [];


async function loadReport() {
    const query = {
    }
    const weekElement = document.getElementById("weekFilter");
    query['week'] = weekElement.options[weekElement.selectedIndex].value;
    const assignmentTypeFilter = document.getElementById("assignmentTypeFilter")
    query['assignmentType'] = assignmentTypeFilter.options[assignmentTypeFilter.selectedIndex].value;
    assignmentType = query['assignmentType'];
    const jsonData = await getClassReport(query);
    if (jsonData?.report) {
        sampleData = jsonData.report;
        renderTableRows(jsonData.report)
        addAudio(jsonData.report, query);
    }
};

function renderTableRows(data) {
    const tableBody = document.querySelector("#jsonTable tbody");
    tableBody.innerHTML = "";
    data.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.userName}</td>
            <td>${item.week}</td>
            <td>${item.assignmentType?item.assignmentType:assignmentType}</td>
            <td>${item.status}</td>
            <td class="score">${item.score}</td>
            <td class="comments">${item.comments}</td>
            <td>${item.completionDate}</td>
            <td><button class="play-btn" id="${item.userId}" data-id="${item.fileId}" data-task="${item.id}" data-index="${index}">▶ Play</button></td>
            <td><button class="feedback-btn" data-index="${index}">Feedback</button></td>
        `;
        tableBody.appendChild(row);
    });
}

async function addAudio(reportData, query) {
    document.querySelectorAll(".play-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const audioId = this.getAttribute("data-id");
            const index = this.getAttribute("data-index");
            let audioListJson = audioMap.get(audioId);
            if (!audioListJson) {
                const item = reportData.filter(item => item.fileId == audioId)[0]
                item['assignmentType'] = item['assignmentType'] || assignmentType;
                const response = await getAudioFromBackEnd(item);
                if (response.redirect) {
                    window.location.href = response.url;
                    return;
                }
                if (response.audioFound) {
                    audioListJson = response.audioJson;
                    audioMap.set(audioId, audioListJson);
                    showModal(index);
                }

            }

            if (audioListJson) {
                audioData = audioListJson;

            } else {
                alert("No audio found for this entry.");
            }
        });
    });
}

async function getAudioFromBackEnd(item) {
    try {
        // Fetch the audio file based on item.id
        const response = await fetch(`https://infinite-sands-52519-06605f47cb30.herokuapp.com/assignment/audio`,
            {
                method: 'POST',
                headers: {
                    'Authorization': sessionStorage.getItem('sessionToken'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            }
        );
        if (response.status === 401) {
            // Redirect to login page if not authenticated
            // window.location.href =  // Replace '/login' with your actual login URL
            return { redirect: true, url: "https://ita-hscp.github.io/ita/Login" };
        }

        /* The line `audioMap.set(audioId, audio);` is adding a key-value pair to a Map data structure named
        `audioMap`. In this case, it is associating the `audioId` as the key and the `audio` object as the
        corresponding value in the map. This allows for easy retrieval and storage of audio objects based on
        their unique `audioId`. */

        //blob has audio json from backend {id: "bot-1", botBlob: "base64-encoded-audio-data-1"}
        //Decode base64 audio data

        const blob = await response.blob();
        if (blob) {
            const text = await blob.text();
            const audioJson = await JSON.parse(text);
            audioMap.set(item.fileId, audioJson);
            return { audioFound: true, audioJson: audioJson, redirect: false };
        }

    } catch (error) {
        console.error("Error fetching audio file:", error);
    }
    return { audioFound: false, redirect: false };
}

async function saveReport() {
    const tableBody = document.querySelector("#jsonTable tbody");
    const rows = tableBody.querySelectorAll("tr");
    const report = [];
    rows.forEach((row, index) => {
        const cells = row.querySelectorAll("td");
        const item = {
            id: sampleData[index].id,
            userId: cells[0].textContent,
            week: cells[1].textContent,
            score: cells[4].textContent,
            comments: cells[5].textContent,

        };
        report.push(item);
    });
    const query = {
        "className": "HSCP2B",
        "report": report
    }
    const response = await fetch('https://infinite-sands-52519-06605f47cb30.herokuapp.com/assignment/save', {
        method: 'POST',
        headers: {
            'Authorization': sessionStorage.getItem('sessionToken'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    });
    if (response.status === 401) {
        // Redirect to login page if not authenticated
        window.location.href = "https://ita-hscp.github.io/ita/Login"; // Replace '/login' with your actual login URL
        return;
    }
    if (response.ok) {
        alert("Report saved successfully");
    } else {
        alert("Error saving report");
    }
}



// Show Modal
function showModal(index) {
    stopAudio();
    selectedIndex = index
    const item = sampleData[index];
    chatContainer = document.getElementById('reportChatContainer');
    // show array of chat messages
    // item.content is array of chat messages ["user message", "bot message", ...]
    // Show bot messages in italic and user messages in normal font. Bot messages align left and user messages align right.
    // There is no "user:" or "bot:" prefix in the messages. They are alternative messages.
    // change colors based on user and bot
    // make text scroll to bottom
    chatContainer.style.height= "400px";
    chatContainer.style.overflowY = "scroll";
    chatContainer.innerHTML = item.content && item.content.length > 0 ? item.content.map((msg, i) => `<div style="text-align: ${i % 2 === 0 ? 'left' : 'right'}; font-style: ${i % 2 === 0 ? 'normal' : 'italic'}; color: ${i % 2 === 0 ? '#e3102d' : '#0d0de7'};">${msg}</div>`).join("") : "";
    modalScore.value = item.score || "";
    modalComments.value = item.comments || "";
    modal.style.display = "block";
}

// Close Modal
function closeModal() {
    stopAudio();
    modal.style.display = "none";
    modalScore.value = "";
    modalComments.value = "";
}

// Handle Feedback Button Click
tableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("feedback-btn")) {
        const index = event.target.getAttribute("data-index");
        showModal(index);
    }
});

// Submit Feedback
submitFeedbackBtn.addEventListener("click", function () {
    if (selectedIndex !== null) {
        sampleData[selectedIndex].score = modalScore.value;
        sampleData[selectedIndex].comments = modalComments.value;
        renderTableRows(sampleData);
        addAudio(sampleData);
        closeModal();
    }
});

// Close Modal on Button Click
closeModalBtn.addEventListener("click", closeModal);


// Validate JSON format
function validateJsonFormat(data) {
    if (!Array.isArray(data)) {
        return false;
    }

    for (const segment of data) {
        if (!segment.botBlob && !segment.userBlob) {
            return false;
        }
    }

    return true;
}
// ---- Audio player: play / pause / stop / seek over the whole conversation ----
// All segments (bot, then user, per turn) are decoded once and treated as one
// continuous timeline so the seek bar can jump to any point.
const player = {
    data: null,        // audioData the buffers were decoded from
    buffers: [],       // AudioBuffer per segment
    offsets: [],       // start time (s) of each segment on the timeline
    total: 0,          // total duration (s)
    source: null,      // currently playing AudioBufferSourceNode
    segIndex: 0,       // segment currently playing
    segStartCtx: 0,    // audioContext.currentTime when current segment started
    segOffset: 0,      // offset (s) inside the current segment where it started
    pausedPos: 0,      // timeline position (s) when not playing
    token: 0,          // bumps on every stop/seek so stale onended calls are ignored
    loading: false,
    dragging: false,
    timer: null
};

function setAudioStatus(text) {
    const el = document.getElementById('status');
    if (el) el.textContent = text;
}

function formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds || 0));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function base64ToArrayBuffer(base64Data) {
    const base64String = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function decodeBuffer(arrayBuffer) {
    return new Promise((resolve, reject) => {
        const result = audioContext.decodeAudioData(arrayBuffer, resolve, reject);
        if (result && typeof result.then === 'function') {
            result.then(resolve, reject);
        }
    });
}

function currentPosition() {
    if (!player.source) return player.pausedPos;
    const pos = player.offsets[player.segIndex] + player.segOffset +
        (audioContext.currentTime - player.segStartCtx);
    return Math.min(pos, player.total);
}

function updateAudioUI() {
    const playBtn = document.getElementById('playBtn-modal');
    const seek = document.getElementById('audioSeek');
    const time = document.getElementById('audioTime');
    const pos = player.dragging && seek ? parseFloat(seek.value) : currentPosition();
    if (playBtn) playBtn.textContent = isPlaying ? '⏸ Pause' : '▶ Play';
    if (seek) {
        seek.max = player.total || 0;
        seek.disabled = !player.total;
        if (!player.dragging) seek.value = pos;
    }
    if (time) time.textContent = `${formatTime(pos)} / ${formatTime(player.total)}`;
}

function startUITimer() {
    stopUITimer();
    player.timer = setInterval(updateAudioUI, 200);
}

function stopUITimer() {
    if (player.timer) {
        clearInterval(player.timer);
        player.timer = null;
    }
}

function haltSource() {
    player.token++;
    if (player.source) {
        player.source.onended = null;
        try { player.source.stop(); } catch (e) { /* already stopped */ }
        try { player.source.disconnect(); } catch (e) { /* ignore */ }
        player.source = null;
    }
}

async function loadAudioBuffers() {
    if (player.data === audioData && player.buffers.length) return true;
    stopAudio();
    if (!audioData || audioData.length === 0) {
        setAudioStatus('No audio data to play.');
        return false;
    }
    if (player.loading) return false;
    player.loading = true;
    setAudioStatus('Preparing audio...');
    try {
        const items = [];
        audioData.forEach(segment => {
            if (segment.botBlob) items.push(segment.botBlob);
            if (segment.userBlob || segment.blob) items.push(segment.userBlob || segment.blob);
        });
        const buffers = [];
        for (const item of items) {
            try {
                buffers.push(await decodeBuffer(base64ToArrayBuffer(item)));
            } catch (error) {
                console.error('Error decoding audio data:', error);
            }
        }
        if (buffers.length === 0) {
            setAudioStatus('Could not decode audio.');
            return false;
        }
        let total = 0;
        player.offsets = buffers.map(b => { const start = total; total += b.duration; return start; });
        player.buffers = buffers;
        player.total = total;
        player.data = audioData;
        player.pausedPos = 0;
        setAudioStatus('');
        return true;
    } finally {
        player.loading = false;
    }
}

// Play from a timeline position (seconds)
function playFrom(pos) {
    haltSource();
    pos = Math.min(Math.max(pos, 0), player.total);
    let index = player.offsets.length - 1;
    for (let i = 0; i < player.offsets.length; i++) {
        if (pos < player.offsets[i] + player.buffers[i].duration) { index = i; break; }
    }
    playSegment(index, pos - player.offsets[index]);
}

function playSegment(index, offset) {
    if (index >= player.buffers.length) {
        finishPlayback();
        return;
    }
    const token = player.token;
    const source = audioContext.createBufferSource();
    source.buffer = player.buffers[index];
    source.connect(audioContext.destination);
    source.onended = () => {
        if (token !== player.token) return;
        player.source = null;
        playSegment(index + 1, 0);
    };
    player.source = source;
    player.segIndex = index;
    player.segOffset = offset;
    player.segStartCtx = audioContext.currentTime;
    isPlaying = true;
    source.start(0, offset);
    setAudioStatus('Playing...');
    updateAudioUI();
    startUITimer();
}

function finishPlayback() {
    haltSource();
    isPlaying = false;
    player.pausedPos = 0;
    stopUITimer();
    setAudioStatus('Playback complete.');
    updateAudioUI();
}

// Play / Pause toggle
async function playButtonListener() {
    if (!audioData) return;
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') await audioContext.resume();

    if (isPlaying) {
        player.pausedPos = currentPosition();
        haltSource();
        isPlaying = false;
        stopUITimer();
        setAudioStatus('Paused.');
        updateAudioUI();
        return;
    }
    if (!(await loadAudioBuffers())) return;
    playFrom(player.pausedPos >= player.total ? 0 : player.pausedPos);
}

// Stop: halt playback and rewind to the start
function stopAudio() {
    haltSource();
    isPlaying = false;
    player.pausedPos = 0;
    stopUITimer();
    if (player.buffers.length) setAudioStatus('Stopped.');
    updateAudioUI();
}

// Seek bar: update label while dragging, jump on release
(function initSeekBar() {
    const seek = document.getElementById('audioSeek');
    if (!seek) return;
    seek.addEventListener('input', () => {
        player.dragging = true;
        updateAudioUI();
    });
    seek.addEventListener('change', () => {
        const pos = parseFloat(seek.value) || 0;
        player.dragging = false;
        if (isPlaying) {
            playFrom(pos);
        } else {
            player.pausedPos = pos;
            updateAudioUI();
        }
    });
})();



Array.from(document.getElementsByClassName('transliterate')).forEach(element => {
    element.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent newline insertion
            word = this.value.trim();
            if(word.length === 0){
                return;
            }
            const url = `https://inputtools.google.com/request?text=${encodeURIComponent(word)}&itc=ta-t-i0-und&oe=utf-8`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data[0] === 'SUCCESS') {
                        const tamilText = data[1][0][1][0];
                        this.value = tamilText; // Replace the textarea content with Tamil text
                    } else {
                        console.error('Error fetching transliteration:', data);
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    });
});