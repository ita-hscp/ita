// ---------- Utilities ----------
    const seg = ('Intl' in window && Intl.Segmenter) ? new Intl.Segmenter('ta', {granularity:'grapheme'}) : null;
    const graphemes = (s) => {
      if(!s) return [];
      s = s.normalize('NFC');
      if(seg){
        return Array.from(seg.segment(s), x => x.segment);
      } else {
        // Fallback (not perfect for Tamil, but better than nothing)
        return Array.from(s);
      }
    };
    const gLen = (s)=>graphemes(s).length;
    const toNFC = (s)=> (s||'').normalize('NFC').trim();

    // Split Tamil text into its constituent elements
    function splitTamilLetters(text) {
      if (!text) return [];
      
      // Normalize the input text
      const normalizedText = toNFC(text);
      
      const result = [];
      let i = 0;
      
      while (i < normalizedText.length) {
        // Get the current character
        let char = normalizedText[i];
        
        // Check if it's a Tamil vowel sign (pulli, kombu, etc.)
        if (/[\u0BBE-\u0BCD\u0BD7]/.test(char)) {
          // If the result array has at least one element, attach this modifier to the previous character
          if (result.length > 0) {
            const lastIndex = result.length - 1;
            const lastChar = result[lastIndex];
            
            // If the last character was a pulli (virama), we handle it specially
            if (char === '\u0BCD') {
              // Add it as a separate character with the consonant
              result[lastIndex] = lastChar + char;
            } else {
              // For other modifiers, combine with previous character
              result[lastIndex] = lastChar + char;
            }
          } else {
            // If there's no previous character, just add it
            result.push(char);
          }
        } else {
          // It's a base character, add it as a new element
          result.push(char);
        }
        
        i++;
      }
      
      return result;
    }

    function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
    function sample(a){ return a[Math.floor(Math.random()*a.length)]; }
    function toast(msg, ms=1600){ const t=document.getElementById('toast'); t.textContent=msg; t.style.display='block'; setTimeout(()=>t.style.display='none', ms); }
    function setMsg(s){ document.getElementById('message').textContent = s; }

    // ---------- Starter word list ----------
    // NOTE: These are example Tamil words we *attempt* to keep to 5 graphemes.
    // You should paste your own curated list in the panel above for best results.
    const STARTER = [
      "மலர்கள்",   // ma-la-rgaḷ (check gLen at runtime; filtered to 5)
      "கதிரவன்",
     "நிழல்கள்",
      // harmless oddity will be filtered out
    ].map(toNFC);

    // Filter to 5-grapheme words only, unique, Tamil characters preferred
    function onlyTamilFive(list){
      const seen = new Set();
      return list
        .map(w=>toNFC(w))
        .filter(w=>w && gLen(w)===5 && !seen.has(w) && /^[\u0B80-\u0BFF\s\u200C\u200D]+$/.test(w))
        .map(w=>{ seen.add(w); return w; });
    }

    let WORDS = onlyTamilFive(STARTER);
    if(WORDS.length < 6){
      // If starter collapses too much, allow input but still run with a minimal loop of the same word
      WORDS = WORDS.concat(["தமிழ்‌"].filter(w=>gLen(w)===5));
      WORDS = onlyTamilFive(WORDS);
    }

    // ---------- Game State ----------
    const MAX_TRIES = 6;
    let answer = "";   // target word
    let row = 0;       // 0..MAX_TRIES-1
    let col = 0;       // 0..N-1 (depends on answer length)
    let N = 5;         // length in graphemes (usually 5)
    let board = [];    // rows of arrays of graphemes
    let locked = false;

    const boardEl = document.getElementById('board');
    const inputEl = document.getElementById('guessInput');
    const enterBtn = document.getElementById('enterBtn');
    const newBtn = document.getElementById('newBtn');
    const helpBtn = document.getElementById('helpBtn');
    const keyboardEl = document.getElementById('keyboard');

    const TAMIL_KEYS = [
      "அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ",
      "க ச ட த ப ற ங ஞ ண ந ம ன",
      "ய ர ல வ ழ ள ஶ ஷ ஸ ஹ ஜ ஃ",
      "⌫ ⏎"
    ].join(" ").split(" ");

    // ---------- Rendering ----------
    function buildBoard(){
      boardEl.style.setProperty('--cols', N);
      boardEl.innerHTML = "";
      for(let r=0; r<MAX_TRIES; r++){
        for(let c=0; c<N; c++){
          const d = document.createElement('div');
          d.className = 'tile';
          d.id = `t-${r}-${c}`;
          d.setAttribute('aria-label', `row ${r+1} col ${c+1}`);
          boardEl.appendChild(d);
        }
      }
    }

    function setTile(r,c,val,cls){
      const t = document.getElementById(`t-${r}-${c}`);
      if(!t) return;
      t.textContent = val || "";
      t.classList.toggle('filled', !!val);
      if(cls){ t.classList.add('reveal'); setTimeout(()=>t.classList.remove('reveal'), 120); }
      if(cls==='good'||cls==='place'||cls==='bad'){
        t.classList.remove('good','place','bad');
        t.classList.add(cls);
      }
    }

    function colorKeyboard(resultMap){
      // resultMap: { grapheme: 'good'|'place'|'bad' }
      [...keyboardEl.querySelectorAll('.key')].forEach(k=>{
        const val = k.textContent.trim();
        const cls = resultMap[val];
        if(cls){
          k.classList.remove('good','place','bad');
          k.classList.add(cls);
        }
      });
    }

    // ---------- Game Logic ----------
    function chooseNewAnswer(){
      if(WORDS.length===0){
        setMsg("⚠️ முதலில் உங்கள் 5-எழுத்துச் சொல் பட்டியலை ஏற்றவும்.");
        answer = ""; N=5; return;
      }
      answer = sample(WORDS);
      N = gLen(answer);
    }

    function reset(){
      locked = false;
      row = 0; col = 0;
      if(!answer) chooseNewAnswer();
      // Ensure N by answer
      if(gLen(answer)!==5){ /* still allow, but grid will adapt */ }
      buildBoard();
      board = Array.from({length:MAX_TRIES}, ()=>Array(N).fill(""));
      setMsg(`இன்றைய சொல்: ${N} எழுத்துக்கள். முயற்சிகள்: ${MAX_TRIES}.`);
      inputEl.value = "";
    }

    function commitGuess(guessStr){
      const guess = graphemes(guessStr);
      if(guess.length!==N){ toast(`சரியான நீளம் அல்ல (${N}).`); return; }
      if(!isValidGuess(guessStr)){ toast("இந்த சொல் பட்டியலில் இல்லை."); return; }
      reveal(guessStr);
    }

    function isValidGuess(w){
      // Accept if in list OR (optional) you can relax to any Tamil text of length N
      const nfc = toNFC(w);
      return WORDS.includes(nfc);
    }

    function reveal(guessStr){
      if(locked) return;
      locked = true;
      const g = graphemes(guessStr);
      const a = graphemes(answer);

      // Frequency map for placement logic
      const freq = {};
      a.forEach(ch=>{ freq[ch]=(freq[ch]||0)+1; });

      // First pass: green hits
      const res = Array(N).fill('bad');
      for(let i=0;i<N;i++){
        if(g[i]===a[i]){
          res[i]='good'; freq[g[i]] -= 1;
        }
      }
      // Second pass: yellows
      for(let i=0;i<N;i++){
        if(res[i]==='good') continue;
        if(freq[g[i]]>0){
          res[i]='place'; freq[g[i]]-=1;
        }
      }

      // First, display the letters without colors
      for(let i=0;i<N;i++){
        setTile(row, i, g[i]);
      }
      
      // Paint tiles with animated sequence
      const kbMap = {};
      function animateReveal(index) {
        if (index >= N) {
          // Animation completed, check win/lose condition
          if(g.join('')===a.join('')){
            setMsg(`🎉 சரி! நீங்கள் கண்டுபிடித்தீர்கள்: "${answer}"`);
            toast("அற்புதம்! ✅", 1800);
            locked = true;
          } else if(row === MAX_TRIES-1){
            setMsg(`❌ முடிந்தது. சரியான சொல்: "${answer}"`);
            toast("அடுத்த முறை நிச்சயம்!", 1800);
          } else {
            row++; col=0; locked = false;
          }
          return;
        }
        
        // Delay each letter reveal for a clearer effect
        setTimeout(() => {
          setTile(row, index, g[index], res[index]);
          kbMap[g[index]] = kbMap[g[index]]==='good' ? 'good' : 
                           (kbMap[g[index]]==='place' && res[index]==='bad' ? 'place' : res[index]);
          colorKeyboard(kbMap);
          animateReveal(index + 1);
        }, 180);
      }
      
      // Start animation
      animateReveal(0);
      inputEl.value = "";
    }

    // ---------- Input Handling ----------
    function onType(e){
      const val = toNFC(e.target.value);
      // Live fill current row (visual aid)
      const gs = graphemes(val).slice(0, N);
      for(let i=0;i<N;i++){
        setTile(row, i, gs[i]||"");
      }
      col = gs.length;
    }

    function onKey(k){
      if(k==="⌫"){ backspace(); return; }
      if(k==="⏎"){ enter(); return; }
      // Append a Tamil grapheme
      const cur = graphemes(inputEl.value);
      if(cur.length < N){
        inputEl.value = toNFC(inputEl.value + k);
        onType({target:inputEl});
      }
    }

    function backspace(){
      const cur = graphemes(inputEl.value);
      if(cur.length>0){
        cur.pop();
        inputEl.value = toNFC(cur.join(''));
        onType({target:inputEl});
      }
    }

    function enter(){
      if(locked) return;
      const g = graphemes(inputEl.value);
      if(g.length!==N){ toast(`இன்னும் ${N-g.length} எழுத்துக்கள் வேண்டும்.`); return; }
      commitGuess(inputEl.value);
    }

    // ---------- Speech Recognition ----------
    const micBtn = document.getElementById('micBtn');
    const micDot = document.getElementById('micDot');
    let recog=null, listening=false;

    function setupSpeech(){
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if(!SR){
        micBtn.disabled = true;
        setMsg("🎤 உங்கள் உலாவியில் Speech Recognition இல்லை. (Chrome/Edge பரிந்துரைக்கப்படுகிறது.)");
        return;
      }
      recog = new SR();
      recog.lang = 'ta-IN';
      recog.interimResults = false;
      recog.maxAlternatives = 4;

      recog.onstart = ()=>{ listening=true; micDot.classList.add('live'); micBtn.textContent="🎤 கேட்கிறது..."; };
      recog.onend = ()=>{ listening=false; micDot.classList.remove('live'); micBtn.textContent="🎤 சொல் பேசுங்கள்"; };
      recog.onerror = (e)=>{ toast("Speech பிழை: " + (e.error||"")); };

      recog.onresult = (e)=>{
        const alts = [];
        for(let i=0;i<e.results[0].length;i++){
          alts.push(e.results[0][i].transcript.trim());
        }
        console.log("Speech recognition alternatives:", alts);
        
        // Pick the first alternative that has exactly N graphemes and (ideally) in list
        let pick = alts.find(t=>gLen(t)===N && isValidGuess(t));
        if(!pick){
          pick = alts.find(t=>gLen(t)===N);
        }
        // If we still don't have a valid pick, use the first result and add a notification
        if(!pick && alts.length > 0){
          pick = alts[0];
          toast(`கண்டறியப்பட்டது: "${pick}" - ${gLen(pick)} எழுத்துக்கள் (${N} தேவை)`);
        } else if(!pick){
          toast("உரையுணர்வு 5-எழுத்துச் சொல்லை பெறவில்லை.");
          return;
        }
        
        // Post to input field and process
        inputEl.value = pick;
        onType({target:inputEl});
        
        // Only auto-enter if it's a valid word with correct length
        if(gLen(pick) === N && isValidGuess(pick)){
          enter();
        }
      };
    }

    micBtn.addEventListener('click', ()=>{
      if(!recog){ setupSpeech(); }
      if(!recog) return;
      if(!listening) recog.start(); else recog.stop();
    });

    // ---------- Word list import/export ----------
    document.getElementById('loadWords').addEventListener('click', ()=>{
      const raw = document.getElementById('wordListArea').value.split(/\r?\n/).map(toNFC);
      const filtered = onlyTamilFive(raw);
      if(filtered.length<1){
        toast("5-எழுத்துச் சொற்கள் எதுவும் இல்லை. மீண்டும் முயலுங்கள்.");
        return;
      }
      WORDS = shuffle(filtered);
      chooseNewAnswer();
      reset();
      toast(`ஏற்றப்பட்டது: ${WORDS.length} சொற்கள்.`);
    });



    // ---------- Buttons & keys ----------
    inputEl.addEventListener('input', onType);
    enterBtn.addEventListener('click', enter);
    newBtn.addEventListener('click', ()=>{ chooseNewAnswer(); reset(); toast("புதிய சொல்!"); });
    
    // ---------- Tamil Letter Splitter Demo ----------
    document.getElementById('splitBtn').addEventListener('click', function() {
      const tamilInput = document.getElementById('tamilInput').value;
      const result = splitTamilLetters(tamilInput);
      
      // Display the result with each element in a pill
      const resultEl = document.getElementById('splitResult');
      if (!result.length) {
        resultEl.innerHTML = '<span style="color:var(--muted)">உள்ளீடு இல்லை (No input)</span>';
        return;
      }
      
      // Helper function to safely escape HTML special characters
      function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }
      
      let html = '<div style="display:flex;flex-wrap:wrap;gap:8px">';
      result.forEach((letter, index) => {
        const safeText = escapeHtml(letter);
        html += `<div style="background:var(--key);padding:8px 12px;border-radius:8px;display:flex;align-items:center;justify-content:center;min-width:40px">
          <span>${safeText}</span>
          <small style="margin-left:5px;color:var(--muted)">${index+1}</small>
        </div>`;
      });
      html += '</div>';
      
      resultEl.innerHTML = html;
    });
    
    // Trigger split on initial load to demonstrate with the default value
    setTimeout(() => document.getElementById('splitBtn').click(), 500);
    helpBtn.addEventListener('click', ()=>{
      alert(
`எப்படி விளையாடுவது:
• நாளின் சொல் (5 graphemes) 6 முயற்சிகளில் கண்டுபிடிக்கவும்.
• 🎤 பட்டனை அழுத்தி பேசலாம், அல்லது தட்டச்சு செய்யலாம்.
• பச்சை = சரியான எழுத்து, சரியான இடம்
• மஞ்சள் = சரியான எழுத்து, தவறான இடம்
• கருமை = அந்த எழுத்து இல்லை
`
      );
    });

    document.addEventListener('keydown', (e)=>{
      if(locked && e.key!=='Enter') return;
      if(e.key==='Enter'){ enter(); }
      else if(e.key==='Backspace'){ backspace(); }
    });

    // ---------- Init ----------

    window.onload = ()=>{
    chooseNewAnswer();
    reset();
    setupSpeech();
    }