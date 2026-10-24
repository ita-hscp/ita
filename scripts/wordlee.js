// ---------- Word source ----------
// Words come from the back end (GET /wordlee/config, stored in MongoDB).
// The local CHALLENGES below are only a fallback if the back end has no word
// for a level or cannot be reached.
const API_BASE_URL = 'https://infinite-sands-52519-06605f47cb30.herokuapp.com';
const LOGIN_URL = 'https://ita-hscp.github.io/ita/Login';
// Weekly challenge pools. Each week has one easy, one medium and one hard word,
// picked by ISO week number so every learner gets the same words that week.
const LEVELS = ['easy', 'medium', 'hard'];
const LEVEL_LABELS = { easy: 'எளிது', medium: 'நடுத்தரம்', hard: 'கடினம்' };

// ISO week, e.g. { id: "2026-W43", number: 43 }
function getWeek(date = new Date()) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const number = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return { id: `${d.getUTCFullYear()}-W${String(number).padStart(2, '0')}`, number };
}

// Reads the week's config from the back end once; returns {} on any failure so
// the local fallback is used.
let remoteConfig = null;
async function loadRemoteConfig(weekId) {
    try {
        const response = await fetch(`${API_BASE_URL}/wordlee/config?week=${encodeURIComponent(weekId)}`, {
            headers: { Authorization: sessionStorage.getItem('sessionToken') || '' }
        });
        if (response.status === 401) {
            window.location.href = LOGIN_URL;
            return {};
        }
        if (!response.ok) return {};
        const data = await response.json();
        return data.challenges || {};
    } catch (e) {
        console.error('Unable to read wordlee config', e);
        return {};
    }
}

// Returns { word: "...", hints: ["...", "...", "..."] } for the given week and level.
async function fetchChallenge(week, level) {
    if (!remoteConfig) remoteConfig = await loadRemoteConfig(week.id);
    const remote = remoteConfig[level];
    if (remote && remote.word) return remote;
    // const pool = CHALLENGES[level];
    // return pool[week.number % pool.length];
}

// ---------- Progress ----------
// Completion is kept only on the back end (one stored result per student, week and level).
// GET /wordlee/results returns { results: { easy: { won, tries, seconds, score, ... }, ... } }.
// Returns null when it cannot be read, so the page never offers a level that may be done.
async function loadProgress(weekId) {
    try {
        const response = await fetch(`${API_BASE_URL}/wordlee/results?week=${encodeURIComponent(weekId)}`, {
            headers: { Authorization: sessionStorage.getItem('sessionToken') || '' }
        });
        if (response.status === 401) {
            window.location.href = LOGIN_URL;
            return null;
        }
        if (!response.ok) return null;
        const data = await response.json();
        return data.results || {};
    } catch (e) {
        console.error('Unable to read wordlee progress', e);
        return null;
    }
}

// ---------- Scoring & leaderboard ----------
// The score is calculated by the back end from attempts and time (POST /wordlee/results),
// and the weekly ranking is read from GET /wordlee/ranking.
const leaderboardBody = document.getElementById('leaderboardBody');
const leaderboardNote = document.getElementById('leaderboardNote');

function formatTime(seconds) {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

// Sends a finished level to the back end; returns the stored result with its score
// breakdown, or null if it could not be saved. The back end keeps the first result
// for a level, so the returned values replace what was sent.
async function submitResult(level, result) {
    try {
        const response = await fetch(`${API_BASE_URL}/wordlee/results`, {
            method: 'POST',
            headers: {
                Authorization: sessionStorage.getItem('sessionToken') || '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ weekId: week.id, level, won: result.won, tries: result.tries, seconds: result.seconds })
        });
        if (response.status === 401) {
            window.location.href = LOGIN_URL;
            return null;
        }
        if (!response.ok) return null;
        return await response.json();
    } catch (e) {
        console.error('Unable to submit wordlee result', e);
        return null;
    }
}

function renderLeaderboard(data) {
    leaderboardBody.innerHTML = "";
    const rows = [...(data.leaderboard || [])];
    if (data.me) rows.push(data.me);
    rows.forEach(entry => {
        const tr = document.createElement('tr');
        if (entry.isMe) tr.className = 'me';
        [entry.rank, entry.name, `${entry.solved}/${LEVELS.length}`, entry.score, formatTime(entry.seconds)].forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        });
        leaderboardBody.appendChild(tr);
    });
    leaderboardNote.textContent = rows.length ? "" : "இன்னும் யாரும் முடிக்கவில்லை.";
}

async function loadLeaderboard() {
    try {
        const response = await fetch(`${API_BASE_URL}/wordlee/ranking?week=${encodeURIComponent(week.id)}`, {
            headers: { Authorization: sessionStorage.getItem('sessionToken') || '' }
        });
        if (response.status === 401) {
            window.location.href = LOGIN_URL;
            return;
        }
        if (!response.ok) throw new Error(`Ranking error: ${response.status}`);
        renderLeaderboard(await response.json());
    } catch (e) {
        console.error('Unable to read wordlee ranking', e);
        leaderboardNote.textContent = "தரவரிசையை ஏற்ற முடியவில்லை.";
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
let levelStartedAt = 0;
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

function showAllDone(prefix = '') {
    locked = true;
    micBtn.disabled = true;
    setMsg(`${prefix} இந்த வாரச் சவால்கள் அனைத்தும் முடிந்தன. அடுத்த வாரம் மீண்டும் வாருங்கள்!`.trim());
}

async function startLevel(level) {
    if (progress[level] || animating) return;
    locked = true;
    currentLevel = level;
    const entry = await fetchChallenge(week, level);
    answer = graphemes(entry.word);
    N = answer.length;
    row = 0;
    buildBoard();
    renderHints(entry.hints);
    renderLevels();
    setMsg(`${LEVEL_LABELS[level]}: சொல்லில் ${N} எழுத்துக்கள் உள்ளன. முயற்சிகள்: ${MAX_TRIES}. மைக்கை அழுத்திச் சொல்லைப் பேசுங்கள்.`);
    locked = false;
    levelStartedAt = Date.now();
}

async function finishLevel(won, tries) {
    const level = currentLevel;
    const seconds = Math.max(0, Math.round((Date.now() - levelStartedAt) / 1000));
    progress[level] = { won, tries, seconds };
    renderLevels();
    let summary;
    if (won) {
        summary = `சரி! நீங்கள் கண்டுபிடித்தீர்கள்: "${answer.join('')}"`;
        toast("அற்புதம்!", 1800);
    } else {
        summary = `முடிந்தது. சரியான சொல்: "${answer.join('')}"`;
        toast("அடுத்த முறை நிச்சயம்!", 1800);
    }
    setMsg(summary);

    const saved = await submitResult(level, progress[level]);
    if (saved) {
        progress[level] = { won: saved.won, tries: saved.tries, seconds: saved.seconds, score: saved.score };
        summary += ` மதிப்பெண்: ${saved.score} (முயற்சிகள் ${saved.attemptPoints} + நேரம் ${saved.timePoints}, ${formatTime(saved.seconds)})`;
        loadLeaderboard();
    } else {
        summary += ' முடிவைச் சேமிக்க முடியவில்லை; தரவரிசையில் சேராது.';
    }
    if (LEVELS.every(l => progress[l])) {
        showAllDone(summary);
    } else if (currentLevel === level) {
        setMsg(summary);
    }
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
    const saved = await loadProgress(week.id);
    if (!saved) {
        locked = true;
        micBtn.disabled = true;
        setMsg('உங்கள் முன்னேற்றத்தை ஏற்ற முடியவில்லை. பக்கத்தை மீண்டும் ஏற்றுங்கள்.');
        loadLeaderboard();
        return;
    }
    progress = saved;
    renderLevels();
    const next = LEVELS.find(l => !progress[l]);
    if (next) {
        await startLevel(next);
    } else {
        showAllDone();
    }
    loadLeaderboard();
})();
