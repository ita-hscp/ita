window.addEventListener("load", (event) => {
    const tokenValid=sessionStorage.getItem("sessionToken");
if(tokenValid){
    const mainPage=document.getElementById("mainPage");
    if(mainPage){
        mainPage.innerHTML=`<p> <h2>வாரம் 20</h2> </br> <h3> உரையாடல் பயிற்சி :  மாதங்கள் </h3>
<h3> கதை சொல்லுதல் :  புறாவும் எறும்பும் </h3>
<h3> Due Date: Feb, 02 2025 </h3>
`
    }
}
  });