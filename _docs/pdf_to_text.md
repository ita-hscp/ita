---
category: Teacher
order: 3
title: தமிழ்  உரை மாற்றி 
---
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/tesseract.js@4.1.1/dist/tesseract.min.js"></script>
<script src="{{ site.baseurl }}/scripts/track.js"></script>

<h1>தமிழ்  உரை மாற்றி</h1>
<p> PDF கோப்புகளைத் தேர்ந்தெடுத்து, அவற்றில் உள்ள தமிழ்ச் சொற்களை உரையாக மாற்றி காண்பிக்கலாம். </p>
<input type="file" id="fileInput" accept="application/pdf">
<div id="output"></div>

 
<script src="{{ site.baseurl }}/scripts/pdf_to_text.js"></script>
<script>
tracker();
</script>
<div id="tracker"></div>