window.addEventListener("load", (event) => {
    const tokenValid = sessionStorage.getItem("sessionToken");
    if (tokenValid) {
        const mainPage = document.getElementById("mainPage");
        if (mainPage) {
            mainPage.innerHTML = `<p> <h2>வாரம் 26</h2> </br> <h3> உரையாடல் பயிற்சி : பழங்கள்‌‌ (Week 25)  </h3>
                <h3> கதை சொல்லுதல் பயிற்சி: 25 </h3>
        <h3> Due Date: March, 23 2025 </h3>
        </br> `
        }
    }
});