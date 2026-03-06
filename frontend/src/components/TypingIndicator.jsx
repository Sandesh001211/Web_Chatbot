import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
    return (
        <div className="w-full py-6 px-4 md:px-5">
            <div className="max-w-3xl mx-auto flex gap-4 md:gap-6">
                <div className="w-8 h-8 rounded bg-[#10a37f] flex items-center justify-center flex-shrink-0">
                    <Bot size={20} className="text-white" />
                </div>
                <div className="flex-1 flex gap-1 items-center overflow-hidden h-8">
                     <span className="text-sm text-gray-400 mr-2 italic">Gemini is typing</span>
                     <div className="flex space-x-1 items-center">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;
