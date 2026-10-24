---
category: HSCP 3
order: 2
title: "தமிழ் சொல்லாற்றல் (Wordlee)"
---
<script src="{{ site.baseurl }}/scripts/track.js"></script>
<div class="wordlee">
  <h2>தமிழ் சொல்லாற்றல்</h2>
  <div class="wordlee-layout">
  <div class="wordlee-main">
  <div id="levels" class="levels"></div>
  <p id="message" class="msg"></p>
  <div class="play-area">
    <main id="board" class="grid" style="--cols:5" aria-live="polite"></main>
    <aside class="hints-panel">
      <h3>குறிப்புகள்</h3>
      <ol id="hints"></ol>
    </aside>
  </div>
  <div class="actions">
    <button id="micBtn" class="btn" type="button">சொல் பேசுங்கள் (speak)</button>
    <span id="micDot" class="dot" aria-live="polite"></span>
  </div>
  <details>
    <summary>எப்படி விளையாடுவது?</summary>
    <ul>
      <li>ஒவ்வொரு வாரமும் எளிது, நடுத்தரம், கடினம் என மூன்று சவால்கள் உண்டு.</li>
      <li>முடித்த சவால் சேமிக்கப்படும்; மீண்டும் விளையாட முடியாது.</li>
      <li>மறைந்துள்ள சொல்லை 6 முயற்சிகளில் கண்டுபிடிக்கவும்.</li>
      <li>தட்டச்சு செய்ய முடியாது; மைக்கை அழுத்திச் சொல்லைப் பேசவும்.</li>
      <li>பச்சை: சரியான எழுத்து, சரியான இடம்.</li>
      <li>மஞ்சள்: சரியான எழுத்து, தவறான இடம்.</li>
      <li>சாம்பல்: அந்த எழுத்து சொல்லில் இல்லை.</li>
      <li>மதிப்பெண்: முதல் முயற்சியில் 100; ஒவ்வொரு கூடுதல் முயற்சிக்கும் 15 குறையும். வேகமாக முடித்தால் 50 வரை கூடுதல் புள்ளிகள் (5 நிமிடத்தில் 0). கண்டுபிடிக்காவிட்டால் 0.</li>
    </ul>
  </details>
  </div>
  <aside class="leaderboard-panel">
    <h3>தரவரிசை</h3>
    <table>
      <thead>
        <tr><th>#</th><th>பெயர்</th><th>முடிந்தவை</th><th>மதிப்பெண்</th><th>நேரம்</th></tr>
      </thead>
      <tbody id="leaderboardBody"></tbody>
    </table>
    <p id="leaderboardNote" class="msg"></p>
  </aside>
  </div>
  <div id="toast" class="toast" style="display:none"></div>
</div>
<script src="{{ site.baseurl }}/scripts/wordlee.js"></script>
