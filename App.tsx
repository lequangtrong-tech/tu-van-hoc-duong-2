import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import MessageBubble from './components/MessageBubble';
import InputArea from './components/InputArea';
import { Message, Role } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: Role.MODEL,
      content: 'Chào bạn! 👋 Mình là Người Bạn Đồng Hành. Hôm nay bạn cảm thấy thế nào? Có chuyện gì muốn chia sẻ với mình không? 😊',
      timestamp: Date.now(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: uuidv4(),
      role: Role.USER,
      content: text,
      timestamp: Date.now(),
    };

    // Optimistic update
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const { text: reply, isCrisis } = await sendMessageToGemini(text);
      
      const botMsg: Message = {
        id: uuidv4(),
        role: Role.MODEL,
        content: reply,
        isCrisis: isCrisis,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([{
      id: uuidv4(),
      role: Role.MODEL,
      content: 'Chào bạn! 👋 Mình là Người Bạn Đồng Hành. Hôm nay bạn cảm thấy thế nào? Có chuyện gì muốn chia sẻ với mình không? 😊',
      timestamp: Date.now(),
    }]);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header onReset={handleReset} />
      
      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="max-w-3xl mx-auto flex flex-col">
          <div className="text-center text-xs text-slate-400 my-4 bg-slate-100 inline-block mx-auto px-3 py-1 rounded-full">
            Cuộc trò chuyện được bảo mật
          </div>
          
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isLoading && (
            <div className="flex justify-start mb-4 animate-fade-in">
               <div className="bg-white px-5 py-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 flex items-center gap-1">
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <InputArea onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default App;