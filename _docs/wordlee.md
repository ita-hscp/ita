---
category: HSCP 1
order: 2
title: "தமிழ் சொல்லாற்றல்"
---

<script src="{{ site.baseurl }}/scripts/track.js"></script>
<script src="{{ site.baseurl }}/scripts/wordlee.js"></script>

<h2>தமிழ் சொல்லாற்றல்</h2>
<div class="mic">
    <button id="micBtn" class="btn">🎤 சொல் பேசுங்கள்</button>
    <span id="micDot" class="dot" aria-live="polite"></span>
</div>
<input id="guessInput" type="text" inputmode="text" placeholder="உங்கள் கணிப்பு (5 எழுத்துக்கள்)..." />
<button id="enterBtn" class="btn">⏎ இடு</button>
<div id="message" class="msg">குறிப்பு: மொத்தம் 6 முயற்சிகள். தமிழ் எழுத்துக்கள் சரியாக எண்ண <span class="pill">grapheme-aware</span>.</div>
<main id="board" class="grid" style="--cols:5" aria-live="polite"></main>
    <section id="keyboard" class="kbd" aria-hidden="false"></section>
    <details>
      <summary>📚 உங்கள் சொல் பட்டியலை (ஐந்து எழுத்து) இங்கே ஒட்டவும்</summary>
      <p class="msg">ஒவ்வொரு வரியிலும் ஒரு சொல். 5 grapheme (எழுத்து இணை) கொண்ட சொற்கள் மட்டும் பயன்படுத்தப்படும்.</p>
      <textarea id="wordListArea" placeholder="உதாரணம்:
விண்மீன்
நிலவன்
மயில்..."></textarea>
    </details>
  <div id="toast" class="toast" style="display:none"></div>
