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
const saveButton = document.getElementById("story-saveButton");
const clearButton = document.getElementById("story-clear-btn");
const startBtn = document.getElementById('story-start-btn');
const sendBtn = document.getElementById('story-send-btn');
const exerciseStartButton = document.getElementById('exercise-start-btn');
let clearButtonPressed = false;
let topicTranscription = "";
let topicTranscriptionsList = [];
const canvas = document.getElementById('waveform');
const ctx = canvas.getContext('2d');

let audioCtx, analyser, source, stream, recorder;
let dataArray, bufferLength, rafId;
let recording = false;

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
        document.getElementById("topic-score").textContent = `Score: ${score}`;
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
    sendBtn.disabled = true;
    startBtn.disabled = true;
    exerciseStartButton.disabled = true;
    clearButton.disabled = true
    saveButton.disabled = true;

    const tokenValid = sessionStorage.getItem("sessionToken");
    if (tokenValid) {
        let tasks = await getAllPendingTasks("தலைப்பு பயிற்சி");
        const dropdown = document.getElementById("weeks");
        // Add week numbers to the dropdown from tasks week
        if (tasks) console.log("Tasks:", tasks);
        if (!tasks || tasks.length === 0) {
            console.log("No tasks found");
            tasks = [];
            tasks.push({
                week: "1", exerciseId: "23", content: {
                    // Mock content in Tamil , Intro: For the given topic, you have to speak for 3 minutes and try to use the key words effectively.
                    "intro": [
                        "வணக்கம். இந்த தலைப்பில், நீங்கள் 5 நிமிடங்கள் பேச வேண்டும். முக்கிய சொற்களை பயன்படுத்த முயற்சிக்கவும்.",
                        "இன்றைய தலைப்பு தமிழ் மொழி"
                    ],
                    // Mock content in Tamil
                    title: "தமிழ் மொழி",
                    description: "தமிழ் மொழியின் அடிப்படைகளை கற்றுக்கொள்ளுங்கள்.",
                    keywords: ["தமிழ்", "மொழி", "அடிப்படைகள்"]
                }
            });//mock
        }
        if (tasks && tasks.length > 0) {
            tasks.forEach(task => {
                const option = document.createElement("option");
                option.value = task.exerciseId;
                option.textContent = task.week;
                dropdown.appendChild(option);
                weekWorkSheet[task.week] = task.content;
            });
        }
    }
});


async function getStoryExercise() {
    const dropdown = document.getElementById("weeks");
    const selectedText = dropdown.options[dropdown.selectedIndex].text;
    const topicSelected = document.getElementById('topicSelected');
    workSheet = weekWorkSheet[selectedText];
    topicSelected.textContent = workSheet.intro[1]
    await speakApi(workSheet.intro[0])
    await speakApi(workSheet.intro[1])
    keyWords = workSheet.keywords;
    base64AudioList = [];
    workSheet['week'] = selectedText;
    exerciseStartButton.disabled = false;
    sendBtn.disabled = true;
    startBtn.disabled = true;
    saveButton.disabled = true;
    renderKeyWords();
}

async function sendMessage() {
    // enable save button if the audioBlobList has items and total duration > 10 seconds
    if (audioBlobList.length > 0) {
        let totalDuration = 0;
        for (const item of audioBlobList) {
            totalDuration += item.duration;
        }
        if (totalDuration >= 10) {
            saveButton.disabled = false;
            saveButton.textContent = 'Ready to Upload';
        }
        // Show duration pending to be sent
        console.log(`Total recorded duration: ${totalDuration.toFixed(2)} seconds`);
        let remainingDuration = 5*60 - totalDuration;
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
    sendBtn.disabled = true;
    if (topicTranscription && topicTranscription.length > 0) {
        checkInputForKeyWords(topicTranscription);
        topicTranscriptionsList.push(topicTranscription);
    }

}

exerciseStartButton.addEventListener('click', async () => {
    exerciseStartButton.disabled = true;
    startBtn.disabled = false;
    sendBtn.disabled = true;
    startBtn.textContent = 'record';
    this.style.display = 'none';
});

saveButton.addEventListener("click", async (event) => {
    const chatBox = document.getElementById("chatBox");
    saveButton.textContent = 'Uploading...';
    // Show progress bar
    // progressContainer.style.display = 'flex';
    // Get all messages inside the chat box
    const formData = new FormData();
    audioBlob = new Blob(audioBlobList, { type: 'audio/webm' });
    const filename = `audio.webm`;
    formData.append(`audioFiles[]`, audioBlob, filename);
    formData.append("content", JSON.stringify(topicTranscriptionsList));
    formData.append("work", "தலைப்பு பயிற்சி");
    formData.append("week", workSheet.week);
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
// Optionally, focus the input field on page load
window.onload = function () {
    document.getElementById('exercise-btn').focus();
};
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
        sendBtn.disabled = true;
        startBtn.textContent = 'record';
        await clearWaveform();
    });

    async function clearWaveform() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        cancelAnimationFrame(rafId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    startBtn.addEventListener('click', async () => {
        clearButtonPressed = false;
        await recognition.start(); // Start the speech recognition
        startBtn.disabled = true;
        sendBtn.disabled = false;
        startBtn.textContent = 'listening';
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const options = {
                mimeType: 'audio/webm;codecs=opus',
                audioBitsPerSecond: 128000
            };
            mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorder.ondataavailable = (event) => {
                if (clearButtonPressed) return;
                audioChunks.push(event.data);
            };
            /***  Audio visualization setup  ***/
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            source = audioCtx.createMediaStreamSource(stream);
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 2048;
            bufferLength = analyser.fftSize;
            dataArray = new Uint8Array(bufferLength);
            source.connect(analyser);
            mediaRecorder.onstop = handleRecording;
            await mediaRecorder.start();
            draw();
            console.log('Audio recording started');
            recognition.onresult = handleSpeechRecognition;
            recognition.onerror = (event) => {
                console.error('Speech recognition error detected: ' + event.error);
            };
            recognition.onend = async (event) => {
                console.log("Recognition on end" + JSON.stringify(event));
                if (sendBtn.disabled === true) {
                    await sendMessage();
                } else {
                    await recognition.start(); // Restart recognition if not sent   
                }
            };
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    });
    sendBtn.addEventListener('click', async () => {
        sendBtn.disabled = true;
        await recognition.stop(); // Stop the speech recognition
        // startBtn.disabled = false;
        if (mediaRecorder) {
            await mediaRecorder.stop();
            console.log('Audio recording stopped');
        }
        startBtn.textContent = 'processing...';
        if (!saveButton.disabled) {
            startBtn.disabled = true
        }
        checkInputForKeyWords(topicTranscription);
        await clearWaveform();
    });

}
