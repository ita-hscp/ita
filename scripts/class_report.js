const jsonData = [
    {"id": "User_1", "score": 10, "comments": "", "status": "in progress", "completionDate": "", "dueDate": "2021-08-30", "week": "20", "assignmentType": "", "assignmentId": ""},
    {"id": "User_1", "score": 10, "comments": "", "status": "in progress", "completionDate": "", "dueDate": "2021-08-30", "week": "20", "assignmentType": "", "assignmentId": ""},
    {"id": "User_2", "score": 10, "comments": "Good job", "status": "completed", "completionDate": "2025-02-02T06:18:25.397Z", "dueDate": "2021-08-30", "week": "20", "assignmentType": "conversation", "assignmentId": "643d6a05-0a33-4fb6-971e-5dda1b66098d"}
];

const tableBody = document.querySelector("#jsonTable tbody");

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