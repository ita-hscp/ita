window.addEventListener("load", (event) => {
    const tokenValid = sessionStorage.getItem("sessionToken");
    if (tokenValid) {
        const mainPage = document.getElementById("mainPage");
        if (mainPage) {
            mainPage.innerHTML = `<p> <h2>வாரம் 30</h2> </br> <h3> உரையாடல் பயிற்சி : வீட்டு விலங்குகள் , காட்டு விலங்குகள் (Week 30)  </h3>
        <h3> Today's Date </h3>
  <div id="date"></div>

  <script>
    const dateElement = document.getElementById("date");
    const currentDate = new Date();

    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };

    dateElement.textContent = currentDate.toLocaleDateString(undefined, options); 
        </br> `
        }
    }
});
