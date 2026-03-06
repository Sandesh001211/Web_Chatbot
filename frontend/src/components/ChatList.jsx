import React from 'react';
import ChatItem from './ChatItem';

const ChatList = ({ chats, activeChatId, onSelectChat, onRenameChat, onDeleteChat }) => {
    return (
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
            <div className="flex flex-col gap-1 p-2">
                {chats.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center py-4">No previous chats</div>
                ) : (
                    chats.map(chat => (
                        <ChatItem 
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === activeChatId}
                            onClick={onSelectChat}
                            onRename={onRenameChat}
                            onDelete={onDeleteChat}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatList;
