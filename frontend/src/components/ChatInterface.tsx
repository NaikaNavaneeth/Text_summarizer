
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader, Send, MessageCircle } from "lucide-react";
import { askQuestion } from '@/services/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  status: 'sent' | 'loading' | 'error';
}

interface ChatInterfaceProps {
  documentSummary?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ documentSummary = '' }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: "Hello! I can answer questions about your summarized document. How can I help you today?", 
      sender: 'bot', 
      status: 'sent' 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      status: 'sent'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Use the real API to get an answer
      const response = await askQuestion({
        context: documentSummary,
        question: inputText.trim()
      });
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.answer,
        sender: 'bot',
        status: 'sent'
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting answer:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I couldn't process your question. Please try again.",
        sender: 'bot',
        status: 'error'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="border border-gray-200 shadow-md overflow-hidden bg-white rounded-xl">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-5">
          <MessageCircle className="h-5 w-5 text-violet-500" />
          <Label className="text-md font-medium text-gray-800">
            Ask about the Document
          </Label>
        </div>
        
        <div className="flex flex-col h-[400px] md:h-[450px]">
          <ScrollArea className="flex-1 p-4 bg-gray-50 rounded-lg mb-4">
            <div className="space-y-4">
              {messages.map(message => (
                <div 
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-4 py-3 animate-fade-in
                      ${message.sender === 'user' 
                        ? 'bg-violet-100 text-gray-800' 
                        : 'bg-white border border-gray-200 shadow-sm text-gray-700'}`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 shadow-sm text-gray-700 max-w-[80%] rounded-lg px-4 py-3 animate-fade-in flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin text-violet-500" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="flex gap-2 items-center">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              className="border-gray-300 focus:ring-violet-300 focus:border-violet-400 transition-all duration-200"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputText.trim() || isLoading}
              className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all group py-2 px-4"
            >
              <Send className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-150" />
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;

