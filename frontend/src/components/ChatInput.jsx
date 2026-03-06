import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [message]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
         textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#343541] via-[#343541] to-transparent pt-6 pb-6 z-10">
      <div className="max-w-3xl mx-auto px-4 md:px-0 relative mb-4">
        <form onSubmit={handleSubmit} className="relative flex items-center bg-[#40414F] shadow-lg rounded-xl border border-gray-600/50 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-500 overflow-hidden pr-2 transition-all">
          <textarea
            ref={textareaRef}
            rows="1"
            className="w-full bg-transparent text-gray-100 placeholder-gray-400 p-3.5 md:p-4 focus:outline-none resize-none max-h-[200px]"
            placeholder="Send a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="flex-shrink-0 p-2 text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 disabled:opacity-30 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all m-2"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
        <div className="text-center text-xs text-gray-400 mt-3 absolute -bottom-5 left-0 right-0">
          Gemini can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
