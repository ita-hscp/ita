
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


window.addEventListener("load", async (event) => {
    const tableBody = document.querySelector("#jsonTable tbody");
    const query = {
        "className": "HSCP1E",
        "week": "ALL",
        "assignmentType": "conversation"
    }
    const jsonData = await getClassReport(query);
    if (jsonData?.report) {
        jsonData.report.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.week}</td>
            <td>${item.assignmentType}</td>
            <td>${item.status}</td>
            <td>${item.score}</td>
            <td>${item.comments}</td>
            <td>${item.completionDate}</td>
            <td>${item.dueDate}</td>
        `;
            tableBody.appendChild(row);
        });
    }
});


async function loadReport() {
    const query = {
        "className": "HSCP1E",
        "week": "17",
        "assignmentType": "conversation"
    }
    const tableBody = document.querySelector("#jsonTable tbody");
    const weekElement = document.getElementById("weekFilter");
    query['week'] = weekElement.options[weekElement.selectedIndex].value
    const assignmentType = document.getElementById("assignmentTypeFilter")
    query['assignmentType'] = assignmentType.options[assignmentType.selectedIndex].value;
    const jsonData = await getClassReport(query);
    if (jsonData?.report) {
        tableBody.innerHTML = "";
        jsonData.report.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.week}</td>
            <td>${item.assignmentType}</td>
            <td>${item.status}</td>
            <td>${item.score}</td>
            <td>${item.comments}</td>
            <td>${item.completionDate}</td>
            <td>${item.dueDate}</td>
            <td><button class="play-btn" id="${item.id}" data-id="${item.id}">▶ Play</button></td>
        `;
            tableBody.appendChild(row);
        });
        addAudio(jsonData.report);
    }
};


async function addAudio(reportData) {
    const audioMap = new Map();
    document.querySelectorAll(".play-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const audioId = this.getAttribute("data-id");
            if (!audioMap.has(audioId)) {
                let audio = new Audio();
                const item = reportData.filter(item => item.id == audioId)[0]
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
                        window.location.href = "https://ita-hscp.github.io/ita/Login"; // Replace '/login' with your actual login URL
                        return;
                    }
                    audioMap.set(audioId, new Audio(url));
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    audio.src = url;
                } catch (error) {
                    console.error("Error fetching audio file:", error);
                    return;
                }

            }
            const audio = audioMap.get(audioId)

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

