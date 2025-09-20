const mapping = {
    "tamil_listening_2": {"role": "HSCP 2", "title": "கேட்டல்‌ கருத்தறிதல் பயிற்சி"},
    "tamil_conversation_2": {"role": "HSCP 2", "title": "உரையாடல் பயிற்சி"},
    "tamil_story_telling_2": {"role": "HSCP 2", "title": "கதை சொல்லுதல் பயிற்சி"},
    "tamil_topic_2": {"role": "HSCP 2", "title": "தலைப்பு பயிற்சி"},
    "tamil_listening": {"role": "HSCP 1", "title": "கேட்டல்‌ கருத்தறிதல் பயிற்சி"},
    "tamil_conversation": {"role": "HSCP 1", "title": "உரையாடல் பயிற்சி"},
    "tamil_story_telling": {"role": "HSCP 1", "title": "கதை சொல்லுதல் பயிற்சி"},
    "tamil_topic": {"role": "HSCP 1", "title": "தலைப்பு பயிற்சி"},
    "tamil_listening_3": {"role": "HSCP 3", "title": "கேட்டல்‌ கருத்தறிதல் பயிற்சி"},
    "tamil_conversation_3": {"role": "HSCP 3", "title": "உரையாடல் பயிற்சி"},
    "tamil_story_telling_3": {"role": "HSCP 3", "title": "கதை சொல்லுதல் பயிற்சி"},
    "tamil_topic_3": {"role": "HSCP 3", "title": "தலைப்பு பயிற்சி"},
    "tamil_listening_4": {"role": "HSCP 4", "title": "கேட்டல்‌ கருத்தறிதல் பயிற்சி"},
    "tamil_conversation_4": {"role": "HSCP 4", "title": "உரையாடல் பயிற்சி"},
    "tamil_story_telling_4": {"role": "HSCP 4", "title": "கதை சொல்லுதல் பயிற்சி"},
    "tamil_topic_4": {"role": "HSCP 4", "title": "தலைப்பு பயிற்சி"},
};



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
            ul_main_page.innerHTML = data.assignments;
            //<ul id="main-page-assignments"><li>கேட்டல்‌ கருத்தறிதல் பயிற்சி 4 : வாஸ்கோடகாமா - Status: Not Completed</li><li>கேட்டல்‌ கருத்தறிதல் பயிற்சி 3 : கொல்லாமை - Status: Not Completed</li></ul>
            // make the list clickable links to assignment page
            const roles = sessionStorage.getItem("allowedRoles") || [];
            if (roles.includes("Teacher")) {
                const assignmentItems = document.querySelectorAll("#main-page-assignments li");
                assignmentItems.forEach(item => {
                    const text = item.textContent;
                    const parts = text.split(" : ");
                    if (parts.length === 2) {
                        const link = document.createElement("a");
                        pageName= parts[0].toLowerCase().replace(/ /g, "_").replace(/பயிற்சி/g, "").trim();
                        role = roles.includes("HSCP 4") ? "HSCP 4" : roles.includes("HSCP 3") ? "HSCP 3" : roles.includes("HSCP 2") ? "HSCP 2" : "HSCP 1";
               
                        mapping.forEach((value, key) => {
                            if (value.title === pageName.trim() && value.role === role) {
                                pageName = key;
                            }
                        });
                        link.href = `https://ita-hscp.github.io/ita/${pageName}?assignment=` + encodeURIComponent(parts[0]);
                        link.textContent = parts[0] + " - " + parts[1];
                        item.innerHTML = '';
                        item.appendChild(link);
                    }
                }); 
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