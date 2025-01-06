function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}
// Allow the drop on the target drop-zone
function allowDrop(event) {
    event.preventDefault();
}
// Handle the drop event
function drop(event, blankId) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);

    // Find the corresponding drop zone
    var dropZone = document.getElementById(blankId);
    // Set the text of the drop zone to the dragged element's text
    dropZone.innerHTML = draggedElement.innerHTML;
    dropZone.style.backgroundColor = '#e0f7fa';  // Change background color after drop
    
    // // Disable further dragging of the dropped element
    // draggedElement.setAttribute("draggable", "false");

    // Check if both blanks are filled correctly
    checkAnswers();
}

// Check the correctness of the answers
function checkAnswers() {
    const message = document.getElementById("message");
    const blank1 = document.getElementById("blank1");
    const question = document.getElementById("question");
    const answerFromApi=question.getAttribute("ans")
    if (blank1.innerHTML === answerFromApi) {
        message.textContent = "Correct! All answers are right.";
        message.style.color = "green";
    } else {
        message.textContent = "Keep trying!";
        message.style.color = "red";
    }
}

// Attach the drop functionality to the blanks

async function getQuestions(){
    const apiUrl ='https://infinite-sands-52519-06605f47cb30.herokuapp.com/questions';
     // Fetch the json
     const response = await fetch(apiUrl,{ headers: {
        Authorization: sessionStorage.getItem('sessionToken')
      }});
     if (response.status === 401) {
        // Redirect to login page if not authenticated
        window.location.href = "https://ita-hscp.github.io/ita/Login"; // Replace '/login' with your actual login URL
      }
     if (!response.ok){
      return {}
     }
     return response.json()
  }
  


async function onNext(){
    const question = document.getElementById("question");
    let questionJson={
         "questionSeg1":"ஒரு பள்ளியை வழிநடத்த தலைமை ஆசிரியருக்கு சிறந்த",
         "questionSeg2":"திறன் வேண்டும்",
        "choice1": "மேலான்மை",
        "choice2": "மேலாண்மை",
        "id": "234",
        "ans": "மேலாண்மை"
    }
    const questions=await getQuestions();
    questionJson= questions ?questions:questionJson;
    question.setAttribute("data-id",questionJson.id);
    question.setAttribute("ans",questionJson.ans);
    question.innerHTML=`<p>${questionJson.questionSeg1}  <span class="drop-zone" id="blank1">_____</span>.</p> ${questionJson.questionSeg2} `

    document.getElementById("blank1").addEventListener("dragover", allowDrop);
    document.getElementById("blank1").addEventListener("drop", function(event) {
        drop(event, "blank1");
    });

    const answer1 = document.getElementById("answer1");
    const answer2 = document.getElementById("answer2");
    answer1.innerHTML=questionJson.choice1;
    answer2.innerHTML=questionJson.choice2;   
}

function onLoad(){
    const question = document.getElementById("question");
    const questionJson={
         "questionSeg1":"ஒரு பள்ளியை வழிநடத்த தலைமை ஆசிரியருக்கு சிறந்த",
         "questionSeg2":"திறன் வேண்டும்",
        "choice1": "மேலாண்மை",
        "choice2": "மேலான்மை",
        "id": "1234",
        "ans": "மேலாண்மை"
    }
    question.setAttribute("data-id",questionJson.id);
    question.setAttribute("ans",questionJson.ans);
    question.innerHTML=`<p>${questionJson.questionSeg1}  <span class="drop-zone" id="blank1">_____</span>.</p> ${questionJson.questionSeg2} `

    document.getElementById("blank1").addEventListener("dragover", allowDrop);
    document.getElementById("blank1").addEventListener("drop", function(event) {
        drop(event, "blank1");
    });

    const answer1 = document.getElementById("answer1");
    const answer2 = document.getElementById("answer2");
    answer1.innerHTML=questionJson.choice1;
    answer2.innerHTML=questionJson.choice2;   
}
onLoad();

