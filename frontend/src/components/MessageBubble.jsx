import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User, Bot, Copy, Check } from 'lucide-react';
import { format } from 'date-fns';

const CodeBlock = ({ inline, className, children, ...props }) => {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');

    const handleCopy = () => {
        navigator.clipboard.writeText(codeString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!inline && match) {
        return (
            <div className="relative rounded-md overflow-hidden bg-[#1e1e1e] my-4 border border-gray-700">
                <div className="flex justify-between items-center px-4 py-1.5 bg-[#2d2d2d] text-gray-300 text-xs">
                    <span>{match[1]}</span>
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-1 hover:text-white transition-colors p-1"
                        title="Copy Code"
                    >
                        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <SyntaxHighlighter
                    {...props}
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                >
                    {codeString}
                </SyntaxHighlighter>
            </div>
        );
    }
    return (
        <code {...props} className={className + " bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-gray-200"}>
            {children}
        </code>
    );
};

const MessageBubble = ({ message, isBot, timestamp }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyMessage = () => {
        navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`w-full py-6 px-4 md:px-5 group ${isBot ? 'bg-[#444654] border-b border-t border-black/10' : 'bg-transparent'}`}>
            <div className="max-w-3xl mx-auto flex gap-4 md:gap-6 relative">
                
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center text-white shadow-sm mt-1 ${isBot ? 'bg-[#10a37f]' : 'bg-indigo-600'}`}>
                    {isBot ? <Bot size={20} /> : <User size={20} />}
                </div>

                {/* Message Content */}
                <div className="flex-1 overflow-hidden">
                    <div className="font-semibold text-gray-100 flex items-center gap-3">
                        <span>{isBot ? 'Gemini AI' : 'You'}</span>
                        {timestamp && (
                            <span className="text-xs text-gray-400 font-normal">
                                {format(new Date(timestamp), 'h:mm a')}
                            </span>
                        )}
                    </div>
                    
                    <div className="text-gray-200 mt-2 prose prose-invert max-w-none text-[15px] leading-relaxed break-words">
                        <ReactMarkdown components={{ code: CodeBlock }}>
                            {message}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Global Message Copy button (appears on hover) */}
                <button
                    onClick={handleCopyMessage}
                    className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 p-1.5 bg-[#2A2B32] md:bg-transparent rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-all flex items-center gap-1 text-xs"
                    title="Copy Message"
                >
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>

            </div>
        </div>
    );
};

export default MessageBubble;
