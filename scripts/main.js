window.addEventListener("load", (event) => {
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
            mainPage.innerHTML = `<p> <h2>வாரம் 1</h2> </br> 
            <h3>முக்கிய அறிவிப்பு</h3>
            <p>இந்த வாரம் நீங்கள் செய்ய வேண்டிய பயிற்சிகள் கீழே உள்ளன:</p>
            <ul>
                <li> உரையாடல் பயிற்சி  1: ஓலைச்சுவடிகள்‌</li>
                <li> கேட்டல்‌ கருத்தறிதல் 2: அன்புடைமை</li>
            </ul>
        
            <!-- Add Due date in Tamil -->
            <h3> இன்று தேதி </h3>
            <div id="date">${textContent}</div> 
            <h3>காலக்கெடு</h3>
            <p>இந்த பயிற்சிகளை முடிக்க கடைசி தேதி: <span id="dueDate">09-25-2025 </span></p>
            `;
        }
    }
});
