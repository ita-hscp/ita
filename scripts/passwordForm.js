const saveButton = document.getElementById("saveButton");
const passwordModal = document.getElementById("passwordModal");
const overlay = document.getElementById("overlay");
const cancelButton = document.getElementById("cancelButton");
const submitButton = document.getElementById("submitButton");

// Show the modal when the Save button is clicked
saveButton.addEventListener("click", () => {
    passwordModal.style.display = "block";
    overlay.style.display = "block";
});

// Hide the modal when the Cancel button is clicked
cancelButton.addEventListener("click", () => {
    passwordModal.style.display = "none";
    overlay.style.display = "none";
});

// Optional: Hide the modal when clicking outside it
overlay.addEventListener("click", () => {
    passwordModal.style.display = "none";
    overlay.style.display = "none";
});

// Form submission
submitButton.addEventListener("click", (event) => {
    const passwordInput = document.getElementById("passwordInput").value;
    if (!passwordInput) {
        alert("Please enter your password.");
        event.preventDefault(); // Stop form submission
    }
    const chatBox = document.getElementById("chatBox");

    // Get all messages inside the chat box
    const messages = chatBox.querySelectorAll(".message");

    // Optional: Store all message values in an array
    const messageArray = Array.from(messages).map(message => message.textContent.trim());
    console.log(messageArray);
    fetch('https://infinite-sands-52519-06605f47cb30.herokuapp.com/save_work', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('sessionToken')
        },
        body: JSON.stringify({ "password": passwordInput , "content": messageArray, 'work': "conversation" })
    })
        .then( response => {
            if (response.status === 401) {
              // Handle 401 Unauthorized - user is not authenticated
              console.log('Unauthorized! Redirecting to login...');
              // Redirect to login page (or handle error accordingly)
              window.location.href ="https://ita-hscp.github.io/ita/Login"; // Redirect to login page
              return; // Stop further execution if 401 is encountered
            }
            // If the status is OK or other success code, handle it
            return response.json();  // Parse the JSON response
          })
        .then(data => {
            alert('Work saved successfully!  ' +(data.id ? "id :"+data.id : ""));
            document.getElementById('passwordModal').style.display = 'none';
        })
        .catch(error => {
            alert('Failed to save work.');
        });
});