let isPlaying = false;
let audioContext = null;
let playButton = null;
let audioQueue = [];
const audioMap = new Map();
let selectedIndex = null;
let audioData = null;


async function getClassReport(reportQuery) {
    const apiUrl = 'https://infinite-sands-52519-06605f47cb30.herokuapp.com/assignment/student';
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


// window.addEventListener("load", async (event) => {
//     const tableBody = document.querySelector("#jsonTable tbody");
//     const query = {
//         "className": "HSCP1E",
//         "week": "ALL",
//         "assignmentType": "conversation"
//     }
//     const jsonData = await getClassReport(query);
//     if (jsonData?.report) {
//         jsonData.report.forEach(item => {
//             const row = document.createElement("tr");
//             row.innerHTML = `
//             <td>${item.id}</td>
//             <td>${item.week}</td>
//             <td>${item.assignmentType}</td>
//             <td>${item.status}</td>
//             <td>${item.score}</td>
//             <td>${item.comments}</td>
//             <td>${item.completionDate}</td>
//             <td>${item.dueDate}</td>
//         `;
//             tableBody.appendChild(row);
//         });
//     }
// });


async function loadReport() {
    const query = {
    }
    const tableBody = document.querySelector("#jsonTable tbody");
    const assignmentType = document.getElementById("assignmentTypeFilter")
    query['assignmentType'] = assignmentType.options[assignmentType.selectedIndex].value;
    const jsonData = await getClassReport(query);
    if (jsonData?.report) {
        tableBody.innerHTML = "";
        jsonData.report.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${item.week}</td>
            <td>${item.assignmentType}</td>
            <td>${item.status}</td>
            <td>${item.score}</td>
            <td>${item.comments}</td>
            <td>${item.completionDate}</td>
            <td>${item.dueDate}</td>
            <td><button class="play-btn" id="${item.exerciseId}" data-id="${item.fileId}">▶ Play</button></td>
        `;
            tableBody.appendChild(row);
        });
        addAudio(jsonData.report, query);
    }
};


async function addAudio(reportData, query) {
    const audioMap = new Map();
    document.querySelectorAll(".play-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const audioId = this.getAttribute("data-id");
            let audio = audioMap.get(audioId);
            playButton = this;
            if (isPlaying) {
                // Pause the currently playing audio
                audioContext.suspend();
                isPlaying = false;
                playButton.textContent = "▶ Play";
                return;
            }
            selectedIndex = this.getAttribute("data-index");
            if (!audio) {
                const item = reportData.filter(item => item.fileId == audioId)[0]
                item['assignmentType'] = query['assignmentType'];
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
                        window.location.href = "https://ita-hscp.github.io/ita/Login"; // Replace '/login' with your actual login URL
                        return;
                    }
                    const blob = await response.blob();
                    if (blob) {
                        const text = await blob.text();
                        const audioJson = await JSON.parse(text);
                        audioMap.set(item.fileId, audioJson);
                    }

                } catch (error) {
                    console.error("Error fetching audio file:", error);
                }
            }
            audioData = audioMap.get(audioId);
            isPlaying=false;
            playButtonListener();
        });
    });
}

function playButtonListener() {
    if (!audioData || isPlaying) return;

    if (!audioContext) {
        // Create audio context on first play (to handle autoplay restrictions)
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    prepareAndPlayAudio();
}

// Prepare audio data and start playback
function prepareAndPlayAudio() {

    if (!audioData || audioData.length === 0) {
        return;
    }

    isPlaying = true;
    playButton.textContent = "⏸ Playing...";
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

    // Start playing the queue
    playNextInQueue();
}

// Play the next audio in the queue
function playNextInQueue() {
    if (audioQueue.length === 0) {
        // Queue is empty, playback complete
        isPlaying = false;
        playButton.textContent = "▶ Play";
        return;
    }

    const audioItem = audioQueue.shift();
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


