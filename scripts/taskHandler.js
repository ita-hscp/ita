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
// Matches by option text, then option value, then by the number inside the text (e.g. "Week 10").
// Returns true when an option was selected.
function preselectExercise(dropdown) {
    const requested = (new URLSearchParams(window.location.search).get("exerciseNumber") || "").trim();
    if (!requested || !dropdown) return false;
    const options = Array.from(dropdown.options);
    const numberIn = s => { const m = String(s).match(/\d+/); return m ? m[0] : null; };
    const match = options.find(o => o.text.trim() === requested)
        || options.find(o => o.value === requested)
        || (numberIn(requested) && options.find(o => numberIn(o.text) === numberIn(requested)));
    if (!match) return false;
    dropdown.value = match.value;
    match.selected = true;
    return true;
}
