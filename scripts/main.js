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
    fetch('https://infinite-sands-52519-06605f47cb30.herokuapp.com/assignments_by_user', {
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
            ul_main_page.innerHTML = "";
            data.assignments.forEach(assignment => {
                const li = document.createElement("li");
            });
        })
        .catch(error => {
            console.error("Error fetching assignments:", error);
        });
}


async function get_main_page_content_template() {
    const response = await fetch('https://infinite-sands-52519-06605f47cb30.herokuapp.com/main_page_content_template', {
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
    return response.json();
}

window.addEventListener("load", async (event) => {
    const tokenValid = sessionStorage.getItem("sessionToken");
    const roles = sessionStorage.getItem("allowedRoles") || [];
    if (roles.includes("Teacher")) {
        const mainPage = document.getElementById("mainPage");
        if (mainPage) {
            const content = await get_main_page_content_template();
            mainPage.innerHTML = `<p> <h2>${content.title}</h2> </br>
                <p>${content.content}</p>`
        }
        fetchAssignments();
        return;
    }

    if (tokenValid) {
        const mainPage = document.getElementById("mainPage");
        if (mainPage) {
            const content = await mainContent();
            mainPage.innerHTML = `<p> <h2>${content.title}</h2> </br>
                <p>${content.content}</p>`
        }
    }
});


