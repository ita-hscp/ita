const mapping = [
    { "id": "tamil_listening_2", "role": "HSCP 2", "title": "கேட்டல்‌ கருத்தறிதல் பயிற்சி" },
    { "id": "tamil_conversation_2", "role": "HSCP 2", "title": "உரையாடல் பயிற்சி" },
    { "id": "tamil_story_telling_2", "role": "HSCP 2", "title": "கதை சொல்லுதல் பயிற்சி" },
    { "id": "tamil_topic_2", "role": "HSCP 2", "title": "தலைப்பு பயிற்சி" },
    { "id": "tamil_listening", "role": "HSCP 1", "title": "கேட்டல்‌ கருத்தறிதல் பயிற்சி" },
    { "id": "tamil_conversation", "role": "HSCP 1", "title": "உரையாடல் பயிற்சி" },
    { "id": "tamil_story_telling", "role": "HSCP 1", "title": "கதை சொல்லுதல் பயிற்சி" },
    { "id": "tamil_topic", "role": "HSCP 1", "title": "தலைப்பு பயிற்சி" },
    { "id": "tamil_listening_3", "role": "HSCP 3", "title": "கேட்டல்‌ கருத்தறிதல் பயிற்சி" },
    { "id": "tamil_conversation_3", "role": "HSCP 3", "title": "உரையாடல் பயிற்சி" },
    { "id": "tamil_story_telling_3", "role": "HSCP 3", "title": "கதை சொல்லுதல் பயிற்சி" },
    { "id": "tamil_topic_3", "role": "HSCP 3", "title": "தலைப்பு பயிற்சி" },
    { "id": "tamil_listening_4", "role": "HSCP 4", "title": "கேட்டல்‌ கருத்தறிதல் பயிற்சி" },
    { "id": "tamil_conversation_4", "role": "HSCP 4", "title": "உரையாடல் பயிற்சி" },
    { "id": "tamil_story_telling_4", "role": "HSCP 4", "title": "கதை சொல்லுதல் பயிற்சி" },
    { "id": "tamil_topic_4", "role": "HSCP 4", "title": "தலைப்பு பயிற்சி" }
];



async function mainContent() {
    const response = await fetch('https://infinite-sands-52519-06605f47cb30.herokuapp.com/main_page_content', {
        method: 'GET',
        headers: {
            'Authorization': sessionStorage.getItem('sessionToken'),
            'Content-Type': 'application/json'
        }
    });
    if (response.status === 401) {
        // Redirect to login page if not authenticated
        window.location.href = "https://ita-hscp.github.io/ita/Login"; // Replace with your actual login URL
        return;
    }
    if (!response.ok) {
        return {}
    }
    const responseData = await response.json();

    return {
        "title": responseData.title || "உலக தமிழ் கல்விக்கழகம் - தமிழ் மொழி பயிற்சிகள்",
        "content": responseData.content || "இப்போது உள்ளடக்கம் கிடைக்கவில்லை."
    };
}
// Make this function based on callback  remove await
function fetchAssignments(callback) {
    fetch('https://infinite-sands-52519-06605f47cb30.herokuapp.com/assignment_by_user', {
        method: 'GET',
        headers: {
            'Authorization': sessionStorage.getItem('sessionToken'),
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.status === 401) {
                // Redirect to login page if not authenticated
                window.location.href = "https://ita-hscp.github.io/ita/Login"; // Replace with your actual login URL
                return;
            }
            if (!response.ok) {
                return [];
            }
            return response.json();
        })
        .then(data => {
            const ul_main_page = document.getElementById("main-page-assignments");
            // make the list clickable links to assignment page
            const roles = sessionStorage.getItem("allowedRoles") || [];
            if (data.detailedAssignments && data.detailedAssignments.length > 0) {
                const assignmentItems = document.querySelectorAll("#main-page-assignments li");
                detailedAssignments = data.detailedAssignments || [];
                let pageName = "";
                let role = "";
                // Clear existing list
                ul_main_page.innerHTML =`<ul id="main-page-assignments"></ul>`;
                role = roles.split(",").filter(r => r.startsWith("HSCP"))[0]  || "HSCP 1";
                detailedAssignments.forEach(assignment => {
                    const mappingItem = mapping.find(m => m.title === assignment.type && m.role === role);
                    if (mappingItem) {
                        pageName = mappingItem.id;
                        role = mappingItem.role;
                    } else {
                        // Default to HSCP 1 if no match found
                        pageName = "tamil_listening";
                        role = "HSCP 1";
                    }
                    // console.log("Mapping Item:", mappingItem, assignment);
                    const link = document.createElement("a");
                    link.href = `https://ita-hscp.github.io/ita/${pageName}?exerciseNumber=${assignment.exerciseNumber}`;
                    link.textContent = assignment.liElement.replace("<li>", "").replace("</li>", "");
                    link.style.textDecoration = "none";
                    link.style.color = "#1209ee";
                    const li = document.createElement("li");
                    li.appendChild(link);
                    ul_main_page.appendChild(li);
                });
                // For any queries/discussion, please use chat in <a href="https://ita-hscp.github.io/ita/tamil_discussion_2/">this link</a> in Tamil.
                // Discussion week comes from the assignments (e.g. "வாரம் 10" -> 10)
                let discussionWeek = null;
                detailedAssignments.forEach(a => {
                    if (discussionWeek) return;
                    const m = (a.liElement || "").match(/வாரம்\s*(\d+)/);
                    if (m) discussionWeek = m[1];
                    else if (a.week) discussionWeek = String(a.week);
                });
                const discussionUrl = "https://ita-hscp.github.io/ita/tamil_discussion_2/" +
                    (discussionWeek ? `?exerciseNumber=${encodeURIComponent(discussionWeek)}` : "");
                const queryInfo = document.createElement("li");
                queryInfo.innerHTML = `ஏதேனும் சந்தேகம்/விவாதங்களுக்கு, தயவுசெய்து இந்த <a style="color: #1209ee;" href="${discussionUrl}">இணைப்பை பயன்படுத்தவும்.</a>`;
                ul_main_page.appendChild(queryInfo);
            }else {
                ul_main_page.innerHTML = data.assignments || "<li>No assignments available.</li>";
            }
        }
        )
        .catch(error => {
            console.error("Error fetching assignments:", error);
        });
}

// Fetch main page content template for teachers
function get_main_page_content_template() {
    const response = fetch('https://infinite-sands-52519-06605f47cb30.herokuapp.com/main_page_content_template', {
        method: 'GET',
        headers: {
            'Authorization': sessionStorage.getItem('sessionToken'),
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.status === 401) {
                // Redirect to login page if not authenticated
                window.location.href = "https://ita-hscp.github.io/ita/Login"; // Replace with your actual login URL
                return;
            }
            if (!response.ok) {
                return {}
            }
            const mainPage = document.getElementById("mainPage");
            response.json().then(content => {
                if (mainPage) {
                    mainPage.innerHTML = `<p> <h2>${content.title}</h2> </br>
                <p>${content.content}</p>`
                    fetchAssignments();
                }
            })
        })
        .catch(error => {
            console.error("Error fetching main page content template:", error);
            const mainPage = document.getElementById("mainPage");
            if (mainPage) {
                mainPage.innerHTML = `<p> <h2>உலக தமிழ் கல்விக்கழகம் - தமிழ் மொழி பயிற்சிகள்</h2> </br>
                <p>இப்போது உள்ளடக்கம் கிடைக்கவில்லை.</p>`
            }
        });
    return response;
}

window.addEventListener("load", async (event) => {
    const tokenValid = sessionStorage.getItem("sessionToken");
    if (tokenValid) {
        const mainPage = document.getElementById("mainPage");
        if (mainPage) {
            mainPage.innerHTML = `<p> <h2>உலக தமிழ் கல்விக்கழகம் - தமிழ் மொழி பயிற்சிகள்</h2> </br>`;
            get_main_page_content_template();
        }
        setupPendingWork();
        return;
    }
});

// ---- Pending work from the past (students only, lazy loaded) ----

function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}

// Teacher ids start with T_; anything else is treated as a student.
function isStudent() {
    const userName = sessionStorage.getItem("userName");
    return !!userName && !userName.toUpperCase().startsWith("T_");
}

const COMPLETED_STATUSES = ["completed", "complete", "submitted", "graded", "done"];

function isBlank(value) {
    return value == null || ["", "none", "null", "undefined", "n/a", "-"].includes(String(value).trim().toLowerCase());
}

// Accepts ISO dates and dd-mm-yyyy / dd/mm/yyyy; returns null when unparsable.
function parseDueDate(value) {
    if (isBlank(value)) return null;
    const text = String(value).trim();
    const dmy = text.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})/);
    const date = dmy ? new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1])) : new Date(text);
    return isNaN(date) ? null : date;
}

function isPendingFromPast(item) {
    const status = String(item.status || "").trim().toLowerCase();
    if (!isBlank(item.completionDate) || COMPLETED_STATUSES.includes(status)) return false;
    const due = parseDueDate(item.dueDate);
    if (!due) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
}

function showPendingMessage(container, text) {
    container.innerHTML = `<p style="font-size:13px;color:#666;">${escapeHtml(text)}</p>`;
}

function setupPendingWork() {
    const container = document.getElementById("pendingWork");
    if (!container) return;
    if (!sessionStorage.getItem("userName")) {
        // Sessions created before this feature have no stored user id
        console.log("Pending work skipped: no userName in session. Log in again.");
        showPendingMessage(container, "Please log out and log in again to see your pending work.");
        return;
    }
    if (!isStudent()) return;
    showPendingMessage(container, "Checking pending work...");
    // Lazy load: fetch only when the section scrolls into view
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            if (entries.some(e => e.isIntersecting)) {
                observer.disconnect();
                loadPendingWork(container);
            }
        }, { rootMargin: "100px" });
        observer.observe(container);
    } else {
        loadPendingWork(container);
    }
}

async function loadPendingWork(container) {
    try {
        const response = await fetch('https://infinite-sands-52519-06605f47cb30.herokuapp.com/assignment/student', {
            method: 'POST',
            headers: {
                'Authorization': sessionStorage.getItem('sessionToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        if (response.status === 401) {
            window.location.href = "https://ita-hscp.github.io/ita/Login";
            return;
        }
        if (!response.ok) throw new Error("HTTP " + response.status);
        const data = await response.json();
        const report = Array.isArray(data) ? data : (data.report || []);
        console.log("Pending work: report items", report.length, report);
        const pending = report.filter(isPendingFromPast);
        if (pending.length === 0) {
            showPendingMessage(container, "No pending work from the past.");
            return;
        }
        pending.sort((a, b) => parseDueDate(a.dueDate) - parseDueDate(b.dueDate));
        const rows = pending.map(item => `
            <tr>
                <td>${escapeHtml(item.week)}</td>
                <td>${escapeHtml(item.assignmentType)}</td>
                <td>${escapeHtml(item.dueDate)}</td>
                <td>${escapeHtml(item.status)}</td>
            </tr>`).join("");
        container.innerHTML = `
            <h3 style="font-size:16px;">நிலுவையில் உள்ள பணிகள் (Pending work)</h3>
            <table style="font-size:13px;">
                <thead><tr><th>Week</th><th>Type</th><th>Due</th><th>Status</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>`;
    } catch (error) {
        console.error("Error loading pending work:", error);
        showPendingMessage(container, "Could not load pending work. Please try again later.");
    }
}
