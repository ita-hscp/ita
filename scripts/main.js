window.addEventListener("load", (event) => {
    const tokenValid = sessionStorage.getItem("sessionToken");
    if (tokenValid) {
        const mainPage = document.getElementById("mainPage");
        if (mainPage) {
            mainPage.innerHTML = `<p> <h2>வாரம் 22</h2> </br> <h3> உரையாடல் பயிற்சி :  தமிழர்‌ உணவுகள் </h3>
                <h3> கேட்டல்‌ கருத்தறிதல்‌: 'முல்லா ஒரு காப்பாளர்‌‌'  </h3>
        <h3> Due Date: Feb, 23 2025 </h3>
        </br>
        <h3> குழுத்திட்டப்பணி (தேர்வு 6) - குறும்படம்‌: </h3>
        <h4>வகுப்பில்‌ உள்ள மாணவர்கள்‌ சேர்ந்து ஒரு குறும்படத்தை இயக்க வேண்டும்‌.  <h4>
         <h4> ஆசிரியரிடம்‌ வாரம்‌ 24 அன்று குறும்படத்தைச்‌ சமர்ப்பிக்க வேண்டும்‌ <h4>
        <h3> Due Date: March, 03 2025 </h3>   
    }
}
  });