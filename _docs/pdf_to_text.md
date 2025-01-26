---
category: Teacher
order: 3
title: தமிழ் PDF to Image
---
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/tesseract.js@4.1.1/dist/tesseract.min.js"></script>
<script src="{{ site.baseurl }}/scripts/track.js"></script>

<h1>PDF to Image & Tamil Text Extraction</h1>
<input type="file" id="fileInput" accept="application/pdf">
<div id="output"></div>

 
<script src="{{ site.baseurl }}/scripts/pdf_to_text.js"></script>
<script>
tracker();
</script>
<div id="tracker"></div>