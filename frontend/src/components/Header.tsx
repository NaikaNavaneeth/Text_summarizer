
import React from 'react';
import { BookOpen } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-6 bg-gradient-to-r from-violet-600 to-violet-500 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 flex items-center">
        <BookOpen className="h-8 w-8 text-white mr-3" />
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          AI Text Summarizer
        </h1>
      </div>
    </header>
  );
};

export default Header;
