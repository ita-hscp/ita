
let mediaRecorder;
let audioChunks = [];
let audioBlob;
let audioBlobList = [];
const words = [];
let currentWordIndex = Math.floor(Math.random() * words.length);
let currentWord = words[currentWordIndex];

function shuffleWord(word) {
    return word.split("").sort(() => Math.random() - 0.5).join("");
}

async function getQuestions() {
    const apiUrl = 'https://infinite-sands-52519-06605f47cb30.herokuapp.com/dictations';
    // Fetch the json
    const response = await fetch(apiUrl, {
        headers: {
            Authorization: sessionStorage.getItem('sessionToken')
        }
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
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
async function getSuffledWord() {
    let letters = [];
    const segmenter = new Intl.Segmenter("ta", { granularity: "grapheme" });
    if (words.length === 0) {
        let dictionary = await getQuestions()
        const tamilWords = Object.keys(dictionary);
        const randomTamilWord = tamilWords[Math.floor(Math.random() * tamilWords.length)];
        currentWord = randomTamilWord;
        letters = [...segmenter.segment(randomTamilWord)].map(seg => seg.segment);
    } else {
        letters = [...segmenter.segment(currentWord)].map(seg => seg.segment);
    }
    letters = letters.sort(() => Math.random() - 0.5);
    return letters;
}
async function displayJumbledWord() {
    const scrollingContainer = document.getElementById("scrollingContainer");
    scrollingContainer.innerHTML = "";
    const jumbledWord = await getSuffledWord();
    for (const letter of jumbledWord) {
        const letterBox = document.createElement("div");
        letterBox.className = "jumbled-box";
        letterBox.textContent = letter;
        scrollingContainer.appendChild(letterBox);
    }
}

function checkGuess() {
    const userInput = document.getElementById('userInput').textContent;
    const message = document.getElementById("message");

    if (userInput === currentWord) {
        message.textContent = "Correct! You guessed the word!";
        message.style.color = "green";
    } else {
        message.textContent = "Wrong! Moving to the next word.";
        message.style.color = "red";
    }

    // Move to the next word
    currentWordIndex = (currentWordIndex + 1) % words.length;
    currentWord = words[currentWordIndex];
    displayJumbledWord();
    document.getElementById("userInput").value = "";
}

function addNewWord() {
    const newWordInput = document.getElementById("newWord").value;
    const message = document.getElementById("message");

    if (newWordInput && !words.includes(newWordInput)) {
        words.push(newWordInput);
        message.textContent = `Word "${newWordInput}" added successfully!`;
        message.style.color = "green";
        document.getElementById("newWord").value = "";
    } else {
        message.textContent = "Invalid or duplicate word. Please try again.";
        message.style.color = "red";
    }
}

function clearWords() {
    words.length = 0; // Clear the words array
    const message = document.getElementById("message");
    message.textContent = "All words have been cleared!";
    message.style.color = "blue";

    // Reset the game
    currentWord = "";
    const scrollingContainer = document.getElementById("scrollingContainer");
    scrollingContainer.innerHTML = "";
}

// Initialize the game
displayJumbledWord();


const clearButton = document.getElementById("conversation-clear-btn");
const startBtn = document.getElementById('conversation-start-btn');
const sendBtn = document.getElementById('conversation-send-btn');
const addBySpeechBtn = document.getElementById('conversation-add-btn');
const transcription = document.getElementById('userInput');


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
    let audioChunks = [];
    let audioBlob;
    recognition.lang = 'ta';
    recognition.continuous = true; // Keep recognizing speech continuously
    recognition.interimResults = true; // Show interim results
    startBtn.disabled = false;
    clearButton.addEventListener('click', async () => {
        const userInput = document.getElementById('userInput');
        userInput.innerHTML = "";
        transcription.innerHTML = ""
        audioChunks = []
        if (mediaRecorder) {
            await mediaRecorder.stop();
            await mediaRecorder.start();
        }
        if (recognition) {
            await recognition.stop();
            await recognition.start();
        }
        console.log('Audio recording started');
        // Start the speech recognition
        startBtn.disabled = true;
        sendBtn.disabled = false;
        startBtn.textContent = 'listening';
    });


    addBySpeechBtn.addEventListener('click', async () => {
        const addedWord = document.getElementById('userInput').textContent;
        words.push(addedWord);
    });

    startBtn.addEventListener('click', async () => {
        recognition.start(); // Start the speech recognition
        startBtn.disabled = true;
        sendBtn.disabled = false;
        startBtn.textContent = 'listening';
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            mediaRecorder.onstop = async () => {
                audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioURL = URL.createObjectURL(audioBlob);
                console.log('Audio URL:', audioURL);
                audioBlobList.push(...audioChunks)
                // Clear chunks for the next recording
                audioChunks = [];
            };
            mediaRecorder.start();
            console.log('Audio recording started');
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    });
    sendBtn.addEventListener('click', () => {
        recognition.stop(); // Stop the speech recognition
        startBtn.disabled = false;
        sendBtn.disabled = true;
        if (mediaRecorder) {
            mediaRecorder.stop();
            console.log('Audio recording stopped');
        }
        startBtn.textContent = 'record';
        checkGuess();
    });
    recognition.onresult = (event) => {
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
        console.log('Transcript:', finalTranscript);
        event.results = []
    };
    recognition.onerror = (event) => {
        console.error('Speech recognition error detected: ' + event.error);
    };
    recognition.onend = () => {
        console.log("Recognition on end")
    };
}