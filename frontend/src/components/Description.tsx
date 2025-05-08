
import React from 'react';

const Description = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-10 mb-8 px-6 text-center">
      <h2 className="text-xl md:text-2xl font-medium text-gray-800 mb-3 animate-fade-in">
        Summarize your text, PDFs, and documents using advanced AI models.
      </h2>
      <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
        Get concise summaries instantly with our powerful AI-driven summarization tool.
        Simply paste your text or upload your files and let our AI do the work.
      </p>
      <div className="mt-6 flex justify-center">
        <div className="w-20 h-1 bg-gradient-to-r from-violet-600 to-violet-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default Description;
