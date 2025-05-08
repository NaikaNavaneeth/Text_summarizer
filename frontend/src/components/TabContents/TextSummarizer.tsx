
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Upload, Sparkles, Download, FileDown } from "lucide-react";
import ChatInterface from '@/components/ChatInterface';
import { summarizeText, downloadAsTxt, downloadAsPdf, downloadAsDocx } from '@/services/api';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const TextSummarizer = () => {
  const [inputText, setInputText] = useState('');
  const [summaryOutput, setSummaryOutput] = useState('');
  const [summaryMethod, setSummaryMethod] = useState('extractive');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [useOpenAI, setUseOpenAI] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setSummaryOutput('Please enter some text to summarize.');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await summarizeText({ 
        text: inputText, 
        method: summaryMethod,
        length: summaryLength,
        useOpenAI: useOpenAI
      });
      setSummaryOutput(result.summary);
      setShowChat(true);
    } catch (error) {
      console.error('Error summarizing text:', error);
      setSummaryOutput('An error occurred while summarizing the text. Please try again.');
    } finally {
      setIsLoading(false);
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
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-violet-500" />
              <Label htmlFor="input-text" className="text-md font-medium text-gray-800">
                Input Text
              </Label>
            </div>
            <Textarea
              id="input-text"
              placeholder="Paste or type your text here..."
              className="min-h-[200px] focus:border-violet-400 focus:ring-violet-300 transition-all duration-200 resize-none border-gray-300"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-5 rounded-lg">
            <div>
              <Label htmlFor="summary-method" className="block text-sm font-medium text-gray-700 mb-2">
                Summarization Method
              </Label>
              <Select 
                value={summaryMethod} 
                onValueChange={setSummaryMethod}
              >
                <SelectTrigger id="summary-method" className="border-gray-300 focus:ring-violet-300 focus:border-violet-400">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="extractive">Extractive</SelectItem>
                  <SelectItem value="abstractive">Abstractive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="summary-length" className="block text-sm font-medium text-gray-700 mb-2">
                Summary Length
              </Label>
              <Select 
                value={summaryLength} 
                onValueChange={setSummaryLength}
              >
                <SelectTrigger id="summary-length" className="border-gray-300 focus:ring-violet-300 focus:border-violet-400">
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
              disabled={isLoading || !inputText.trim()}
            >
              <Sparkles className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-150" />
              {isLoading ? 'Summarizing...' : 'Summarize Text'}
            </Button>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-500" />
                <Label htmlFor="output-text" className="text-md font-medium text-gray-800">
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
              id="output-text"
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

export default TextSummarizer;





