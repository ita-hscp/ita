
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
            <td>${assignmentType}</td>
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
                item['assignmentType'] = assignmentType;
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
function playButtonListener() {
    if (!audioData) return;
    if (isPlaying){ isPlaying = false;
        playButton = document.getElementById('playBtn-modal'); 
        playButton.textContent = '▶ Play';
        return;
    }

    if (!audioContext) {
        // Create audio context on first play (to handle autoplay restrictions)
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    prepareAndPlayAudio();
}

// Prepare audio data and start playback
function prepareAndPlayAudio() {
    const playButton = document.getElementById('playBtn-modal');
    const statusElement = document.getElementById('stopBtn-modal');
    if (!audioData || audioData.length === 0) {
        statusElement.textContent = 'No audio data to play.';
        return;
    }

    statusElement.textContent = 'Preparing audio...';
    isPlaying = true;
    // Reset audio queue
    audioQueue = [];

    // Process all segments and create an audio queue
    audioData.forEach(segment => {
        // Add user audio if exists

        // Add bot audio if exists
        if (segment.botBlob) {
            audioQueue.push({
                blob: segment.botBlob,
                type: 'bot'
            });
        }
        if (segment.userBlob) {
            audioQueue.push({
                blob: segment.userBlob,
                type: 'user'
            });
        }
    });
    playButton.textContent = '⏸ Playing...';
    // Start playing the queue
    playNextInQueue();
}

// Play the next audio in the queue
function playNextInQueue() {
    const playButton = document.getElementById('playBtn-modal');
    const statusElement = document.getElementById('stopBtn-modal');
    if (audioQueue.length === 0 || !isPlaying) {
        // Queue is empty, playback complete
        statusElement.textContent = 'Playback complete.';
        playButton.textContent = '▶ Play';
        isPlaying = false;
        return;
    }

    const audioItem = audioQueue.shift();
    statusElement.textContent = `Playing ${audioItem.type} audio...`;

    // Convert base64 to audio buffer
    const base64Data = audioItem.blob;

    // Remove data URL prefix if present
    let base64String = base64Data;
    if (base64String.includes(',')) {
        base64String = base64String.split(',')[1];
    }

    // Decode base64
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Decode audio data
    audioContext.decodeAudioData(
        bytes.buffer,
        function (buffer) {
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);

            // Play this audio and when done, play the next one
            source.onended = playNextInQueue;
            source.start(0);
        },
        function (error) {
            console.error('Error decoding audio data:', error);
            // statusElement.textContent = `Error playing ${audioItem.type} audio. Skipping to next...`;
            // Try to play the next one even if this one failed
            playNextInQueue();
        }
    );
}

