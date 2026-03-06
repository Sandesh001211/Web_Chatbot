import React, { useEffect, useRef } from 'react';
import { Bot, Menu, Edit, PanelLeftOpen } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';

const ChatWindow = ({ messages, isLoading, onSendMessage, onOpenSidebarMobile, onToggleSidebarDesktop, isSidebarOpenDesktop, onNewChat }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return (
        <div className="flex-1 flex flex-col h-full w-full relative bg-[#343541]">
            {/* Desktop Header for Toggle */}
            {!isSidebarOpenDesktop && (
                <div className="hidden md:flex absolute top-4 left-4 z-10">
                    <button 
                        onClick={onToggleSidebarDesktop}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors border border-gray-700 hover:border-gray-500 bg-[#343541]"
                        title="Open sidebar"
                    >
                        <PanelLeftOpen size={20} />
                    </button>
                    <button 
                        onClick={onNewChat}
                        className="p-2 ml-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors border border-gray-700 hover:border-gray-500 bg-[#343541]"
                        title="New Chat"
                    >
                        <Edit size={20} />
                    </button>
                </div>
            )}

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-3 bg-[#343541] border-b border-gray-700/50 sticky top-0 z-10 w-full text-white">
                <button onClick={onOpenSidebarMobile} className="p-2 hover:bg-gray-700 rounded-md transition-colors">
                    <Menu size={24} />
                </button>
                <div className="font-semibold text-lg flex items-center gap-2">
                    <Bot size={20} className="text-[#10a37f]" /> Gemini
                </div>
                <button onClick={onNewChat} className="p-2 hover:bg-gray-700 rounded-md transition-colors" title="New Chat">
                    <Edit size={20} />
                </button>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto w-full flex flex-col pt-0 md:pt-4 pb-32 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full px-4 text-center mt-auto mb-auto">
                        <div className="w-16 h-16 bg-[#10a37f] rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-[#10a37f]/20">
                            <Bot size={36} className="text-white drop-shadow-md" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">How can I help you today?</h1>
                        <p className="text-gray-400 mb-8 max-w-sm">Ask me anything. I am powered by Gemini API with streaming responses.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 w-full max-w-2xl text-left">
                            {[
                                "Explain quantum computing in simple terms", 
                                "Write a React component for a button", 
                                "Give me a 3-day workout plan", 
                                "Tell me a joke about programming"
                            ].map((suggestion, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => onSendMessage(suggestion)}
                                    className="p-4 bg-[#40414f] border border-gray-600/50 hover:bg-[#2A2B32] hover:border-gray-500 rounded-xl transition-all shadow-sm text-sm text-gray-200"
                                >
                                    {suggestion} →
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, index) => (
                            <MessageBubble 
                                key={msg.id || index} 
                                message={msg.content} 
                                isBot={msg.role === 'assistant'} 
                                timestamp={msg.timestamp}
                            />
                        ))}
                    </>
                )}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Message Input Form */}
            <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
        </div>
    );
};

export default ChatWindow;
