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
