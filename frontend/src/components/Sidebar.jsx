import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle, X, PanelLeftClose, LogOut, MoreHorizontal } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import SearchBar from './SearchBar';
import ChatList from './ChatList';

const Sidebar = ({ user, isOpenMobile, isOpenDesktop, onCloseMobile, onToggleDesktop, onNewChat, chats, activeChatId, onSelectChat, onRenameChat, onDeleteChat, searchTerm, setSearchTerm }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSignOut = () => {
        signOut(auth).catch(error => console.error('Error signing out:', error));
    };

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
                <div className="p-3 mt-auto relative border-t border-gray-700/50" ref={profileRef}>
                    {/* The Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#343541] border border-gray-600 rounded-lg shadow-xl overflow-hidden py-1 z-50">
                            <div className="px-3 py-3 text-sm text-gray-200">
                                <div className="font-medium truncate">{user?.displayName || 'User'}</div>
                                <div className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</div>
                            </div>
                            <div className="border-t border-gray-700/50 my-1"></div>
                            <button 
                                onClick={handleSignOut}
                                className="w-full text-left px-3 py-2.5 text-sm text-gray-200 hover:bg-[#40414f] transition-colors flex items-center gap-3"
                            >
                                <LogOut size={16} />
                                Log Out
                            </button>
                        </div>
                    )}

                    {/* The Profile Trigger Button */}
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={`flex items-center gap-3 w-full p-2 rounded-md cursor-pointer transition-colors text-gray-200 ${isProfileOpen ? 'bg-[#343541]' : 'hover:bg-[#2A2B32]'}`}
                    >
                        <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-md text-white flex-shrink-0">
                            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
                        </div>
                        <span className="text-sm font-medium truncate flex-1 text-left">
                            {user?.displayName || user?.email || 'User'}
                        </span>
                        <MoreHorizontal size={16} className="text-gray-400" />
                    </button>
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
