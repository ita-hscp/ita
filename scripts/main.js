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
                    link.href = `https://ita-hscp.github.io/ita/${pageName}?&exerciseNumber=${assignment.exerciseNumber}`;
                    link.textContent = assignment.liElement.replace("<li>", "").replace("</li>", "");
                    link.style.textDecoration = "none";
                    link.style.color = "#1209ee";
                    const li = document.createElement("li");
                    li.appendChild(link);
                    ul_main_page.appendChild(li);
                }); 
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
        return;
    }
});