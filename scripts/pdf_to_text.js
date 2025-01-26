const fileInput = document.getElementById("fileInput");
const output = document.getElementById("output");

fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    output.innerHTML = ""; // Clear previous results

    const pdfData = await file.arrayBuffer();

    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

    const pdf = await pdfjsLib.getDocument(pdfData).promise;

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });

        // Create canvas to render PDF page
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: context,
            viewport: viewport,
        }).promise;

        // Convert canvas to PNG data URL
        const pngDataUrl = canvas.toDataURL("image/png");

        // Extract text using Tesseract.js
        const textContainer = document.createElement("div");
        textContainer.className = "pdf-text-container";
        textContainer.textContent = "Extracting text...";

        Tesseract.recognize(
            pngDataUrl,
            "tam", // Tamil language code
            {
                logger: (info) => console.log(info), // Logs OCR progress
            }
        ).then(({ data: { text } }) => {
            textContainer.textContent = text; // Display extracted text
        }).catch((err) => {
            textContainer.textContent = "Error extracting text: " + err.message;
        });

        // Create a container for the page
        const pageContainer = document.createElement("div");
        pageContainer.className = "pdf-page-container";

        // Append canvas and text container to the page container
        pageContainer.appendChild(canvas);
        pageContainer.appendChild(textContainer);

        // Append the page container to the output
        output.appendChild(pageContainer);
    }
});