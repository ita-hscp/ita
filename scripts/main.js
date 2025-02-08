window.addEventListener("load", (event) => {
    const tokenValid=sessionStorage.getItem("sessionToken");
if(tokenValid){
    const mainPage=document.getElementById("mainPage");
    if(mainPage){
        mainPage.innerHTML=`<p> <h2>வாரம் 20</h2> </br> <h3> உரையாடல் பயிற்சி :  விழாக்கள்‌ </h3>
                <h3> கேட்டல்‌ கருத்தறிதல்‌: 'ஆயிரம்‌ நாயணங்கள்‌' கதையை கீழே உள்ள உள்ள youtube link ல்‌ கேட்கவும்‌. </h3>
                <a href="https://www.youtube.com/watch?v=Mt7ah_uU03M">ஆயிரம்‌ நாயணங்கள்</a>
        <h3> Due Date: Feb, 09 2025 </h3>
        </br>
        <h3> குழுத்திட்டப்பணி (தேர்வு 6) - குறும்படம்‌: </h3>
        <h4>வகுப்பில்‌ உள்ள மாணவர்கள்‌ சேர்ந்து ஒரு குறும்படத்தை இயக்க வேண்டும்‌.  <h4>
         <h4> ஆசிரியரிடம்‌ வாரம்‌ 24 அன்று குறும்படத்தைச்‌ சமர்ப்பிக்க வேண்டும்‌ <h4>
        <h3> Due Date: Feb, 24 2025 </h3>   
`
    }
}
  });