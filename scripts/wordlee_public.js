const API_BASE_URL = 'https://infinite-sands-52519-06605f47cb30.herokuapp.com';
const PUBLIC_PLAYER_KEY = 'wordlee-public-player';
const LEVELS = ['easy', 'medium', 'hard'];
const LEVEL_LABELS = { easy: 'எளிது', medium: 'நடுத்தரம்', hard: 'கடினம்' };
const MAX_TRIES = 6;
const MAX_WEEK_LOOKBACK = 12;

const publicNameInput = document.getElementById('playerName');
const publicPlayBtn = document.getElementById('publicPlayBtn');
const publicNameNote = document.getElementById('publicNameNote');
const boardEl = document.getElementById('board');
const levelsEl = document.getElementById('levels');
const messageEl = document.getElementById('message');
const toastEl = document.getElementById('toast');
const hintsEl = document.getElementById('hints');
const hintsPlayBtn = document.getElementById('hintsPlayBtn');
const leaderboardBody = document.getElementById('leaderboardBody');
const leaderboardNote = document.getElementById('leaderboardNote');
const weekSelect = document.getElementById('weekSelect');
const selectedWeekLabel = document.getElementById('selectedWeekLabel');
const HINTS_PLAY_LABEL = 'கேளுங்கள் (play)';
const HINTS_STOP_LABEL = 'நிறுத்து (stop)';

function getPublicPlayerName() {
  const raw = (publicNameInput ? publicNameInput.value : '').trim();
  const value = raw || 'Anonymous';
  sessionStorage.setItem(PUBLIC_PLAYER_KEY, value);
  if (publicNameInput) publicNameInput.value = value;
  return value;
}

function setPublicNameNote(text) {
  if (publicNameNote) publicNameNote.textContent = text;
}

function getIsoWeek(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return { id: `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`, weekNo };
}

function getWeekRangeLabel(weekId) {
  const [year, weekPart] = weekId.split('-W');
  const weekNumber = Number(weekPart || 0);
  if (!year || !weekNumber) return weekId;

  const start = new Date(Date.UTC(Number(year), 0, 4));
  const day = start.getUTCDay() || 7;
  start.setUTCDate(start.getUTCDate() + (1 - day) + (weekNumber - 1) * 7);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);

  const fmt = (date) => date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  });

  return `${fmt(start)} - ${fmt(end)}`;
}

function buildWeekOptions() {
  if (!weekSelect) return [];

  const options = [];
  const seen = new Set();

  for (let offset = 0; offset < MAX_WEEK_LOOKBACK; offset++) {
    const sample = new Date();
    sample.setDate(sample.getDate() - (offset * 7));
    const iso = getIsoWeek(sample);
    if (seen.has(iso.id)) continue;
    seen.add(iso.id);
    options.push({ id: iso.id, label: iso.id });
  }

  weekSelect.innerHTML = '';
  options.forEach(({ id, label }) => {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = label;
    weekSelect.appendChild(option);
  });

  weekSelect.value = getIsoWeek().id;
  return options.map((item) => item.id);
}

function setSelectedWeekDisplay(weekId) {
  if (selectedWeekLabel) {
    selectedWeekLabel.textContent = getWeekRangeLabel(weekId);
  }
}

const segmenter = ('Intl' in window && Intl.Segmenter) ? new Intl.Segmenter('ta', { granularity: 'grapheme' }) : null;
const toNFC = (s) => (s || '').normalize('NFC').trim();
const graphemes = (s) => {
  s = toNFC(s);
  return segmenter ? Array.from(segmenter.segment(s), x => x.segment) : Array.from(s);
};
const TAMIL_ONLY = /^[\u0B80-\u0BFF]+$/;

let currentWeekId = getIsoWeek().id;
let remoteConfig = null;
let progress = {};
let answer = [];
let N = 0;
let row = 0;
let locked = true;
let animating = false;
let currentLevel = null;
let levelStartedAt = 0;
let currentHints = [];
let hintsAudioId = 0;
let hintsAudio = null;
let hintsPlaying = false;
let toastTimer;

function setMsg(text) {
  if (messageEl) messageEl.textContent = text;
}

function toast(text, ms = 1600) {
  if (!toastEl) return;
  toastEl.textContent = text;
  toastEl.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.style.display = 'none'; }, ms);
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(options.body ? { 'Content-Type': 'application/json' } : {})
    }
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return response.json();
}

async function loadRemoteConfig(weekId) {
  try {
    const data = await fetchJson(`${API_BASE_URL}/public/wordlee/config?week=${encodeURIComponent(weekId)}`);
    return data.challenges || {};
  } catch (e) {
    console.error('Unable to read public config', e);
    return {};
  }
}

async function fetchChallenge(weekId, level) {
  if (!remoteConfig || remoteConfig.weekId !== weekId) {
    remoteConfig = await loadRemoteConfig(weekId);
    remoteConfig.weekId = weekId;
  }

  const remote = remoteConfig[level];
  return remote && remote.word ? remote : null;
}

async function submitResult(level, result) {
  try {
    const payload = {
      weekId: currentWeekId,
      level,
      won: result.won,
      tries: result.tries,
      seconds: result.seconds,
      name: getPublicPlayerName()
    };

    return await fetchJson(`${API_BASE_URL}/public/wordlee/results`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error('Unable to submit public result', e);
    return null;
  }
}

function renderLeaderboard(data) {
  if (!leaderboardBody) return;
  leaderboardBody.innerHTML = '';

  const rows = [...(data.leaderboard || [])];
  if (data.me) rows.push(data.me);

  rows.forEach((entry) => {
    const tr = document.createElement('tr');
    if (entry.isMe) tr.className = 'me';

    [entry.rank, entry.name, `${entry.solved}/${LEVELS.length}`, entry.score, formatTime(entry.seconds)].forEach((value) => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });

    leaderboardBody.appendChild(tr);
  });

  if (leaderboardNote) {
    leaderboardNote.textContent = rows.length ? '' : 'இன்னும் யாரும் முடிக்கவில்லை.';
  }
}

async function loadLeaderboard() {
  try {
    const data = await fetchJson(`${API_BASE_URL}/public/wordlee/leaderboard?week=${encodeURIComponent(currentWeekId)}`);
    renderLeaderboard(data);
  } catch (e) {
    console.error('Unable to load public leaderboard', e);
    if (leaderboardNote) leaderboardNote.textContent = 'தரவரிசையை ஏற்ற முடியவில்லை.';
  }
}

function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function buildBoard() {
  if (!boardEl) return;
  boardEl.style.setProperty('--cols', N);
  boardEl.innerHTML = '';

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
  stopHintsAudio();
  currentHints = (hints || []).slice(0, 3);
  if (hintsPlayBtn) hintsPlayBtn.disabled = currentHints.length === 0;
  if (!hintsEl) return;

  hintsEl.innerHTML = '';
  currentHints.forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    hintsEl.appendChild(li);
  });
}

async function fetchHintAudio(text) {
  const response = await fetch(`${API_BASE_URL}/text_to_speech_new?text=${encodeURIComponent(text)}`);
  if (!response.ok) throw new Error(`Text to speech error: ${response.status}`);
  return response.blob();
}

function playHintBlob(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    hintsAudio = audio;
    const done = () => { URL.revokeObjectURL(url); resolve(); };
    audio.addEventListener('ended', done);
    audio.addEventListener('pause', done);
    audio.addEventListener('error', () => { URL.revokeObjectURL(url); reject(new Error('Audio playback failed')); });
    audio.play().catch(reject);
  });
}

function stopHintsAudio() {
  hintsAudioId++;
  hintsPlaying = false;
  if (hintsAudio) {
    hintsAudio.pause();
    hintsAudio = null;
  }
  if (hintsPlayBtn) hintsPlayBtn.textContent = HINTS_PLAY_LABEL;
}

async function playHints() {
  if (hintsPlaying) {
    stopHintsAudio();
    return;
  }

  if (currentHints.length === 0) return;

  const id = ++hintsAudioId;
  hintsPlaying = true;
  if (hintsPlayBtn) hintsPlayBtn.textContent = HINTS_STOP_LABEL;

  try {
    const blobs = await Promise.all(currentHints.map(fetchHintAudio));
    for (const blob of blobs) {
      if (id !== hintsAudioId || !blob) return;
      await playHintBlob(blob);
    }
  } catch (e) {
    console.error('Unable to play hints', e);
    toast('ஒலியை இயக்க முடியவில்லை. மீண்டும் முயலுங்கள்.', 2400);
  } finally {
    if (id === hintsAudioId) stopHintsAudio();
  }
}

if (hintsPlayBtn) hintsPlayBtn.addEventListener('click', playHints);

function setTile(r, c, text, cls) {
  const tile = document.getElementById(`t-${r}-${c}`);
  if (!tile) return;
  tile.textContent = text || '';
  tile.classList.toggle('filled', !!text);
  if (cls) tile.classList.add(cls);
}

function renderLevels() {
  if (!levelsEl) return;
  levelsEl.innerHTML = '';

  LEVELS.forEach((level) => {
    const done = progress[level];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn level-btn' + (level === currentLevel ? ' active' : '') + (done ? ' done' : '');
    btn.textContent = LEVEL_LABELS[level] + (done ? (done.won ? ' ✓' : ' ✗') : '');
    btn.disabled = !!done || animating;
    btn.addEventListener('click', () => startLevel(level));
    levelsEl.appendChild(btn);
  });
}

function showAllDone(prefix = '') {
  locked = true;
  if (micBtn) micBtn.disabled = true;
  setMsg(`${prefix} இந்த வாரச் சவால்கள் அனைத்தும் முடிந்தன. அடுத்த வாரம் மீண்டும் வாருங்கள்!`.trim());
}

async function startLevel(level) {
  if (progress[level] || animating) return;

  locked = true;
  currentLevel = level;

  const entry = await fetchChallenge(currentWeekId, level);
  if (!entry) {
    setMsg('இந்த வார சவால் கிடைக்கவில்லை.');
    return;
  }

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
    toast('அற்புதம்!', 1800);
  } else {
    summary = `முடிந்தது. சரியான சொல்: "${answer.join('')}"`;
    toast('அடுத்த முறை நிச்சயம்!', 1800);
  }

  setMsg(summary);

  const saved = await submitResult(level, progress[level]);
  if (saved) {
    progress[level] = { won: saved.won, tries: saved.tries, seconds: saved.seconds, score: saved.score };
    summary += ` மதிப்பெண்: ${saved.score} (முயற்சிகள் ${saved.attemptPoints} + நேரம் ${saved.timePoints}, ${formatTime(saved.seconds)})`;
    await loadLeaderboard();
  } else {
    summary += ' முடிவைச் சேமிக்க முடியவில்லை; தரவரிசையில் சேராது.';
  }

  if (LEVELS.every((l) => progress[l])) {
    showAllDone(summary);
  } else if (currentLevel === level) {
    setMsg(summary);
  }
}

function evaluate(guess) {
  const result = Array(N).fill('bad');
  const remaining = {};

  answer.forEach((ch) => { remaining[ch] = (remaining[ch] || 0) + 1; });

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
    const won = result.every((r) => r === 'good');
    if (won || currentRow === MAX_TRIES - 1) {
      await finishLevel(won, currentRow + 1);
    } else {
      row++;
      locked = false;
      renderLevels();
    }
  }, N * 180 + 50);
}

const micBtn = document.getElementById('micBtn');
const micDot = document.getElementById('micDot');
let recog = null;
let listening = false;

function setupSpeech() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    if (micBtn) micBtn.disabled = true;
    setMsg('இந்த browser-ல் Speech Recognition இல்லை. Chrome அல்லது Edge பயன்படுத்தவும்.');
    return;
  }

  recog = new SR();
  recog.lang = 'ta-IN';
  recog.interimResults = false;
  recog.maxAlternatives = 4;

  recog.onstart = () => {
    listening = true;
    if (micDot) micDot.classList.add('live');
    if (micBtn) micBtn.textContent = 'கேட்கிறது...';
  };

  recog.onend = () => {
    listening = false;
    if (micDot) micDot.classList.remove('live');
    if (micBtn) micBtn.textContent = 'சொல் பேசுங்கள்';
  };

  recog.onerror = (e) => { toast('Speech பிழை: ' + (e.error || '')); };

  recog.onresult = (e) => {
    const alts = Array.from(e.results[0], (r) => toNFC(r.transcript).replace(/\s+/g, ''));
    const pick = alts.find((t) => TAMIL_ONLY.test(t) && graphemes(t).length === N);
    if (!pick) {
      toast(`கேட்டது: "${alts[0] || ''}" - ${N} எழுத்துள்ள தமிழ்ச் சொல் தேவை. மீண்டும் பேசுங்கள்.`, 2600);
      return;
    }
    submit(pick);
  };
}

if (micBtn) {
  micBtn.addEventListener('click', () => {
    if (locked || !recog) return;
    if (listening) recog.stop(); else { stopHintsAudio(); recog.start(); }
  });
}

function initializePublicPlayerName() {
  const saved = sessionStorage.getItem(PUBLIC_PLAYER_KEY);
  if (publicNameInput) publicNameInput.value = saved || '';
  if (saved) {
    setPublicNameNote(`விளையாடுபவர்: ${saved}`);
  } else {
    setPublicNameNote('Enter a name or play anonymously.');
  }
}

if (publicPlayBtn) {
  publicPlayBtn.addEventListener('click', () => {
    const chosen = getPublicPlayerName();
    setPublicNameNote(`விளையாடுபவர்: ${chosen}`);
    window.location.reload();
  });
}

async function selectWeek(weekId) {
  if (!weekId) return;

  currentWeekId = weekId;
  if (weekSelect) weekSelect.value = weekId;
  setSelectedWeekDisplay(weekId);
  remoteConfig = null;
  progress = {};
  answer = [];
  N = 0;
  row = 0;
  locked = true;
  animating = false;
  currentLevel = null;

  renderLevels();
  setMsg('சவால் ஏற்றப்படுகிறது...');
  const next = LEVELS.find((l) => !progress[l]);
  if (next) {
    await startLevel(next);
  } else {
    showAllDone();
  }

  await loadLeaderboard();
}

(async function init() {
  buildWeekOptions();
  currentWeekId = getIsoWeek().id;
  if (weekSelect) {
    weekSelect.value = currentWeekId;
    weekSelect.addEventListener('change', () => selectWeek(weekSelect.value));
  }

  setSelectedWeekDisplay(currentWeekId);
  initializePublicPlayerName();
  setupSpeech();
  renderLevels();

  const next = LEVELS.find((l) => !progress[l]);
  if (next) {
    await startLevel(next);
  } else {
    showAllDone();
  }

  await loadLeaderboard();
})();
