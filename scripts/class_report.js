
const modal = document.getElementById("feedbackModal");
const modalScore = document.getElementById("modalScore");
const modalComments = document.getElementById("modalComments");
const submitFeedbackBtn = document.getElementById("submitFeedback");
const closeModalBtn = document.getElementById("closeModal");
const audioMap = new Map();
let selectedIndex = null;
const tableBody = document.querySelector("#jsonTable tbody");
async function getClassReport(reportQuery) {
    const apiUrl = 'https://infinite-sands-52519-06605f47cb30.herokuapp.com/assignment/report';
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
let sampleData = [];


async function loadReport() {
    const query = {
        "className": "HSCP1E"
    }
    const tableBody = document.querySelector("#jsonTable tbody");
    const weekElement = document.getElementById("weekFilter");
    query['week'] = weekElement.options[weekElement.selectedIndex].value
    const assignmentType = document.getElementById("assignmentTypeFilter")
    query['assignmentType'] = assignmentType.options[assignmentType.selectedIndex].value;
    const jsonData = await getClassReport(query);
    if (jsonData?.report) {
        sampleData = jsonData.report;
        renderTableRows(jsonData.report)
        addAudio(jsonData.report);
    }
};

function renderTableRows(data) {
    const tableBody = document.querySelector("#jsonTable tbody");
    tableBody.innerHTML = "";
    data.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.week}</td>
            <td>${item.assignmentType}</td>
            <td>${item.status}</td>
            <td class="score">${item.score}</td>
            <td class="comments">${item.comments}</td>
            <td>${item.completionDate}</td>
            <td><button class="play-btn" id="${item.id}" data-id="${item.assignmentId}" data-index="${index}">▶ Play</button></td>
            <td><button class="feedback-btn" data-index="${index}">Feedback</button></td>
        `;
        tableBody.appendChild(row);
    });
}

async function addAudio(reportData) {
    document.querySelectorAll(".play-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const audioId = this.getAttribute("data-id");
            const index = this.getAttribute("data-index");
            let audio = audioMap.get(audioId);
            if (!audio) {
                const item = reportData.filter(item => item.id == audioId)[0]
                const response=await getAudioFromBackEnd(item);
                if(response.redirect){
                    window.location.href = response.url;
                    return;
                }
                if(response.audioFound){
                    audio=response.audio;
                    audioMap.set(audioId,audio);
                    showModal(index);
                }

            }

            // Play or pause the audio
            if (audio.paused) {
                audio.play();
                this.textContent = "⏸ Pause";

                // Pause all other audios
                document.querySelectorAll(".play-btn").forEach(btn => {
                    if (btn !== this) btn.textContent = "▶ Play";
                });
                // Reset button text when audio ends
                audio.onended = () => {
                    this.textContent = "▶ Play";
                };
            } else {
                audio.pause();
                this.textContent = "▶ Play";
            }
        });
    });
}

async function getAudioFromBackEnd(item){
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
            // window.location.href =  // Replace '/login' with your actual login URL
            return {redirect: true, url:"https://ita-hscp.github.io/ita/Login"};
        }
        let audio = new Audio();
/* The line `audioMap.set(audioId, audio);` is adding a key-value pair to a Map data structure named
`audioMap`. In this case, it is associating the `audioId` as the key and the `audio` object as the
corresponding value in the map. This allows for easy retrieval and storage of audio objects based on
their unique `audioId`. */
        audioMap.set(audioId, audio);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        audio.src = url;
        return {audioFound:false,audio:audio,redirect: false}
    } catch (error) {
        console.error("Error fetching audio file:", error);
    }
    return  {audioFound:false,redirect: false};
}

async function saveReport(){
    const tableBody = document.querySelector("#jsonTable tbody");
    const rows = tableBody.querySelectorAll("tr");
    const report = [];
    rows.forEach((row,index) => {
        const cells = row.querySelectorAll("td");
        const item = {
            id:  sampleData[index].assignmentId,
            userId:  cells[0].textContent,
            week: cells[1].textContent,
            score: cells[4].textContent,
            comments: cells[5].textContent,

        };
        report.push(item);
    });
    const query = {
        "className": "HSCP1E",
        "report": report
    }
    const response = await fetch('https://infinite-sands-52519-06605f47cb30.herokuapp.com/assignment/save', {
        method: 'POST',
        headers: {
            'Authorization': sessionStorage.getItem('sessionToken'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    });
    if (response.status === 401) {
        // Redirect to login page if not authenticated
        window.location.href = "https://ita-hscp.github.io/ita/Login"; // Replace '/login' with your actual login URL
        return;
    }
    if (response.ok) {
        alert("Report saved successfully");
    } else {
        alert("Error saving report");
    }
}



// Show Modal
function showModal(index) {
    selectedIndex = index;
    modal.style.display = "block";
}

// Close Modal
function closeModal() {
    modal.style.display = "none";
    modalScore.value = "";
    modalComments.value = "";
}

// Handle Feedback Button Click
tableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("feedback-btn")) {
        const index = event.target.getAttribute("data-index");
        showModal(index);
    }
});

// Submit Feedback
submitFeedbackBtn.addEventListener("click", function () {
    if (selectedIndex !== null) {
        sampleData[selectedIndex].score = modalScore.value;
        sampleData[selectedIndex].comments = modalComments.value;
        renderTableRows(sampleData);
        addAudio(sampleData);
        closeModal();
    }
});

// Close Modal on Button Click
closeModalBtn.addEventListener("click", closeModal);




