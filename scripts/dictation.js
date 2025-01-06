
async function start() {
    const quizButton=document.getElementById("quiz-start");
    quizButton.textContent ="next"
    await generateQuestion();
}

async function getQuestions(){
    const apiUrl ='https://infinite-sands-52519-06605f47cb30.herokuapp.com/dictations';
     // Fetch the json
     const response = await fetch(apiUrl,{ headers: {
        Authorization: sessionStorage.getItem('sessionToken')
      } });
     if (response.status === 401) {
        // Redirect to login page if not authenticated
        window.location.href = "https://ita-hscp.github.io/ita/Login"; // Replace '/login' with your actual login URL
        return;
      }
     if (!response.ok){
      return {}
     }
     return response.json()
  }

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

        // Generate a random question
        let currentQuestion = null;
        async function generateQuestion() {
            let dictionary=await getQuestions()
            const tamilWords = Object.keys(dictionary);
            const segmenter = new Intl.Segmenter("ta", { granularity: "grapheme" });
            const randomTamilWord = tamilWords[Math.floor(Math.random() * tamilWords.length)];
            const englishMeaning = dictionary[randomTamilWord];
            // Randomly decide the question type
            const questionType = Math.random() < 0.5 ? 1 : 2;

            if (questionType === 1) {
                // Ask for Tamil word from English
                currentQuestion = {
                    question: `What is the Tamil word for "${englishMeaning}"?`,
                    answer: randomTamilWord
                };
                let letters = [...segmenter.segment(randomTamilWord)].map(seg => seg.segment);
                const tamilLetters = [
                    "அ", "ஆ", "இ", "ஈ", "உ", "ஊ", "எ", "ஏ", "ஐ", "ஒ", "ஓ", "ஔ",
                    "க", "ங", "ச", "ஞ", "ட", "ண", "த", "ந", "ப", "ம", "ய", "ர", "ல", "வ", "ழ", "ள", "ற", "ன",
                    "ா", "ி", "ீ", "ு", "ூ", "ெ", "ே", "ை", "ொ", "ோ", "ௌ", "்"
                ];
                for (let i=0;i<5;i++){
                letters.push( tamilLetters[getRandomNumber(0,tamilLetters.length-20)])
            }
            letters=letters.sort(() => Math.random() - 0.5);
            const letterBox = document.getElementById("letterBox");
            letterBox.innerHTML = "";
            letters.forEach(letter => {
                const letterButton = document.createElement("div");
                letterButton.className = "letter";
                letterButton.textContent = letter;
                letterButton.onclick = () => addLetterToInput(letter);
                letterBox.appendChild(letterButton);
            }); 
              // Function to add letter to the input box
        function addLetterToInput(letter) {
            const inputBox = document.getElementById("textInput");
            inputBox.value += letter; // Append the clicked letter to the input box
        }

        // // Function to clear the input box
        // function clearInput() {
        //     const inputBox = document.getElementById("textInput");
        //     inputBox.value = ""; // Clear the input box
        // } 

    } else {
                // Ask for the English meaning of jumbled Tamil word
                const letters = [...segmenter.segment(randomTamilWord)].map(seg => seg.segment);
                // console.log(letters);
                const jumbledWord = letters.sort(() => Math.random() - 0.5).join('');
                currentQuestion = {
                    question: `What is the english meaning of the jumbled Tamil word "${jumbledWord}"?`,
                    answer: englishMeaning
                };
                const letterBox = document.getElementById("letterBox");
                letterBox.innerHTML = "";
    }

             // Tamil letters to display as buttons
            // Display the question
            document.getElementById('question').innerText = currentQuestion.question;
            document.getElementById('result').innerText = ''; // Clear previous result
            document.getElementById('textInput').value = ''; // Clear input field
        }

       
        // Check the user's answer
        function checkAnswer() {
            const userAnswer = document.getElementById('textInput').value.trim();
            const resultElement = document.getElementById('result');
            const noSpaces = currentQuestion.answer.replace(/\s+/g, "");
            if (userAnswer === currentQuestion.answer || userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase() || userAnswer === noSpaces ) {
                resultElement.innerText = 'Correct!';
                resultElement.style.color = 'green';
            } else {
                resultElement.innerText = `Incorrect. The correct answer is "${currentQuestion.answer}".`;
                resultElement.style.color = 'red';
            }
        }

        document.addEventListener("DOMContentLoaded", () => {
            const token = getCookie("sessionToken");
            if (token) {
              console.log("Session Token:", token);
              // Use the token for API calls or authentication
            } else {
              console.log("No session token found.");
            }
          });
          
          function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(";").shift();
            return null;
          }
          