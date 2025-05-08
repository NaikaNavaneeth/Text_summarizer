
import React from 'react';
import Header from '@/components/Header';
import Description from '@/components/Description';
import TabInterface from '@/components/TabInterface';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <main className="flex-1 pb-16">
        <Description />
        <TabInterface />
      </main>
      <footer className="w-full py-6 bg-white border-t border-gray-200 shadow-inner">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} AI Text Summarizer. All rights reserved.
          </div>
          <div className="text-sm text-gray-400 mt-2 md:mt-0">
            Powered by Advanced AI Technology
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;