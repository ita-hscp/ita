
async function speak(){
  const audioPlayer = document.getElementById('audioPlayer');
  const text = document.getElementById('text-to-speak').value;
  speakApi(text,audioPlayer)
}

function playAudio(blob) {
  return new Promise((resolve, reject) => {
    const audio = new Audio(URL.createObjectURL(blob));
    audio.play()
      .then(() => {
        console.log('Playing audio blob');
      })
      .catch((error) => {
        console.error('Error playing audio blob:', error);
        reject(error); // Stop the sequence on failure
      });

    // Resolve the promise when the audio ends
    audio.addEventListener('ended', () => {
      console.log('Audio blob finished');
      resolve();
    });
  });
}

async function speakApi(text) {
  try {
    // Replace with your API URL that returns audio/mpeg
    const apiUrl ='https://infinite-sands-52519-06605f47cb30.herokuapp.com/text_to_speech_new?text='+text

    // Fetch the audio file from the API
    const response = await fetch(apiUrl,{ headers: {
      Authorization: sessionStorage.getItem('sessionToken')
    }});

    if (response.status === 401) {
      // Redirect to login page if not authenticated
      window.location.href = "https://ita-hscp.github.io/ita/Login"; 
      return;
    }

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Convert the response into a Blob (audio file)
    const audioBlob = await response.blob();

  
    // const arrayBuffer = await audioBlob.arrayBuffer();

    // // Step 2: Convert ArrayBuffer to String using TextDecoder
    // const textDecoder = new TextDecoder(); // Default UTF-8 encoding
    // const speechEncoded = textDecoder.decode(arrayBuffer);
    // base64AudioList.push(speechEncoded);
    // Create a URL for the Blob object and set it as the source for the audio player
    // const audioUrl = URL.createObjectURL(audioBlob);
    // audioPlayerElement.src = audioUrl;

    // Play the audio immediately after setting the source
    await playAudio(audioBlob)
  } catch (error) {
    console.error('Error fetching audio:', error);
  }
}


async function getWorkSheet(number,topic){
  let query=""
  if(number)
    query+="number="+number+"&";
  if(topic)
    query+="topic="+topic+"&";

  const apiUrl ='https://infinite-sands-52519-06605f47cb30.herokuapp.com/work_sheet'+ (query.length > 0 ? "?"+query :"");
   // Fetch the json
   const response = await fetch(apiUrl,{ headers: {
    Authorization: sessionStorage.getItem('sessionToken')
  }});
   if (response.status === 401) {
    // Redirect to login page if not authenticated
    window.location.href = "https://ita-hscp.github.io/ita/Login"; 
    return;
  }
   if (!response.ok){
    return {}
   }
   return response.json()
}

