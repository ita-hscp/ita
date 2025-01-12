const { ElectraForQuestionAnswering } = require("@huggingface/transformers");

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
    if (words.length !== 0) {    
    let dictionary = await getQuestions()
    const tamilWords = Object.keys(dictionary);
    const randomTamilWord = tamilWords[Math.floor(Math.random() * tamilWords.length)];
    currentWord=randomTamilWord;
     letters = [...segmenter.segment(randomTamilWord)].map(seg => seg.segment);
    }else{
        letters = [...segmenter.segment(currentWord)].map(seg => seg.segment);
    }
    letters = letters.sort(() => Math.random() - 0.5);
    return letters;
}
function displayJumbledWord() {
    const scrollingContainer = document.getElementById("scrollingContainer");
    scrollingContainer.innerHTML = "";
    for (let i = 0; i < 10; i++) {
        const jumbledWord = getSuffledWord();
        for (const letter of jumbledWord) {
            const letterBox = document.createElement("div");
            letterBox.className = "jumbled-box";
            letterBox.textContent = letter;
            scrollingContainer.appendChild(letterBox);
        }
    }
}

function checkGuess() {
    const userInput = document.getElementById("userInput").value.toUpperCase();
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
    const newWordInput = document.getElementById("newWord").value.toUpperCase();
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