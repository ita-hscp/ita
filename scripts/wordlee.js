// ---------- Word source ----------
// Words are read from CHALLENGES below for now (see fetchChallenge()).
// const WORDS = [
//     { word: "மலர்கள்", hints: ["தோட்டத்தில் மலர்வன", "வாசனை உடையவை", "பூக்கள் என்றும் அழைக்கப்படும்"] },
//     { word: "கதிரவன்", hints: ["காலையில் கிழக்கில் தோன்றும்", "ஒளியும் வெப்பமும் தருவது", "சூரியன் என்றும் அழைக்கப்படும்"] },
//     { word: "நிழல்கள்", hints: ["மரத்தின் கீழ் காணலாம்", "ஒளி தடைபடுவதால் உருவாகும்", "ஒளிக்கு எதிர்ப்பக்கம் விழும்"] },
//     { word: "புத்தகம்", hints: ["படிக்க உதவும்", "பக்கங்கள் உடையது", "நூலகத்தில் நிறைய இருக்கும்"] },
//     { word: "ஆசிரியர்", hints: ["பள்ளியில் பாடம் நடத்துபவர்", "மாணவர்களுக்குக் கற்றுத் தருபவர்", "வகுப்பறையில் இருப்பவர்"] },
//     { word: "மாணவர்", hints: ["பள்ளிக்குச் செல்பவர்", "பாடம் கற்பவர்", "ஆசிரியரிடம் கற்றுக்கொள்பவர்"] },
//     { word: "குழந்தை", hints: ["சிறு வயதுடையவர்", "தாலாட்டு கேட்டுத் தூங்குவார்", "அம்மா அப்பாவின் செல்லம்"] },
//     { word: "வானவில்", hints: ["மழைக்குப் பின் தோன்றும்", "ஏழு நிறங்கள் உடையது", "வானில் வளைவாகத் தெரியும்"] },
//     { word: "நூலகம்", hints: ["புத்தகங்கள் நிறைந்த இடம்", "அமைதியாக இருக்க வேண்டிய இடம்", "இரவல் வாங்கிப் படிக்கலாம்"] },
//     { word: "தமிழ்", hints: ["நம் தாய்மொழி", "திருக்குறள் எழுதப்பட்ட மொழி", "நாம் கற்கும் மொழி"] }
// ];
// Weekly challenge pools. Each week has one easy, one medium and one hard word,
// picked by ISO week number so every learner gets the same words that week.
const LEVELS = ['easy', 'medium', 'hard'];
const LEVEL_LABELS = { easy: 'எளிது', medium: 'நடுத்தரம்', hard: 'கடினம்' };
const CHALLENGES = {
    easy: [
        { word: "தமிழ்", hints: ["நம் தாய்மொழி", "திருக்குறள் எழுதப்பட்ட மொழி", "நாம் கற்கும் மொழி"] }
    ],
    medium: [
        { word: "நூலகம்", hints: ["புத்தகங்கள் நிறைந்த இடம்", "அமைதியாக இருக்க வேண்டிய இடம்", "இரவல் வாங்கிப் படிக்கலாம்"] }
    ],
    hard: [
        { word: "கதிரவன்", hints: ["காலையில் கிழக்கில் தோன்றும்", "ஒளியும் வெப்பமும் தருவது", "சூரியன் என்றும் அழைக்கப்படும்"] }
    ]
};

// ISO week, e.g. { id: "2026-W43", number: 43 }
function getWeek(date = new Date()) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const number = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return { id: `${d.getUTCFullYear()}-W${String(number).padStart(2, '0')}`, number };
}

// To read from the back end later, replace the body of fetchChallenge() with a
// fetch() call that returns { word: "...", hints: ["...", "...", "..."] }.
async function fetchChallenge(weekNumber, level) {
    const pool = CHALLENGES[level];
    return pool[weekNumber % pool.length];
}

// ---------- Progress storage ----------
// Stored in the browser for now: { [weekId]: { [level]: { won, tries, word, completedAt } } }.
// To move to the back end later, replace the bodies of loadProgress() and saveResult().
// A leaderboard can then be built from the same result records.
const STORE_KEY = 'wordlee.progress.v1';

function readStore() {
    try {
        return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch (e) {
        return {};
    }
}

async function loadProgress(weekId) {
    return readStore()[weekId] || {};
}

async function saveResult(weekId, level, result) {
    const store = readStore();
    store[weekId] = { ...(store[weekId] || {}), [level]: result };
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch (e) {
        console.error('Unable to save progress', e);
    }
}

// ---------- Utilities ----------
const segmenter = ('Intl' in window && Intl.Segmenter) ? new Intl.Segmenter('ta', { granularity: 'grapheme' }) : null;
const toNFC = (s) => (s || '').normalize('NFC').trim();
const graphemes = (s) => {
    s = toNFC(s);
    return segmenter ? Array.from(segmenter.segment(s), x => x.segment) : Array.from(s);
};
const TAMIL_ONLY = /^[\u0B80-\u0BFF]+$/;

// ---------- State ----------
const MAX_TRIES = 6;
let answer = [];
let N = 0;
let row = 0;
let locked = true;
let animating = false;
let currentLevel = null;
const week = getWeek();
let progress = {};

const boardEl = document.getElementById('board');
const levelsEl = document.getElementById('levels');
const messageEl = document.getElementById('message');
const toastEl = document.getElementById('toast');
const hintsEl = document.getElementById('hints');

function setMsg(text) { messageEl.textContent = text; }

let toastTimer;
function toast(text, ms = 1600) {
    toastEl.textContent = text;
    toastEl.style.display = 'block';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.style.display = 'none'; }, ms);
}

// ---------- Rendering ----------
function buildBoard() {
    boardEl.style.setProperty('--cols', N);
    boardEl.innerHTML = "";
    for (let r = 0; r < MAX_TRIES; r++) {
        for (let c = 0; c < N; c++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = `t-${r}-${c}`;
            boardEl.appendChild(tile);
        }
    }
}

function renderHints(hints) {
    hintsEl.innerHTML = "";
    (hints || []).slice(0, 3).forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        hintsEl.appendChild(li);
    });
}

function setTile(r, c, text, cls) {
    const tile = document.getElementById(`t-${r}-${c}`);
    if (!tile) return;
    tile.textContent = text || "";
    tile.classList.toggle('filled', !!text);
    if (cls) tile.classList.add(cls);
}

// ---------- Game flow ----------
function renderLevels() {
    levelsEl.innerHTML = "";
    LEVELS.forEach(level => {
        const done = progress[level];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn level-btn' + (level === currentLevel ? ' active' : '') + (done ? ' done' : '');
        btn.textContent = LEVEL_LABELS[level] + (done ? (done.won ? ' \u2713' : ' \u2717') : '');
        btn.disabled = !!done || animating;
        btn.addEventListener('click', () => startLevel(level));
        levelsEl.appendChild(btn);
    });
}

function showAllDone() {
    locked = true;
    micBtn.disabled = true;
    setMsg('இந்த வாரச் சவால்கள் அனைத்தும் முடிந்தன. அடுத்த வாரம் மீண்டும் வாருங்கள்!');
}

async function startLevel(level) {
    if (progress[level] || animating) return;
    locked = true;
    currentLevel = level;
    const entry = await fetchChallenge(week.number, level);
    answer = graphemes(entry.word);
    N = answer.length;
    row = 0;
    buildBoard();
    renderHints(entry.hints);
    renderLevels();
    setMsg(`${LEVEL_LABELS[level]}: சொல்லில் ${N} எழுத்துக்கள் உள்ளன. முயற்சிகள்: ${MAX_TRIES}. மைக்கை அழுத்திச் சொல்லைப் பேசுங்கள்.`);
    locked = false;
}

async function finishLevel(won, tries) {
    const level = currentLevel;
    progress[level] = { won, tries, word: answer.join(''), completedAt: new Date().toISOString() };
    await saveResult(week.id, level, progress[level]);
    renderLevels();
    if (won) {
        setMsg(`சரி! நீங்கள் கண்டுபிடித்தீர்கள்: "${answer.join('')}"`);
        toast("அற்புதம்!", 1800);
    } else {
        setMsg(`முடிந்தது. சரியான சொல்: "${answer.join('')}"`);
        toast("அடுத்த முறை நிச்சயம்!", 1800);
    }
    if (LEVELS.every(l => progress[l])) showAllDone();
}

function evaluate(guess) {
    const result = Array(N).fill('bad');
    const remaining = {};
    answer.forEach(ch => { remaining[ch] = (remaining[ch] || 0) + 1; });
    for (let i = 0; i < N; i++) {
        if (guess[i] === answer[i]) {
            result[i] = 'good';
            remaining[guess[i]]--;
        }
    }
    for (let i = 0; i < N; i++) {
        if (result[i] === 'good') continue;
        if (remaining[guess[i]] > 0) {
            result[i] = 'place';
            remaining[guess[i]]--;
        }
    }
    return result;
}

function submit(text) {
    if (locked) return;
    const guess = graphemes(text);

    locked = true;
    animating = true;
    renderLevels();
    const result = evaluate(guess);
    const currentRow = row;
    guess.forEach((ch, i) => {
        setTimeout(() => setTile(currentRow, i, ch, result[i]), i * 180);
    });

    setTimeout(async () => {
        animating = false;
        const won = result.every(r => r === 'good');
        if (won || currentRow === MAX_TRIES - 1) {
            await finishLevel(won, currentRow + 1);
        } else {
            row++;
            locked = false;
            renderLevels();
        }
    }, N * 180 + 50);
}

// ---------- Speech recognition ----------
const micBtn = document.getElementById('micBtn');
const micDot = document.getElementById('micDot');
let recog = null;
let listening = false;

function setupSpeech() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        micBtn.disabled = true;
        setMsg("இந்த உலாவியில் Speech Recognition இல்லை. Chrome அல்லது Edge பயன்படுத்தவும்.");
        return;
    }
    recog = new SR();
    recog.lang = 'ta-IN';
    recog.interimResults = false;
    recog.maxAlternatives = 4;
    recog.onstart = () => { listening = true; micDot.classList.add('live'); micBtn.textContent = "கேட்கிறது..."; };
    recog.onend = () => { listening = false; micDot.classList.remove('live'); micBtn.textContent = "சொல் பேசுங்கள்"; };
    recog.onerror = (e) => { toast("Speech பிழை: " + (e.error || "")); };
    recog.onresult = (e) => {
        const alts = Array.from(e.results[0], r => toNFC(r.transcript).replace(/\s+/g, ''));
        const pick = alts.find(t => TAMIL_ONLY.test(t) && graphemes(t).length === N);
        if (!pick) {
            toast(`கேட்டது: "${alts[0] || ''}" - ${N} எழுத்துள்ள தமிழ்ச் சொல் தேவை. மீண்டும் பேசுங்கள்.`, 2600);
            return;
        }
        submit(pick);
    };
}

micBtn.addEventListener('click', () => {
    if (locked || !recog) return;
    if (listening) recog.stop(); else recog.start();
});

// ---------- Init ----------
(async function init() {
    setupSpeech();
    progress = await loadProgress(week.id);
    renderLevels();
    const next = LEVELS.find(l => !progress[l]);
    if (next) {
        await startLevel(next);
    } else {
        showAllDone();
    }
})();
