
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextSummarizer from './TabContents/TextSummarizer';
import PDFSummarizer from './TabContents/PDFSummarizer';
import DocumentSummarizer from './TabContents/DocumentSummarizer';

const TabInterface = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-6 px-6">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger 
            value="text" 
            className="text-sm sm:text-base data-[state=active]:bg-white data-[state=active]:text-violet-600 data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
          >
            Text Summarization
          </TabsTrigger>
          <TabsTrigger 
            value="pdf" 
            className="text-sm sm:text-base data-[state=active]:bg-white data-[state=active]:text-violet-600 data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
          >
            PDF Summarization
          </TabsTrigger>
          <TabsTrigger 
            value="doc" 
            className="text-sm sm:text-base data-[state=active]:bg-white data-[state=active]:text-violet-600 data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
          >
            Document Summarization
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="animate-fade-in">
          <TextSummarizer />
        </TabsContent>
        
        <TabsContent value="pdf" className="animate-fade-in">
          <PDFSummarizer />
        </TabsContent>
        
        <TabsContent value="doc" className="animate-fade-in">
          <DocumentSummarizer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabInterface;
