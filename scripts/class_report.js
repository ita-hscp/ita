
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
    const week = document.getElementById("weekFilter").getValue;
    const assignmentType = document.getElementById("assignmentTypeFilter").getValue;
    query['week'] = week;
    query['assignmentType'] = assignmentType;
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
};

