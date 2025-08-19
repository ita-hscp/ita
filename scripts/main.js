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
window.addEventListener("load", async (event) => {
    const tokenValid = sessionStorage.getItem("sessionToken");
    if (tokenValid) {

        const mainPage = document.getElementById("mainPage");
        if (mainPage) {
            const dateElement = document.getElementById("date");
            const currentDate = new Date()
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            const textContent = currentDate.toLocaleDateString(undefined, options);
            const content = await mainContent();
            mainPage.innerHTML = `<p> <h2>${content.title}</h2> </br>
                <p>${content.content}</p>`
        }
    }
});


