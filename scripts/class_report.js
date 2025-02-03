
async function getClassReport() {
    const query = {
        "className": "HSCP1E",
        "week": "20",
        "assignmentType": "conversation"
    }
    const apiUrl = 'https://infinite-sands-52519-06605f47cb30.herokuapp.com/assignment/report';
    // Fetch the json
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': sessionStorage.getItem('sessionToken')
        },
        body: JSON.stringify(query)
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


window.addEventListener("load",async (event)=>{
    const tableBody = document.querySelector("#jsonTable tbody");
    const jsonData = await getClassReport();
    jsonData.forEach(item => {
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
});

