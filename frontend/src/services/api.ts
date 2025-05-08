const API_URL = 'http://localhost:8085';

import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export interface SummaryRequest {
  text: string;
  method: string;
  length?: string; // "short", "medium", or "detailed"
  useOpenAI?: boolean;
}

export interface QARequest {
  context: string;
  question: string;
}

export const summarizeText = async (request: SummaryRequest): Promise<{summary: string}> => {
  console.log("Sending request to backend:", request);
  
  try {
    const response = await fetch(`${API_URL}/summarize-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      console.error("Backend error:", response.status, response.statusText);
      throw new Error('Failed to summarize text');
    }
    
    return response.json();
  } catch (error) {
    console.error("Network or parsing error:", error);
    throw new Error('Failed to summarize text');
  }
};

export const askQuestion = async (request: QARequest): Promise<{answer: string}> => {
  const response = await fetch(`${API_URL}/ask-question`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    throw new Error('Failed to get answer');
  }
  
  return response.json();
};

export const uploadAndSummarizePDF = async (
  file: File, 
  method: string,
  length: string = "medium",
  useOpenAI: boolean
): Promise<{summary: string}> => {
  console.log("Uploading PDF to backend:", file.name);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('method', method);
  formData.append('length', length);
  formData.append('useOpenAI', useOpenAI.toString());
  
  try {
    const response = await fetch(`${API_URL}/upload-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      console.error("Backend error:", response.status, response.statusText);
      throw new Error('Failed to upload and summarize PDF');
    }
    
    return response.json();
  } catch (error) {
    console.error("Network or parsing error:", error);
    throw new Error('Failed to upload and summarize PDF');
  }
};

export const uploadAndSummarizeDocument = async (
  file: File, 
  method: string,
  length: string = "medium",
  useOpenAI: boolean
): Promise<{summary: string}> => {
  console.log("Uploading document to backend:", file.name);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('method', method);
  formData.append('length', length);
  formData.append('useOpenAI', useOpenAI.toString());
  
  try {
    const response = await fetch(`${API_URL}/upload-document`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      console.error("Backend error:", response.status, response.statusText);
      throw new Error('Failed to upload and summarize document');
    }
    
    return response.json();
  } catch (error) {
    console.error("Network or parsing error:", error);
    throw new Error('Failed to upload and summarize document');
  }
};

// Add functions for downloading summaries in different formats
export const downloadAsTxt = (text: string, filename: string = "summary.txt") => {
  const blob = new Blob([text], { type: "text/plain" });
  saveAs(blob, filename);
};

export const downloadAsPdf = async (text: string, filename: string = "summary.pdf") => {
  const doc = new jsPDF();
  
  // Split text into lines to avoid overflow
  const textLines = doc.splitTextToSize(text, 180);
  doc.text(textLines, 15, 15);
  doc.save(filename);
};

export const downloadAsDocx = async (text: string, filename: string = "summary.docx") => {
  // Create a new document
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun(text)
          ]
        })
      ]
    }]
  });

  // Generate a blob from the document
  const blob = await Packer.toBlob(doc);
  
  // Save the blob as a file
  saveAs(blob, filename);
};



