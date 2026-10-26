
function tracker(){
 const xhr = new XMLHttpRequest();

      // Configure it: GET-request for the URL
      xhr.open('GET', 'https://infinite-sands-52519-06605f47cb30.herokuapp.com/home', true);

      // Set up a callback function to handle the response
      xhr.onload = function () {
        if (xhr.status === 200) {
          // Parse the response and display it
          const response = JSON.parse(xhr.responseText);
          const trackerElement=document.getElementById('tracker');
          if(trackerElement){
          trackerElement.innerHTML = `
            <p>Page Vist: ${response.count}</p>
          `;
          }
        } else {
          // Handle errors
          const trackerElement=document.getElementById('tracker');
          if(trackerElement){}
          trackerElement.textContent = 'Error fetching data.';
        }
      };

      // Handle network errors
      xhr.onerror = function () {
        document.getElementById('tracker').textContent = 'Network error occurred.';
      };

      // Send the request
      xhr.send();
}


// Shows the upload result inline (below the save button) instead of an alert popup.
function showSaveStatus(anchor, ok, text) {
    let box = document.getElementById('saveStatus');
    if (!box) {
        box = document.createElement('div');
        box.id = 'saveStatus';
        box.setAttribute('role', 'status');
        box.style.cssText = 'margin-top:10px;padding:8px 12px;border-radius:4px;font-size:14px;display:inline-block;';
        (anchor && anchor.parentNode ? anchor.parentNode : document.body)
            .insertBefore(box, anchor && anchor.nextSibling ? anchor.nextSibling : null);
    }
    box.style.background = ok ? '#e6f4ea' : '#fdecea';
    box.style.color = ok ? '#1e6b34' : '#a12622';
    box.textContent = text;
}
