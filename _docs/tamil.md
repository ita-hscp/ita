---
category: Teacher
order: 1
title: தமிழ் பேச்சு

---
<script src="{{ site.baseurl }}/scripts/track.js">tracker();</script>
<!-- Transliteration and Speech Synthesis Section  using https://inputtools.google.com/request?text=vanakkam&itc=ta-t-i0-und&oe=utf-8   -->
<h1>உரை ->  பேச்சு</h1>
 <label for="text-to-speak">உரை (தமிழில்):</label><br>
<textarea id="text-to-speak" rows="10" cols="50" placeholder="இது ஒரு தமிழ் உரைநடை மாற்றி. உதாரணம்: நான் இன்னைக்கு தமிழ் ஸ்கூலுக்கு போனேன். உங்கள் உரையை இங்கு பதிவு செய்யவும்..  neengal ipppadiuym tamizhai type seiyalaam  "></textarea><br>
<!-- <button onclick="speakText()">Speak</button> -->
<button id="playAudioBtn">Fetch and Play Audio</button>
<audio id="audioPlayer" controls></audio>

<script>
    // on enter in textarea, convert the word if it is in english to tamil using google input tools api
    document.getElementById('text-to-speak').addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent newline insertion
            word = this.value.trim();
            if(word.length === 0){
                return;
            }
            const url = `https://inputtools.google.com/request?text=${encodeURIComponent(word)}&itc=ta-t-i0-und&oe=utf-8`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data[0] === 'SUCCESS') {
                        const tamilText = data[1][0][1][0];
                        this.value = tamilText; // Replace the textarea content with Tamil text
                    } else {
                        console.error('Error fetching transliteration:', data);
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    });
</script>

<script src="{{ site.baseurl }}/scripts/speech.js"></script>
<h1>தமிழ் பேச்சு -> உரைநடை மாற்றி</h1>
<button id="start-btn">கேட்கத் தொடங்குங்கள்</button>
<button id="stop-btn" disabled>கேட்பதை நிறுத்து</button>
<button id="play-btn" disabled>கேள்</button>
<div id="audio-link"></div>
<p id="transcription"></p>

<script>
    // Check if the browser supports the Web Speech API
    document.getElementById('playAudioBtn').addEventListener('click',speak);
    if (!('webkitSpeechRecognition' in window)) {
            alert('Sorry, your browser does not support speech recognition.');
    } else {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        let mediaRecorder;
        let audioChunks = [];
        let audioBlob;
        recognition.lang = 'ta';   
        recognition.continuous = true; // Keep recognizing speech continuously
        recognition.interimResults = true; // Show interim results
        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');
        const playBtn = document.getElementById('play-btn');
        const transcription = document.getElementById('transcription');
        startBtn.addEventListener('click',async () => {
            recognition.start(); // Start the speech recognition
            startBtn.disabled = true;
            stopBtn.disabled = false;
            playBtn.disabled=true;
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };
                mediaRecorder.onstop = () => {
                    audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioURL = URL.createObjectURL(audioBlob);
                    console.log('Audio URL:', audioURL);
                    // Clear chunks for the next recording
                    audioChunks = [];
                };
                mediaRecorder.start();
                console.log('Audio recording started');
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        });

        stopBtn.addEventListener('click', () => {
            recognition.stop(); // Stop the speech recognition
            startBtn.disabled = false;
            stopBtn.disabled = true;
            playBtn.disabled=false;
            if (mediaRecorder) {
                mediaRecorder.stop();
                console.log('Audio recording stopped');
            }
        });

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            transcription.innerHTML = `<strong>Final:</strong> ${finalTranscript}<br><strong>Interim:</strong> ${interimTranscript}`;
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error detected: ' + event.error);
        };

        recognition.onend = () => {
            startBtn.disabled = false;
            stopBtn.disabled = true;
        };

        playBtn.addEventListener('click',()=>{
            const audioURL = URL.createObjectURL(audioBlob);
            console.log('Audio URL:', audioURL);
            // Play or download the audio
            const audio = new Audio(audioURL);
            audio.play();
        });
    }
</script>

####பேச்சைப் பதிவுசெய்து பதிவிறக்கவும்
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js"></script>
<button id="speechStartButton">பதிவைத் தொடங்கவும்</button>
<button id="speechStopButton" disabled>பதிவு செய்வதை நிறுத்து</button>
<a id="speechDownloadLink" style="display:none;">பதிவிறக்கவும்</a>
<div id="tracker"></div>
<script src="{{ site.baseurl }}/scripts/recorder.js"></script>

