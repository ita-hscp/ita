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
        })
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
    const roles = sessionStorage.getItem("allowedRoles") || [];
    if (tokenValid) {
        const mainPage = document.getElementById("mainPage");
        if (mainPage) {
            mainPage.innerHTML = `<p> <h2>உலக தமிழ் கல்விக்கழகம் - தமிழ் மொழி பயிற்சிகள்</h2> </br>`;
            get_main_page_content_template();
        }
        return;
    }

    if (roles.includes("teacher")) {
        const mainPage = document.getElementById("mainPage");
        if (mainPage) {
            const content = await mainContent();
            mainPage.innerHTML = `<p> <h2>${content.title}</h2> </br>
                <p>${content.content}</p>`
        }
    }
});