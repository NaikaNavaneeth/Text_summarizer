
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Upload, Sparkles, Download, FileDown } from "lucide-react";
import ChatInterface from '@/components/ChatInterface';
import { uploadAndSummarizePDF, downloadAsTxt, downloadAsPdf, downloadAsDocx } from '@/services/api';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const PDFSummarizer = () => {
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [summaryOutput, setSummaryOutput] = useState('');
  const [summaryMethod, setSummaryMethod] = useState('extractive');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [useOpenAI, setUseOpenAI] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFileName(selectedFile.name);
      setFile(selectedFile);
    }
  };

  const handleSummarize = async () => {
    if (!file) {
      setSummaryOutput('Please upload a PDF file first.');
      return;
    }
    
    setIsProcessing(true);
    try {
      const result = await uploadAndSummarizePDF(
        file,
        summaryMethod,
        summaryLength,
        useOpenAI
      );
      setSummaryOutput(result.summary);
      setShowChat(true);
    } catch (error) {
      console.error('Error summarizing PDF:', error);
      setSummaryOutput('An error occurred while summarizing the PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (format: 'txt' | 'pdf' | 'docx') => {
    if (!summaryOutput) {
      alert('Please generate a summary first.');
      return;
    }

    switch (format) {
      case 'txt':
        downloadAsTxt(summaryOutput);
        break;
      case 'pdf':
        downloadAsPdf(summaryOutput);
        break;
      case 'docx':
        downloadAsDocx(summaryOutput);
        break;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="border border-gray-200 shadow-md overflow-hidden bg-white rounded-xl">
        <CardContent className="p-6 md:p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-violet-500" />
              <Label className="text-md font-medium text-gray-800">
                Upload PDF
              </Label>
            </div>
            <div className={`border-2 border-dashed ${fileName ? 'border-violet-300 bg-violet-50' : 'border-gray-300'} rounded-xl p-10 text-center hover:bg-gray-50 transition-colors cursor-pointer group`}>
              <input
                type="file"
                id="pdf-upload"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
              <label htmlFor="pdf-upload" className="cursor-pointer block w-full h-full">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center mb-4 group-hover:bg-violet-200 transition-colors">
                    <Upload className={`h-8 w-8 ${isUploading ? 'text-violet-600 animate-pulse' : 'text-violet-500'} group-hover:scale-110 transition-transform`} />
                  </div>
                  <span className="text-md font-medium text-gray-700 mb-1">
                    {fileName ? fileName : "Click to upload or drag and drop"}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">PDF (up to 10MB)</p>
                  {isUploading && (
                    <div className="mt-4 w-full max-w-xs mx-auto">
                      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-1 bg-violet-500 animate-pulse" style={{width: '75%'}}></div>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-5 rounded-lg">
            <div>
              <Label htmlFor="summary-method-pdf" className="block text-sm font-medium text-gray-700 mb-2">
                Summarization Method
              </Label>
              <Select 
                value={summaryMethod} 
                onValueChange={setSummaryMethod}
              >
                <SelectTrigger id="summary-method-pdf" className="border-gray-300 focus:ring-violet-300 focus:border-violet-400">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="extractive">Extractive</SelectItem>
                  <SelectItem value="abstractive">Abstractive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="summary-length-pdf" className="block text-sm font-medium text-gray-700 mb-2">
                Summary Length
              </Label>
              <Select 
                value={summaryLength} 
                onValueChange={setSummaryLength}
              >
                <SelectTrigger id="summary-length-pdf" className="border-gray-300 focus:ring-violet-300 focus:border-violet-400">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (2-3 sentences)</SelectItem>
                  <SelectItem value="medium">Medium (1-2 paragraphs)</SelectItem>
                  <SelectItem value="detailed">Detailed (comprehensive)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mb-8">
            <Button 
              onClick={handleSummarize} 
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-lg shadow-md hover:shadow-lg transition-all group"
              disabled={!fileName || isProcessing}
            >
              <Sparkles className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-150" />
              {isProcessing ? 'Processing...' : 'Summarize PDF'}
            </Button>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-500" />
                <Label htmlFor="pdf-output" className="text-md font-medium text-gray-800">
                  Summary Output
                </Label>
              </div>
              
              {summaryOutput && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleDownload('txt')}>
                      <FileDown className="h-4 w-4 mr-2" />
                      <span>Download as TXT</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload('pdf')}>
                      <FileDown className="h-4 w-4 mr-2" />
                      <span>Download as PDF</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload('docx')}>
                      <FileDown className="h-4 w-4 mr-2" />
                      <span>Download as DOCX</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <Textarea
              id="pdf-output"
              placeholder="Summary will appear here..."
              className="min-h-[150px] bg-gray-50 border-gray-300 focus:border-violet-400 focus:ring-violet-300 transition-all duration-200 resize-none"
              value={summaryOutput}
              readOnly
            />
          </div>
        </CardContent>
      </Card>

      {showChat && (
        <div className="order-3 lg:order-2 col-span-1">
          <ChatInterface documentSummary={summaryOutput} />
        </div>
      )}
    </div>
  );
};

export default PDFSummarizer;






