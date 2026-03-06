import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, MoreHorizontal, Edit2, Trash2, Check, X } from 'lucide-react';

const ChatItem = ({ chat, isActive, onClick, onRename, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(chat.title || '');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRenameSubmit = () => {
        if (editTitle.trim() !== chat.title) {
            onRename(chat.id, editTitle.trim());
        }
        setIsEditing(false);
        setIsMenuOpen(false);
    };

    if (isEditing) {
        return (
            <div className={`flex items-center gap-2 p-2 rounded-md ${isActive ? 'bg-[#343541]' : 'hover:bg-[#2A2B32]'}`}>
                <MessageSquare size={16} className="flex-shrink-0 text-[#10a37f]" />
                <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="bg-transparent border border-blue-500 rounded px-1.5 py-0.5 text-sm w-full outline-none text-white focus:ring-1 focus:ring-blue-500"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                />
                <button onClick={handleRenameSubmit} className="text-gray-400 hover:text-white p-0.5">
                    <Check size={14} />
                </button>
                <button onClick={() => { setIsEditing(false); setEditTitle(chat.title); }} className="text-gray-400 hover:text-white p-0.5">
                    <X size={14} />
                </button>
            </div>
        );
    }

    return (
        <div 
            className={`group relative flex items-center gap-3 p-3 rounded-md cursor-pointer text-sm text-gray-300 transition-colors ${
                isActive ? 'bg-[#343541] pr-12' : 'hover:bg-[#2A2B32] pr-12'
            }`}
            onClick={() => onClick(chat.id)}
        >
            <MessageSquare size={16} className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
            
            <span className={`truncate w-full ${isActive ? 'text-gray-100 font-medium' : ''}`}>
                {chat.title || 'New Chat'}
            </span>
            
            {(isActive || isMenuOpen) && (
                <div 
                    ref={menuRef}
                    className="absolute right-2 top-2 z-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        className="p-1 hover:text-white hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <MoreHorizontal size={16} />
                    </button>
                    
                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 bg-[#202123] border border-gray-700 rounded-md shadow-lg py-1 w-32 z-50">
                            <button
                                onClick={() => { setIsEditing(true); setIsMenuOpen(false); }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#343541] hover:text-white flex items-center gap-2"
                            >
                                <Edit2 size={14} /> Rename
                            </button>
                            <button
                                onClick={() => { onDelete(chat.id); setIsMenuOpen(false); }}
                                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white flex items-center gap-2"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatItem;
