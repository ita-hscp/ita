let counter = 0;
let workSheet = {};
let mediaRecorder;
let audioChunks = [];
let audioBlob;
let audioBlobList = [];
const saveButton = document.getElementById("conversation-saveButton");
const clearButton = document.getElementById("conversation-clear-btn");
const startBtn = document.getElementById('conversation-start-btn');
const sendBtn = document.getElementById('conversation-send-btn');
const transcription = document.getElementById('userInput');
// const progressBar = document.getElementById('progressBar');
// const progressText = document.getElementById('progressText');


async function getExercise() {
    const dropdown = document.getElementById("weeks");
    let selectedText = dropdown.options[dropdown.selectedIndex].text;
    if(dropdown.options[dropdown.selectedIndex].value?.includes("listen")){
        selectedText= dropdown.options[dropdown.selectedIndex].value
    }
    const header = await getWorkSheet(null, "header")
    workSheet = await getWorkSheet(selectedText === "" ? "1" : selectedText, null);
    workSheet['week']=selectedText.includes("listen")?selectedText.split("-")[0]:selectedText;
    const startBtn = document.getElementById('conversation-start-btn');
    const topicSelected = document.getElementById('topicSelected');
    const linkDiv = document.getElementById('div-link')
    topicSelected.textContent = workSheet.intro[1]
    linkDiv.innerHTML= workSheet.link
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
    const formData = new FormData();
    const audioBlob = new Blob(audioBlobList, { type: 'audio/webm' });
    const filename = `audio.webm`;
    formData.append(`audioFiles[]`, audioBlob, filename);
    const messageArray = Array.from(messages).map(message => message.textContent.trim());
    formData.append("content", JSON.stringify(messageArray));
    formData.append("work", "listen");
    formData.append("week", workSheet.week?workSheet.week:"18");
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
