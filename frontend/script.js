async function summarize() {
    const text = document.getElementById("inputText").value;
    const method = document.getElementById("method").value;
  
    const response = await fetch("http://localhost:8081/summarize-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, method }),
    });
  
    const data = await response.json();
    document.getElementById("summaryResult").innerText = data.summary;
  }
  
  async function ask() {
    const context = document.getElementById("contextText").value;
    const question = document.getElementById("questionInput").value;
  
    const response = await fetch("http://localhost:8081/ask-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context, question }),
    });
  
    const data = await response.json();
    document.getElementById("answerResult").innerText = data.answer;
  }
  
  function downloadSummary(format) {
    const summary = document.getElementById('summaryResult').innerText;
    if (!summary) {
        alert('Please generate a summary first.');
        return;
    }
    
    let blob;
    let filename = "summary";

    if (format === "txt") {
        blob = new Blob([summary], { type: "text/plain" });
        filename += ".txt";
    } else if (format === "pdf") {
        // Using jsPDF library
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Split text into lines to avoid overflow
        const textLines = doc.splitTextToSize(summary, 180);
        doc.text(textLines, 15, 15);
        doc.save("summary.pdf");
        return;
    } else if (format === "docx") {
        // Simple HTML-based approach for DOCX-like file
        const content = `<html><body><p>${summary.replace(/\n/g, "<br>")}</p></body></html>`;
        blob = new Blob(['\ufeff' + content], { type: "application/msword" });
        filename += ".doc";
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
