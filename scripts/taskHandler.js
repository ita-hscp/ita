async function getAllPendingTasks(type) {
    const apiUrl = 'https://infinite-sands-52519-06605f47cb30.herokuapp.com/tasks/assigned?type=' + type;
    // Fetch the json
    const response = await fetch(apiUrl, {
        headers: {
            Authorization: sessionStorage.getItem('sessionToken')
        }
    });
    if (response.status === 401) {
        // Redirect to login page if not authenticated
        window.location.href = "https://ita-hscp.github.io/ita/Login";
        return;
    }
    if (!response.ok) {
        return [];
    }
    return response.json();
}

// Pre-selects the exercise given by ?exerciseNumber=... (set by the main page links).
function preselectExercise(dropdown) {
    const requested = new URLSearchParams(window.location.search).get("exerciseNumber");
    if (!requested || !dropdown) return;
    const match = Array.from(dropdown.options).find(o => o.text.trim() === requested.trim());
    if (match) match.selected = true;
}
