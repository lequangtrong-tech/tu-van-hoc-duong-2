import React from 'react';
import { Message, Role } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;
  const isCrisis = message.isCrisis;

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div
        className={`
          max-w-[85%] md:max-w-[70%] px-5 py-3 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm
          ${isUser 
            ? 'bg-primary text-white rounded-br-none' 
            : isCrisis 
              ? 'bg-red-50 border border-red-200 text-red-800 rounded-bl-none shadow-red-100' 
              : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
          }
        `}
      >
        {isCrisis && (
            <div className="flex items-center gap-2 mb-2 text-red-600 font-bold uppercase tracking-wide text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                </svg>
                Thông báo khẩn cấp
            </div>
        )}
        <div className="whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;