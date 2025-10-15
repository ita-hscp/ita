// scripts/topic_practice.js
let counter = 0;
let workSheet = {};
let weekWorkSheet = {};
let mediaRecorder;
let audioChunks = [];
let audioBlob;
let audioBlobList = [];
let recordingNumber = 0;
let base64AudioList = [];
const clearButton = document.getElementById("story-clear-btn");
const pauseButton = document.getElementById("topic-pause-btn");
const startBtn = document.getElementById('story-start-btn');
const saveButton = document.getElementById('story-saveButton');
const recordingIndicator = document.getElementById('recordingIndicator');
const recordingStatus = document.getElementById('recordingStatus');
const elapsedTime = document.getElementById('elapsedTime');
const topicPreviewButton = document.getElementById('topic-preview-btn');
let clearButtonPressed = false;
let topicTranscription = "";
let topicTranscriptionsList = [];
const canvas = document.getElementById('waveform');
const ctx = canvas.getContext('2d');
let requiredDuration = 1 * 60; // 1 minute in seconds
let exerciseId = null;
let audioCtx, analyser, source, stream, recorder;
let dataArray, bufferLength, rafId;
let recording = false;
let timer = null;
let audioData = []; // Array to hold audio segments for playback
let audioQueue = []; // Queue for sequential playback
let isPlaying = false;
let playButton = document.getElementById('audioPlayer');
let playButtonText = "▶ Play";
let audioContext; // Audio context for playback
playButton.textContent = playButtonText;


function draw() {
    rafId = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0f0';
    ctx.beginPath();

    let sliceWidth = canvas.width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] / 128.0;
        let y = v * canvas.height / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
    }
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
}

// Example key words for the topic
let keyWords = ["தமிழ்", "மொழி", "அடிப்படைகள்"];
let score = 0;

// Render key words list
function renderKeyWords() {
    const list = document.getElementById("topic-keywords-list");
    list.innerHTML = "";
    keyWords.forEach(word => {
        const li = document.createElement("li");
        li.textContent = word;
        li.setAttribute("data-keyword", word);
        list.appendChild(li);
    });
}

// Strike out key word and update score
function strikeOutWord(word) {
    const listItem = document.querySelector(`#topic-keywords-list li[data-keyword='${word}']`);
    if (listItem && !listItem.classList.contains("struck")) {
        listItem.style.textDecoration = "line-through";
        listItem.classList.add("struck");
        score++;
        document.getElementById("topic-score").textContent = `Words used: ${score}`;
    }
}

async function blobToBase64(blob) {
    // Serialize the blob to base64 string including metadata
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Check user input for key words
function checkInputForKeyWords(inputText) {
    keyWords.forEach(word => {
        // Case-insensitive match, whole word
        const regex = new RegExp(`${word}`);
        if (regex.test(inputText) || inputText.includes(word)) {
            strikeOutWord(word);
        }
    });
}


window.addEventListener("load", async (event) => {
    saveButton.disabled = true;
    startBtn.disabled = true;
    clearButton.disabled = true
    pauseButton.disabled = true;
    topicPreviewButton.disabled = true;
    const tokenValid = sessionStorage.getItem("sessionToken");
    if (tokenValid) {
        let tasks = await getAllPendingTasks("தலைப்பு பயிற்சி");
        const dropdown = document.getElementById("weeks");
        // Add week numbers to the dropdown from tasks week
        if (tasks) console.log("Tasks:", tasks);
        if (!tasks || tasks.length === 0) {
            console.log("No tasks found");
        }
        if (tasks && tasks.length > 0) {
            tasks.forEach(task => {
                const option = document.createElement("option");
                option.value = task.exerciseId;
                let textContent = task.exerciseNumber ? task.exerciseNumber : task.week;
                option.textContent = textContent;
                dropdown.appendChild(option);
                weekWorkSheet[textContent] = task.content;
            });
        }
    }
});


async function getStoryExercise() {
    const dropdown = document.getElementById("weeks");
    const selectedText = dropdown.options[dropdown.selectedIndex].text;
    const topicSelected = document.getElementById('topicSelected');
    exerciseId = dropdown.options[dropdown.selectedIndex].value
    workSheet = weekWorkSheet[selectedText];
    topicSelected.textContent = workSheet.intro[1]
    await speakApi(workSheet.intro[0])
    await speakApi(workSheet.intro[1])
    keyWords = workSheet.keywords;
    base64AudioList = [];
    workSheet['week'] = selectedText;
    startBtn.disabled = false;
    clearButton.disabled = false;
    requiredDuration = workSheet.duration ? (workSheet.duration * 60) : (5 * 60); // in seconds
    renderKeyWords();
}

async function sendMessage() {
    // enable save button if the audioBlobList has items and total duration > 10 seconds
    if (audioBlobList.length > 0) {
        let totalDuration = 0;
        for (const item of audioBlobList) {
            totalDuration += item.duration;
        }
        if (totalDuration >= requiredDuration) {
            saveButton.disabled = false;
            saveButton.textContent = 'Ready to Upload';
        }
        // Show duration pending to be sent
        console.log(`Total recorded duration: ${totalDuration.toFixed(2)} seconds`);
        let remainingDuration = requiredDuration - totalDuration;
        if (remainingDuration > 0) {
            console.log(`Remaining duration to be recorded: ${remainingDuration.toFixed(2)} seconds`);
        }
        let timeRemaining = document.getElementById('timeRemaining');
        timeRemaining.textContent = `Remaining duration to be recorded: ${remainingDuration.toFixed(2)} seconds`;
        let timeRecorded = document.getElementById('timeRecorded');
        timeRecorded.textContent = `Total recorded duration: ${totalDuration.toFixed(2)} seconds.`;
    }
    startBtn.textContent = 'record';
    startBtn.disabled = false;
    saveButton.disabled = true;
    if (topicTranscription && topicTranscription.length > 0) {
        checkInputForKeyWords(topicTranscription);
        topicTranscriptionsList.push(topicTranscription);
    }

}

saveButton.addEventListener("click", async (event) => {
    const chatBox = document.getElementById("chatBox");
    saveButton.textContent = 'Uploading...';
    // Show progress bar
    // progressContainer.style.display = 'flex';
    // Get all messages inside the chat box
    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(audioBlobList)], { type: 'application/json' });
    const filename = `audio.webm`;
    formData.append(`audioFiles[]`, jsonBlob, filename);
    formData.append("content", JSON.stringify(topicTranscriptionsList));
    formData.append("score", score);
    formData.append("work", "topic_practice");
    formData.append("week", workSheet.week);
    formData.append("exerciseId", exerciseId);
    const spinner = document.getElementById('story-spinner');
    spinner.style.display = "block";
    // console.log(messageArray);
    fetch('https://infinite-sands-52519-06605f47cb30.herokuapp.com/save_form', {
        method: 'POST',
        headers: {
            'Authorization': sessionStorage.getItem('sessionToken')
        },
        body: formData
    })
        .then(response => {
            if (response.status === 401) {
                // Handle 401 Unauthorized - user is not authenticated
                console.log('Unauthorized! Redirecting to login...');
                // Redirect to login page (or handle error accordingly)
                window.location.href = "https://ita-hscp.github.io/ita/Login"; // Redirect to login page
                return; // Stop further execution if 401 is encountered
            } else if (response.ok) {
                spinner.style.display = "none";
                // progressBar.value = 0;
                // progressText.textContent = '0%';
            }
            // If the status is OK or other success code, handle it
            return response.json();  // Parse the JSON response
        })
        .then(data => {
            alert('Work saved successfully!  ' + (data.id ? "id :" + data.id : ""));
            saveButton.textContent = 'Uploaded';
            saveButton.disabled = true;
        })
        .catch(error => {
            alert('Failed to save work.' + JSON.stringify(error));
        })
        .finally(() => {
            // progressContainer.style.display = 'none';
        })
});


async function handleSpeechRecognition(event) {
    let interimTranscript = '';
    for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
            interimTranscript += ` ${transcript}`;
        }
    }
    event.results = []
    topicTranscription = interimTranscript;
}

async function handleRecording(event) {
    if (clearButtonPressed) return;
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
    //Convert audioBlob to base64
    const base64Audio = await blobToBase64(audioBlob);
    recordingNumber++;
    let duration = 0;
    const audioURL = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioURL);
    await new Promise((resolve) => {
        audio.onloadedmetadata = () => {
            duration = audio.duration;
            resolve();
        };
    });
    // Store recording
    const recording = {
        id: crypto.randomUUID(), // Unique ID for this recording
        number: recordingNumber,
        blob: base64Audio,
        timestamp: new Date().toISOString(),
        sent: false,
        duration: duration // Will be updated later
    };

    audioBlobList.push(recording);
    // Clear chunks for the next recording
    audioChunks = [];
}

// Function to display a message
function displayMessage(message, type) {
    const chatBox = document.getElementById('chatBox');
    const msgElement = document.createElement('div');
    msgElement.classList.add('message', type);
    msgElement.textContent = message;
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;  // Scroll to the bottom
}

// Check if the browser supports the Web Speech API
if (!('webkitSpeechRecognition' in window)) {
    alert('Sorry, your browser does not support speech recognition.');
} else {
    window.SpeechRecognition = window.SpeechRecognition
        || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    let mediaRecorder;
    recognition.lang = 'ta';
    recognition.continuous = true; // Keep recognizing speech continuously
    recognition.interimResults = true; // Show interim results
}
clearButton.addEventListener('click', async () => {
    clearButtonPressed = true;
    if (mediaRecorder) {
        await mediaRecorder.stop();
    }
    if (recognition) {
        await recognition.stop();
    }
    console.log('Audio recording cleared');
    audioChunks = []
    // Start the speech recognition
    startBtn.disabled = false;
    saveButton.disabled = true;
    await clearWaveform();
});

async function clearWaveform() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    cancelAnimationFrame(rafId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Initialize MediaRecorder and set up audio visualization
 * 1. Get user media stream
 * 2. Create MediaRecorder with audio options
 * 3. Set up audio visualization with Web Audio API
 * 4. Start recording and visualization
 */
async function setupAudioRecording() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Configure MediaRecorder with optimal settings
        const options = {
            mimeType: 'audio/webm;codecs=opus',
            audioBitsPerSecond: 128000
        };
        mediaRecorder = new MediaRecorder(stream, options);

        // Handle audio data collection
        mediaRecorder.ondataavailable = (event) => {
            if (clearButtonPressed) return;
            audioChunks.push(event.data);
        };

        // Set up audio visualization
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        source = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        bufferLength = analyser.fftSize;
        dataArray = new Uint8Array(bufferLength);
        source.connect(analyser);

        // Handle recording completion
        mediaRecorder.onstop = handleRecording;

        // Start recording and visualization
        await mediaRecorder.start();
        draw();

        console.log('Audio recording started');
    } catch (error) {
        console.error('Error accessing microphone:', error);
        throw error;
    }
}

/**
 * Start speech recognition and set up event handlers
 * 1. Start continuous speech recognition
 * 2. Handle speech results for transcription
 * 3. Handle recognition errors
 * 4. Auto-restart recognition when it ends
 */
async function setupSpeechRecognition() {
    await recognition.start();

    // Handle speech recognition results
    recognition.onresult = handleSpeechRecognition;

    // Handle recognition errors
    recognition.onerror = (event) => {
        console.error('Speech recognition error detected: ' + event.error);
    };

    // Auto-restart recognition when it ends (unless intentionally stopped)
    recognition.onend = async (event) => {
        console.log("Recognition on end" + JSON.stringify(event));
        if (sendBtn.disabled === true) {
            await sendMessage();
        } else {
            await recognition.start(); // Restart recognition if not sent   
        }
    };
}

/**
 * Start recording timer and handle auto-stop functionality
 * 1. Initialize timer variables
 * 2. Update elapsed time display every second
 * 3. Check for required duration completion
 * 4. Auto-stop recording and recognition when time limit reached
 * 5. Update UI to show completion status
 */
function startRecordingTimer() {
    let secondsElapsed = 0;
    elapsedTime.textContent = secondsElapsed;

    timer = setInterval(() => {
        // Stop timer if recording was manually cleared
        if (clearButtonPressed) {
            clearInterval(timer);
            elapsedTime.textContent = '0';
            return;
        }

        // Don't count time if recording is paused
        if (!recording) return;

        secondsElapsed++;
        elapsedTime.textContent = secondsElapsed;

        // Auto-stop when required duration is reached
        if (secondsElapsed >= requiredDuration) {
            clearInterval(timer);
            elapsedTime.textContent = requiredDuration;

            // Stop recognition and recording
            recognition.stop();
            if (mediaRecorder && mediaRecorder.state !== "inactive") {
                mediaRecorder.stop();
                console.log('Audio recording stopped automatically after reaching required duration');
            }

            // Update UI to show completion
            saveButton.disabled = false;
            saveButton.textContent = 'Ready to Upload';
            startBtn.disabled = true;
            startBtn.textContent = 'record';
            recordingStatus.textContent = "Recording complete";
            recordingIndicator.style.display = 'none';
        }
    }, 1000);
}

/**
 * Update UI state when recording starts
 * 1. Disable/enable appropriate buttons
 * 2. Update button text to show current state
 * 3. Show recording indicators
 * 4. Set recording flag
 */
function updateUIForRecordingStart() {
    // Update button states
    startBtn.disabled = true;
    startBtn.textContent = 'listening';
    pauseButton.disabled = false;

    // Show recording indicators
    recording = true;
    recordingIndicator.style.display = 'block';
    recordingStatus.textContent = "Recording";
}


/**
 * Handle start button click - orchestrate recording start process
 * Simplified main function that calls specialized helper functions
 */
startBtn.addEventListener('click', async () => {
    try {
        // Reset clear flag
        clearButtonPressed = false;

        // Update UI to show recording has started
        updateUIForRecordingStart();

        // Start recording timer with auto-stop functionality
        startRecordingTimer();

        // Set up audio recording and visualization
        await setupAudioRecording();

        // Set up speech recognition
        await setupSpeechRecognition();

    } catch (error) {
        console.error('Error starting recording:', error);
        // Reset UI on error
        startBtn.disabled = false;
        startBtn.textContent = 'record';
        recording = false;
        recordingIndicator.style.display = 'none';
        recordingStatus.textContent = "Error - Ready to record";
    }
});

pauseButton.addEventListener('click', async () => {
    if (recording) {
        // Pause recording
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.pause();
            recognition.stop();
            pauseButton.textContent = "Resume";
            recordingStatus.textContent = "Paused";
            recording = false;
        }
    } else {
        // Resume recording
        if (mediaRecorder && mediaRecorder.state === "paused") {
            mediaRecorder.resume();
            await recognition.start();
            pauseButton.textContent = "Pause";
            recordingStatus.textContent = "Recording";
            recording = true;
        }
    }
});

/**
 * Handle topic preview button click - fetch and play audio
 * 1. Fetch audio data from server if not already loaded
 * 2. Prepare audio data for playback
 */
topicPreviewButton.addEventListener('click', async () => {
    topicPreviewButton.disabled = true;
    // play audio from audioBlobList if exists
    if (audioBlobList && audioBlobList.length > 0) {
        // Convert base64 blobs back to audio blobs for playback
        audioData = audioBlobList.map(item => {
            return {
                userBlob: item.blob
            };
        });
        isPlaying = false;
        playButtonListener();
        topicPreviewButton.disabled = false;
        return;
    }

});

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
        audioQueue.push({
            blob: segment.userBlob,
            type: 'user'
        });

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