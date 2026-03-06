import React from 'react';
import { PlusCircle, X } from 'lucide-react';
import SearchBar from './SearchBar';
import ChatList from './ChatList';

const Sidebar = ({ isOpen, onClose, onNewChat, chats, activeChatId, onSelectChat, onRenameChat, onDeleteChat, searchTerm, setSearchTerm }) => {
    return (
        <div className={`fixed z-30 inset-y-0 left-0 w-64 bg-[#202123] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative transition-transform duration-300 ease-in-out flex flex-col border-r border-[#ffffff10]`}>
            {/* Top New Chat Button */}
            <div className="p-3">
                <button 
                    className="flex items-center gap-3 w-full border border-gray-600 rounded-md p-3 hover:bg-[#2A2B32] transition-colors text-sm text-white font-medium shadow-sm"
                    onClick={() => {
                        onNewChat();
                        if (window.innerWidth < 768) onClose();
                    }}
                >
                    <PlusCircle size={16} />
                    <span>New Chat</span>
                </button>
            </div>
            
            <SearchBar onSearch={setSearchTerm} />

            <div className="flex-1 overflow-hidden flex flex-col relative px-1">
                <div className="text-xs text-gray-500 font-medium mb-2 px-3 pt-2 tracking-wider">
                    {searchTerm ? 'Search Results' : 'Recent Chats'}
                </div>
                <ChatList 
                    chats={chats} 
                    activeChatId={activeChatId} 
                    onSelectChat={(id) => {
                        onSelectChat(id);
                        if (window.innerWidth < 768) onClose();
                    }} 
                    onRenameChat={onRenameChat}
                    onDeleteChat={onDeleteChat}
                />
            </div>

            {/* Bottom Profile Area */}
            <div className="p-4 border-t border-gray-700/50 mt-auto">
                <div className="flex items-center gap-3 w-full hover:bg-[#2A2B32] p-2 rounded-md cursor-pointer transition-colors text-gray-200">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-md text-white">
                        U
                    </div>
                    <span className="text-sm font-medium">User Profile</span>
                </div>
            </div>
            
            {/* Mobile close button */}
            <button 
                className="md:hidden absolute top-4 -right-12 w-10 h-10 flex items-center justify-center bg-gray-800 text-white rounded-md shadow-md border border-gray-700"
                onClick={onClose}
            >
                <X size={20} />
            </button>
        </div>
    );
};

export default Sidebar;
