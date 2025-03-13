window.addEventListener("load", (event) => {
    const tokenValid = sessionStorage.getItem("sessionToken");
    if (tokenValid) {
        const mainPage = document.getElementById("mainPage");
        if (mainPage) {
            mainPage.innerHTML = `<p> <h2>வாரம் 25</h2> </br> <h3> உரையாடல் பயிற்சி : உடல்‌ உறுப்புகள்‌ மற்றும்‌ அதன்‌ பயன் (Week 24)  </h3>
                <h3> கதை சொல்லுதல் பயிற்சி: 24  </h3>
        <h3> Due Date: March, 16 2025 </h3>
        </br> `
        }
    }
});