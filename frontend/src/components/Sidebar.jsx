import React from 'react';
import { PlusCircle, X, PanelLeftClose } from 'lucide-react';
import SearchBar from './SearchBar';
import ChatList from './ChatList';

const Sidebar = ({ isOpenMobile, isOpenDesktop, onCloseMobile, onToggleDesktop, onNewChat, chats, activeChatId, onSelectChat, onRenameChat, onDeleteChat, searchTerm, setSearchTerm }) => {
    return (
        <div className={`fixed z-30 inset-y-0 left-0 bg-[#202123] transform transition-all duration-300 ease-in-out flex flex-col border-r border-[#ffffff10]
            ${isOpenMobile ? 'translate-x-0 w-64' : '-translate-x-full w-64'} 
            md:translate-x-0 ${isOpenDesktop ? 'md:w-64' : 'md:w-0 overflow-hidden border-r-0'} md:relative
        `}>
            <div className={`flex flex-col h-full w-64 min-w-[16rem]`}>
                {/* Top New Chat Button & Panel Toggle */}
                <div className="p-3 flex items-center justify-between">
                    <button 
                        className="flex-1 flex items-center gap-3 border border-gray-600 rounded-md p-3 hover:bg-[#2A2B32] transition-colors text-sm text-white font-medium shadow-sm"
                        onClick={() => {
                            onNewChat();
                            if (window.innerWidth < 768) onCloseMobile();
                        }}
                    >
                        <PlusCircle size={16} />
                        <span>New Chat</span>
                    </button>
                    
                    <button 
                        onClick={onToggleDesktop}
                        className="hidden md:ml-3 md:flex p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors border border-gray-700 hover:border-gray-500"
                        title="Close sidebar"
                    >
                        <PanelLeftClose size={20} />
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
                            if (window.innerWidth < 768) onCloseMobile();
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
            </div>
            
            {/* Mobile close button */}
            {isOpenMobile && (
                <button 
                    className="md:hidden absolute top-4 -right-12 w-10 h-10 flex items-center justify-center bg-gray-800 text-white rounded-md shadow-md border border-gray-700"
                    onClick={onCloseMobile}
                >
                    <X size={20} />
                </button>
            )}
        </div>
    );
};

export default Sidebar;
