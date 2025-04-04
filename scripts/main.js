window.addEventListener("load", (event) => {
    const tokenValid = sessionStorage.getItem("sessionToken");
    if (tokenValid) {
        const mainPage = document.getElementById("mainPage");
        if (mainPage) {
            mainPage.innerHTML = `<p> <h2>வாரம் 29</h2> </br> <h3> உரையாடல் பயிற்சி : உழவர்‌ சந்தை (Week 29)  </h3>
                <h3> கதை சொல்லுதல் பயிற்சி: 29 </h3>
        <h3> Due Date: Apr, 6 2025 </h3>
        </br> `
        }
    }
});