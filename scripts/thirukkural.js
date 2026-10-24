const API_BASE = 'https://infinite-sands-52519-06605f47cb30.herokuapp.com/text_to_speech_new?text=';

const KURALS = [
    { tamil: ["அகர முதல எழுத்தெல்லாம் ஆதி", "பகவன் முதற்றே உலகு."],
      english: "As the letter A is the first of all letters, so the eternal God is the first in the world." },
    { tamil: ["கற்றதனால் ஆய பயனென்கொல் வாலறிவன்", "நற்றாள் தொழாஅர் எனின்."],
      english: "What good is learning to those who do not worship the good feet of Him who has pure knowledge?" },
    { tamil: ["மலர்மிசை ஏகினான் மாணடி சேர்ந்தார்", "நிலமிசை நீடுவாழ் வார்."],
      english: "Those who reach the glorious feet of Him who walks on the flower will live long on earth." },
    { tamil: ["வேண்டுதல் வேண்டாமை இலானடி சேர்ந்தார்க்கு", "யாண்டும் இடும்பை இல."],
      english: "For those who reach the feet of Him who has neither desire nor aversion, there is never any suffering." },
    { tamil: ["இருள்சேர் இருவினையும் சேரா இறைவன்", "பொருள்சேர் புகழ்புரிந்தார் மாட்டு."],
      english: "The two kinds of deeds born of ignorance do not cling to those who delight in the true praise of God." },
    { tamil: ["பொறிவாயில் ஐந்தவித்தான் பொய்தீர் ஒழுக்க", "நெறிநின்றார் நீடுவாழ் வார்."],
      english: "Those who follow the faultless path of Him who subdued the five senses will live long." },
    { tamil: ["தனக்குவமை இல்லாதான் தாள்சேர்ந்தார்க் கல்லால்", "மனக்கவலை மாற்றல் அரிது."],
      english: "Except for those who reach the feet of the Incomparable One, it is hard to remove mental worry." },
    { tamil: ["அறவாழி அந்தணன் தாள்சேர்ந்தார்க் கல்லால்", "பிறவாழி நீந்தல் அரிது."],
      english: "Except for those who reach the feet of the Sea of Virtue, none can swim the other seas." },
    { tamil: ["கோளில் பொறியின் குணமிலவே எண்குணத்தான்", "தாளை வணங்காத் தலை."],
      english: "Like a sense organ that does not function, useless is the head that does not bow to the feet of Him who has eight attributes." },
    { tamil: ["பிறவிப் பெருங்கடல் நீந்துவர் நீந்தார்", "இறைவன் அடிசேரா தார்."],
      english: "Only those who reach the feet of God can swim the great sea of births; others cannot." },
    { tamil: ["வானின்று உலகம் வழங்கி வருதலால்", "தானமிழ்தம் என்றுணரற் பாற்று."],
      english: "Since the world is sustained by the falling of rain, rain should be regarded as nectar." },
    { tamil: ["துப்பார்க்குத் துப்பாய துப்பாக்கித் துப்பார்க்குத்", "துப்பாய தூஉம் மழை."],
      english: "Rain produces good food for those who eat, and it is itself food as well." },
    { tamil: ["விண்ணின்று பொய்ப்பின் விரிநீர் வியனுலகத்து", "உள்நின்று உடற்றும் பசி."],
      english: "If rain fails from the sky, hunger will torment the wide world surrounded by vast seas." },
    { tamil: ["ஏரின் உழாஅர் உழவர் புயல்என்னும்", "வாரி வளங்குன்றிக் கால்."],
      english: "If the wealth of rain from the clouds declines, farmers will not plough." },
    { tamil: ["கெடுப்பதூஉம் கெட்டார்க்குச் சார்வாய்மற் றாங்கே", "எடுப்பதூஉம் எல்லாம் மழை."],
      english: "Rain ruins, and it is also the support that raises up the ruined." },
    { tamil: ["விசும்பின் துளிவீழின் அல்லால்மற் றாங்கே", "பசும்புல் தலைகாண்பு அரிது."],
      english: "Unless drops fall from the sky, not even a blade of green grass will be seen." },
    { tamil: ["நெடுங்கடலும் தன்நீர்மை குன்றும் தடிந்தெழிலி", "தான்நல்கா தாகி விடின்."],
      english: "Even the vast ocean shrinks if the clouds do not draw its water and give it back as rain." },
    { tamil: ["சிறப்பொடு பூசனை செல்லாது வானம்", "வறக்குமேல் வானோர்க்கும் ஈண்டு."],
      english: "If the sky fails to give rain, even the celestials will not receive festivals and worship in this world." },
    { tamil: ["தானம் தவம்இரண்டும் தங்கா வியனுலகம்", "வானம் வழங்கா தெனின்."],
      english: "If rain does not fall, neither charity nor penance will remain in this wide world." },
    { tamil: ["நீரின்றி அமையாது உலகெனின் யார்யார்க்கும்", "வானின்றி அமையாது ஒழுக்கு."],
      english: "As the world cannot exist without water, proper conduct cannot exist without rain." }
];

let playId = 0;
let currentAudio = null;
let cancelCurrent = null;
const kuralList = document.getElementById('kural-list');
const statusEl = document.getElementById('kural-status');

function renderKurals() {
    KURALS.forEach((kural, index) => {
        const item = document.createElement('div');
        item.className = 'kural-item';
        item.id = 'kural-' + (index + 1);

        const header = document.createElement('div');
        header.className = 'kural-header';
        const title = document.createElement('strong');
        title.textContent = 'குறள் ' + (index + 1);
        const playBtn = document.createElement('button');
        playBtn.textContent = 'play';
        playBtn.addEventListener('click', () => playOne(index));
        header.append(title, playBtn);

        const tamil = document.createElement('p');
        tamil.className = 'kural-tamil';
        tamil.innerHTML = kural.tamil.join('<br>');

        const english = document.createElement('p');
        english.className = 'kural-english';
        english.textContent = kural.english;

        item.append(header, tamil, english);
        kuralList.appendChild(item);
    });
}

function stopAll() {
    playId++;
    window.speechSynthesis.cancel();
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    if (cancelCurrent) {
        cancelCurrent();
        cancelCurrent = null;
    }
    document.querySelectorAll('.kural-item.playing').forEach(el => el.classList.remove('playing'));
    statusEl.textContent = '';
}

async function fetchTamilAudio(text) {
    const response = await fetch(API_BASE + encodeURIComponent(text), {
        headers: { Authorization: sessionStorage.getItem('sessionToken') }
    });
    if (response.status === 401) {
        window.location.href = "https://ita-hscp.github.io/ita/Login";
        return null;
    }
    if (!response.ok) {
        throw new Error('API error: ' + response.status);
    }
    return response.blob();
}

function playBlob(blob) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        currentAudio = audio;
        cancelCurrent = resolve;
        audio.addEventListener('ended', () => { URL.revokeObjectURL(url); resolve(); });
        audio.addEventListener('error', () => { URL.revokeObjectURL(url); reject(new Error('Audio playback failed')); });
        audio.play().catch(reject);
    });
}

function speakEnglish(text) {
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        cancelCurrent = resolve;
        utterance.onend = resolve;
        utterance.onerror = resolve;
        window.speechSynthesis.speak(utterance);
    });
}

async function playKural(index, id) {
    const kural = KURALS[index];
    const item = document.getElementById('kural-' + (index + 1));
    document.querySelectorAll('.kural-item.playing').forEach(el => el.classList.remove('playing'));
    item.classList.add('playing');
    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    statusEl.textContent = 'Playing குறள் ' + (index + 1);

    const blob = await fetchTamilAudio(kural.tamil.join(' '));
    if (id !== playId || !blob) return;
    await playBlob(blob);
    if (id !== playId) return;
    await speakEnglish(kural.english);
}

async function playOne(index) {
    stopAll();
    const id = playId;
    try {
        await playKural(index, id);
    } catch (error) {
        console.error(error);
        statusEl.textContent = 'Unable to play. Please log in and try again.';
        return;
    }
    if (id === playId) stopAll();
}

async function playAll() {
    stopAll();
    const id = playId;
    try {
        for (let i = 0; i < KURALS.length; i++) {
            if (id !== playId) return;
            await playKural(i, id);
        }
    } catch (error) {
        console.error(error);
        statusEl.textContent = 'Unable to play. Please log in and try again.';
        return;
    }
    if (id === playId) stopAll();
}

document.getElementById('play-all-btn').addEventListener('click', playAll);
document.getElementById('stop-btn').addEventListener('click', stopAll);
renderKurals();
