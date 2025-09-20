let counter = 0;
let workSheet = {};
let mediaRecorder;
let audioChunks = [];
let audioBlob;
let audioBlobList = [];
const saveButton = document.getElementById("story-saveButton");
const clearButton = document.getElementById("story-clear-btn");
const startBtn = document.getElementById('story-start-btn');
const sendBtn = document.getElementById('story-send-btn');
const transcription = document.getElementById('userInput');
const exerciseStartButton = document.getElementById('exercise-start-btn');
let clearButtonPressed = false;

window.addEventListener("load", async (event) => {
    const tokenValid = sessionStorage.getItem("sessionToken");
    if (tokenValid) {
        const tasks = await getAllPendingTasks("கதை சொல்லுதல் பயிற்சி");
        const dropdown = document.getElementById("weeks");
        // Add week numbers to the dropdown from tasks week
        if (tasks && tasks.length > 0) {
            tasks.forEach(task => {
                const option = document.createElement("option");
                option.value = task.exerciseId;
                let textContent= task.exerciseNumber ? task.exerciseNumber : task.week;
                option.textContent = textContent;
                dropdown.appendChild(option);
                weekWorkSheet[textContent] = task.content;
            });
        }
    }
});

/*
*  Store Image 
*/
function setStoryImage1(name) {
    const image = document.getElementById('imageplaceholder');
    image.innerHTML = "<img id=\"storyImagePh\" src=\"/ita/images/" + name + "\" >"
}



async function fetchImage1(filename, type) {
    setStoryImage1(filename)
    const img = document.getElementById('storyImagePh');
    if (type === 'full') {
        img.classList.add('full-img');
        img.style.width = '90%';
        img.style.height = '90%';
    } else {
        img.classList.add('segment-img');
        img.style.width = '50%';
        img.style.height = '50%';
    }
}

async function getStoryExercise() {
    const dropdown = document.getElementById("weeks");
    const selectedText = dropdown.options[dropdown.selectedIndex].text;
    let segments = [];
    for (let i = 1; i <= 10; i++) {
        segments.push("story_" + selectedText + "_" + i + ".png")
    }

    workSheet = {
        "intro": [
            "வணக்கம். முதல் படத்தில் முழு கதையையும் புரிந்து கொள்ளுங்கள்",
            "கீழ் வரும் படங்களை பார்த்து கதை சொல்லவும்.",
            "ஒவ்வொரு படத்திற்கும் குறைந்தது ஒரு வாக்கியமாவது பேசுங்கள்.",

        ],
        "full": "story_full_" + selectedText + ".png",
        "segments": segments,
        "week": selectedText
    }

    const topicSelected = document.getElementById('topicSelected');
    topicSelected.textContent = workSheet.intro[1]
    await speakApi(workSheet.intro[0])
    await speakApi(workSheet.intro[1])
    base64AudioList = [];
    workSheet['week'] = selectedText;
    await fetchImage1(workSheet.full, 'full');
    exerciseStartButton.disabled = false;
}

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.textContent.trim();
    if (workSheet && workSheet.segments && counter >= workSheet.segments.length) {
        startBtn.disabled = true;
        clearButton.disabled = true;
        saveButton.disabled = false;
        if (message !== "") {
            displayMessage(message, 'sent');
            // Clear input field
            userInput.textContent = "";
        }
    }
    if ((message || counter == 0) && workSheet && workSheet.segments && workSheet.segments.length > counter) {
        // Display the sent message
        if (message) {
            displayMessage(message, 'sent');
            // Clear input field
            userInput.textContent = "";
        }
        startBtn.disabled = false;
        clearButton.disabled = false;
        let botResponse = workSheet.segments[counter];
        counter++;
        await fetchImage1(botResponse);
    }
}

exerciseStartButton.addEventListener('click', async () => {
    await speakApi(workSheet.intro[2])
    topicSelected.textContent = workSheet.intro[2]
    sendMessage();
    exerciseStartButton.disabled = true;
    this.style.display = 'none';
});

saveButton.addEventListener("click", async (event) => {
    const chatBox = document.getElementById("chatBox");
    saveButton.textContent = 'Uploading...';
    // Show progress bar
    // progressContainer.style.display = 'flex';
    // Get all messages inside the chat box
    const messages = chatBox.querySelectorAll(".message");
    const formData = new FormData();
    audioBlob = new Blob(audioBlobList, { type: 'audio/webm' });
    const filename = `audio.webm`;
    formData.append(`audioFiles[]`, audioBlob, filename);
    const messageArray = Array.from(messages).map(message => message.textContent.trim());
    formData.append("content", JSON.stringify(messageArray));
    formData.append("work", "storyTelling");
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
    document.getElementById('story-start-btn').focus();
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
        clearButtonPressed = true;
        // audioBlobList = audioBlobList.filter(item => item.sent === true);
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
    });


    startBtn.addEventListener('click', async () => {
        clearButtonPressed = false;
        await recognition.start(); // Start the speech recognition
        startBtn.disabled = true;
        sendBtn.disabled = false;
        startBtn.textContent = 'listening';
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const options = {
                mimeType: 'audio/webm;codecs=opus',
                audioBitsPerSecond: 128000
            };
            mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorder.ondataavailable = (event) => {
                if (clearButtonPressed) return;
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
