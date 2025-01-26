---
category: HSCP 3
order: 2
title: தமிழ் சொற்களோடு பொருத்துக
---
<h1>சொற்களோடு பொருத்துக</h1>
<h2 id="description"></h2>
  <!-- Exercise Selector -->
  <div>
    <label for="exercise-select">பயிற்சி:</label>
    <select id="exercise-select">
    </select>
  </div>

  <div class="match-container">
    <div class="match-list" id="words-list">
      <h3>ஒருமை</h3>
    </div>
    <div class="match-list" id="meanings-list">
      <h3>பன்மை</h3>
    </div>
  </div>
<script src="{{ site.baseurl }}/scripts/match.js"></script>
<script src="{{ site.baseurl }}/scripts/track.js"></script>
<script>
tracker();
</script>

