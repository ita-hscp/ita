async function mainContent() {
    // const response = await fetch('https://infinite-sands-52519-06605f47cb30.herokuapp.com/mainContent', {
    //     method: 'GET',
    //     headers: {
    //         'Authorization': sessionStorage.getItem('sessionToken'),
    //         'Content-Type': 'application/json'
    //     }
    // });
    // if (response.status === 401) {
    //     // Redirect to login page if not authenticated
    //     window.location.href = "https://ita-hscp.github.io/ita/Login"; // Replace with your actual login URL
    //     return;
    // }
    // if (!response.ok) {
    //     return {}
    // }
    // return response.json();
    setTimeout(() => {
    }, 1000); // Simulate a delay for the main content
    const currentDate = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const textContent = currentDate.toLocaleDateString(undefined, options);
    return {
        "title": "வாரம் 1",
        "content": ` 
            <p>வணக்கம் மாணவர்களே,</p>
            <p>இந்த வாரம் நாம் தமிழ் மொழியில் உரையாடல் மற்றும் கேட்டல்‌ பயிற்சிகளை செய்யப்போகிறோம்.</p>
            <p>உங்கள் பயிற்சிகளை முடிக்க நீங்கள் கீழே உள்ள வாரத்திற்கேற்ப தேர்வு செய்யவும்.</p>
            <p>இந்த வாரம் நீங்கள் செய்ய வேண்டிய பயிற்சிகள் கீழே உள்ளன:</p>
            <ul>
                <li> உரையாடல் பயிற்சி  1: ஓலைச்சுவடிகள்‌</li>
                <li> கேட்டல்‌ கருத்தறிதல் 1: அன்புடைமை</li>
            </ul>
        
            <!-- Add Due date in Tamil -->
            <h3> இன்று தேதி </h3>
            <div id="date">${textContent}</div> 
            <h3>பயிற்சிகள் முடிக்க கடைசி தேதி (Due Date)</h3> <span id="dueDate">09-25-2025 </span>`
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


