let counter = 0;
let workSheet = {};
let weekWorkSheet = {};
let mediaRecorder;
let audioChunks = [];
let audioBlob;
let audioBlobList = [];
let combineAudioList = [];
let audioContext;
let botAudioBuffer = null;
let userAudioBuffer = null;

let recordedChunks = [];
let combinedAudioBuffer = null;
let combinedBlob = null;
const saveButton = document.getElementById("conversation-saveButton");
const clearButton = document.getElementById("conversation-clear-btn");
const startBtn = document.getElementById('conversation-start-btn');
const sendBtn = document.getElementById('conversation-send-btn');
const transcription = document.getElementById('userInput');

// Combine bot audio and user response
async function combineAudio() {
    if (!botAudioBuffer || !userAudioBuffer) {
        updateStatus('Both bot audio and your response are needed to combine.');
        return;
    }

    try {
        // Calculate the combined length
        const combinedLength = botAudioBuffer.length + userAudioBuffer.length;

        // Create a new buffer for the combined audio
        combinedAudioBuffer = audioContext.createBuffer(
            Math.max(botAudioBuffer.numberOfChannels, userAudioBuffer.numberOfChannels),
            combinedLength,
            audioContext.sampleRate
        );

        // Copy bot audio data
        for (let channel = 0; channel < botAudioBuffer.numberOfChannels; channel++) {
            const combinedChannelData = combinedAudioBuffer.getChannelData(channel);
            const botChannelData = botAudioBuffer.getChannelData(channel);

            for (let i = 0; i < botAudioBuffer.length; i++) {
                combinedChannelData[i] = botChannelData[i];
            }
        }

        // Copy user audio data
        for (let channel = 0; channel < userAudioBuffer.numberOfChannels; channel++) {
            if (channel >= combinedAudioBuffer.numberOfChannels) break;

            const combinedChannelData = combinedAudioBuffer.getChannelData(channel);
            const userChannelData = userAudioBuffer.getChannelData(channel);

            for (let i = 0; i < userAudioBuffer.length; i++) {
                combinedChannelData[i + botAudioBuffer.length] = userChannelData[i];
            }
        }

        // Convert the combined audio buffer to a blob
        const offlineContext = new OfflineAudioContext(
            combinedAudioBuffer.numberOfChannels,
            combinedAudioBuffer.length,
            combinedAudioBuffer.sampleRate
        );

        const source = offlineContext.createBufferSource();
        source.buffer = combinedAudioBuffer;
        source.connect(offlineContext.destination);
        source.start(0);

        const renderedBuffer = await offlineContext.startRendering();

        // Convert to WAV format for better compatibility
        const wavBlob = await bufferToWav(renderedBuffer);
        combinedBlob = wavBlob;
        return wavBlob;

    } catch (error) {
        updateStatus('Error combining audio: ' + error.message);
        console.error('Error combining audio', error);
    }
}

// Convert AudioBuffer to WAV format
function bufferToWav(buffer) {
    return new Promise((resolve) => {
        const numOfChannels = buffer.numberOfChannels;
        const length = buffer.length * numOfChannels * 2;
        const sampleRate = buffer.sampleRate;

        // Create the WAV file
        const wavDataView = new DataView(new ArrayBuffer(44 + length));

        // "RIFF" chunk descriptor
        writeString(wavDataView, 0, 'RIFF');
        wavDataView.setUint32(4, 36 + length, true);
        writeString(wavDataView, 8, 'WAVE');

        // "fmt " sub-chunk
        writeString(wavDataView, 12, 'fmt ');
        wavDataView.setUint32(16, 16, true);
        wavDataView.setUint16(20, 1, true); // PCM format
        wavDataView.setUint16(22, numOfChannels, true);
        wavDataView.setUint32(24, sampleRate, true);
        wavDataView.setUint32(28, sampleRate * numOfChannels * 2, true); // Byte rate
        wavDataView.setUint16(32, numOfChannels * 2, true); // Block align
        wavDataView.setUint16(34, 16, true); // Bits per sample

        // "data" sub-chunk
        writeString(wavDataView, 36, 'data');
        wavDataView.setUint32(40, length, true);

        // Write the PCM samples
        const channelData = [];
        let offset = 44;

        // Get data from all channels
        for (let i = 0; i < numOfChannels; i++) {
            channelData.push(buffer.getChannelData(i));
        }

        // Interleave the channel data and convert to 16-bit PCM
        for (let i = 0; i < buffer.length; i++) {
            for (let channel = 0; channel < numOfChannels; channel++) {
                // Convert float audio data (-1 to 1) to 16-bit PCM
                const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
                const int16Sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
                wavDataView.setInt16(offset, int16Sample, true);
                offset += 2;
            }
        }

        // Create Blob and resolve
        const wavBlob = new Blob([wavDataView], { type: 'audio/wav' });
        resolve(wavBlob);
    });
}

async function getAudioBuffer(audioBlob) {
    if (!audioBlob) {
        console.error('No audio blob provided');
        return null;
    }
    try {
        if(audioBlob.arrayBuffer){
        const arrayBuffer = await audioBlob.arrayBuffer();
        return await audioContext.decodeAudioData(arrayBuffer);
        }
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = async (event) => {
                const arrayBuffer = event.target.result;
                try {
                    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                    resolve(audioBuffer);
                } catch (error) {
                    console.error('Error decoding audio data:', error);
                    reject(error);
                }
            };
            reader.onerror = (error) => {
                console.error('Error reading audio blob:', error);
                reject(error);
            };
            reader.readAsArrayBuffer(audioBlob);
        });
    } catch (error) {
        console.error('Error decoding audio data:', error);
        return null;
    }
    
}

async function getExercise() {
    const dropdown = document.getElementById("weeks");
    let selectedText = dropdown.options[dropdown.selectedIndex].text;
    if (dropdown.options[dropdown.selectedIndex].value?.includes("listen")) {
        selectedText = dropdown.options[dropdown.selectedIndex].value
    }
    const header = await getWorkSheet(null, "header")
    // workSheet = await getWorkSheet(selectedText === "" ? "1" : selectedText, null);
    workSheet = weekWorkSheet[selectedText] ? weekWorkSheet[selectedText] : await getWorkSheet(selectedText, null);
    workSheet['week'] = selectedText;
    const startBtn = document.getElementById('conversation-start-btn');
    const topicSelected = document.getElementById('topicSelected');
    topicSelected.textContent = workSheet.intro[1]
    await speakApi(workSheet.intro[0])
    await speakApi(workSheet.intro[1])
    base64AudioList = [];
    startBtn.disabled = false;
    clearButton.disabled = false;
    const messages = chatBox.querySelectorAll(".message");
    if (messages) {
        messages.forEach(message => message.remove());
    }
    sendMessage();
}
window.addEventListener("load", async (event) => {
    const tokenValid = sessionStorage.getItem("sessionToken");
    if (tokenValid) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
        const tasks = await getAllPendingTasks("உரையாடல் பயிற்சி");
        const dropdown = document.getElementById("weeks");
        // Add week numbers to the dropdown from tasks week
        if (tasks && tasks.length > 0) {
            tasks.forEach(task => {
                const option = document.createElement("option");
                option.value = task.week;
                option.textContent = task.week;
                dropdown.appendChild(option);
                weekWorkSheet[task.week] = task.content;
            });
        }
    }
});

async function getAudio(text) {
    try {
        // Replace with your API URL that returns audio/mpeg
        const apiUrl = 'https://infinite-sands-52519-06605f47cb30.herokuapp.com/text_to_speech?text=' + text

        // Fetch the audio file from the API
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: sessionStorage.getItem('sessionToken')
            }
        });

        if (response.status === 401) {
            // Redirect to login page if not authenticated
            window.location.href = "https://ita-hscp.github.io/ita/Login";
            return;
        }

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
       // Convert the response into a Blob (audio file)
        const audioBlob = await response.blob();
        botAudioBuffer = await getAudioBuffer(audioBlob);
        return audioBlob;
    } catch (error) {
        console.error('Error fetching audio:', error);
    }
}

async function speak(audioBlob) {
    try {
        await playAudio(audioBlob)
    } catch (error) {
        console.error('Error playing audio:', error);
    }
}




async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.textContent.trim();
    if ((message || counter == 0) && workSheet && workSheet.conversations && workSheet.conversations.length > counter) {
        // Display the sent message
        if (message) {
            displayMessage(message, 'sent');
            // Clear input field
            userInput.textContent = "";
        }
        startBtn.disabled = false;
        let botResponse = workSheet.conversations[counter];
        counter++;
        displayMessage(botResponse, 'received');
        const audioBlob = await getAudio(botResponse)
        await speak(audioBlob)
        // await speakApi(botResponse)
    }
    if (workSheet && workSheet.conversations && workSheet.conversations.length <= counter) {
        startBtn.disabled = true;
        clearButton.disabled = true;
        saveButton.disabled = false;
    }
}


saveButton.addEventListener("click", async (event) => {
    const chatBox = document.getElementById("chatBox");
    saveButton.textContent = 'Uploading...';
    // Show progress bar
    // progressContainer.style.display = 'flex';
    // Get all messages inside the chat box
    const messages = chatBox.querySelectorAll(".message");
    const audioPlayer = document.getElementById('audio-player');
    if (combineAudio.length === 0) {
        alert('No audio recorded. Please record your conversation before saving.');
        return;
    }
    // Create a URL for the Blob object and set it as the source for the audio player
    
    const formData = new FormData();
    const audioBlob = new Blob(audioBlobList, { type: 'audio/webm' });
    const filename = `audio.webm`;
    formData.append(`audioFiles[]`, audioBlob, filename);
    if (combineAudioList.length > 0) {
        const blob = new Blob(combineAudioList, { type: 'audio/webm' });
        const audioURL = URL.createObjectURL(blob);
        formData.append('audioFiles[]', blob, filename);
        audioPlayer.src = audioURL;
        audioPlayer.style.display = 'block';
    }else {
        formData.append('audioFiles[]', audioBlob, filename);
    }
    const messageArray = Array.from(messages).map(message => message.textContent.trim());
    formData.append("content", JSON.stringify(messageArray));
    formData.append("work", "conversation");
    formData.append("week", workSheet.week ? workSheet.week : "18");
    const spinner = document.getElementById('conversation-spinner');
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

function handleSpeechRecognition(event) {
    let interimTranscript = '';
    let finalTranscript = '';
    for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
            finalTranscript += transcript;
        } else {
            interimTranscript += transcript;
        }
        transcription.innerHTML = `${transcript}`;
    }
    transcription.innerHTML = `${finalTranscript}`;
    event.results = []
}

async function handleRecording(event) {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const arrayBuffer = await audioBlob.arrayBuffer();
    userAudioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    combinedBlob = await combineAudio();
    if (combinedBlob) {
        combineAudioList.push(combinedBlob);
    }
    const audioURL = URL.createObjectURL(audioBlob);
    console.log('Audio URL:', audioURL);
    audioBlobList.push(...audioChunks)
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
    document.getElementById('conversation-start-btn').focus();
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
        const userInput = document.getElementById('userInput');
        userInput.innerHTML = "";
        transcription.innerHTML = ""
        audioChunks = []
        if (mediaRecorder) {
            mediaRecorder.onstop = () => {
                console.log("Ignore Recording")
            }
            mediaRecorder.ondataavailable = () => { }
            await mediaRecorder.stop();
            // await mediaRecorder.start();
        }
        if (recognition) {
            recognition.onresult = (event) => {
                console.log("Ignore Listening")
            }
            await recognition.stop();
            // await recognition.start();
        }
        console.log('Audio recording started');
        // Start the speech recognition
        startBtn.disabled = false;
        sendBtn.disabled = true;
        startBtn.textContent = 'record';
    });


    startBtn.addEventListener('click', async () => {
        await recognition.start(); // Start the speech recognition
        startBtn.disabled = true;
        sendBtn.disabled = false;
        startBtn.textContent = 'listening';
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream, { type: 'audio/wav' });
            mediaRecorder.ondataavailable = (event) => {

                audioChunks.push(event.data);
            };
            mediaRecorder.onstop = handleRecording;
            await mediaRecorder.start();
            console.log('Audio recording started');
            recognition.onresult = handleSpeechRecognition;
            recognition.onerror = (event) => {
                console.error('Speech recognition error detected: ' + event.error);
            };
            recognition.onend = () => {
                console.log("Recognition on end")
            };
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    });
    sendBtn.addEventListener('click', async () => {
        recognition.stop(); // Stop the speech recognition
        startBtn.disabled = false;
        sendBtn.disabled = true;
        if (mediaRecorder) {
            await mediaRecorder.stop();
            console.log('Audio recording stopped');
        }
        startBtn.textContent = 'record';
    });
}
