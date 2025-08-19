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
    const textContent = currentDate.toLocaleDateString(undefined, options);
    return {
        "title": "வாரம் 1",
        "content": `<p> <h2>வாரம் 1</h2> </br> 
            <h3>முக்கிய அறிவிப்பு</h3>
            <p>இந்த வாரம் நீங்கள் செய்ய வேண்டிய பயிற்சிகள் கீழே உள்ளன:</p>
            <ul>
                <li> உரையாடல் பயிற்சி  1: ஓலைச்சுவடிகள்‌</li>
                <li> கேட்டல்‌ கருத்தறிதல் 1: அன்புடைமை</li>
            </ul>
        
            <!-- Add Due date in Tamil -->
            <h3> இன்று தேதி </h3>
            <div id="date">${textContent}</div> 
            <h3>காலக்கெடு</h3>
            <p>இந்த பயிற்சிகளை முடிக்க கடைசி தேதி: <span id="dueDate">09-25-2025 </span></p>`
    };

}
window.addEventListener("load",async (event) => {
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


