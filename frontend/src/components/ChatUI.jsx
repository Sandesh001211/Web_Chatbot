import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp, setDoc } from '../firebase';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

const ChatUI = () => {
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
    const [isSidebarOpenDesktop, setIsSidebarOpenDesktop] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Load Chat Sessions List
    useEffect(() => {
        if (!db) {
            console.warn("Firebase not configured");
            return;
        }
        const q = query(collection(db, "chats"), orderBy("updatedAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatsData = [];
            snapshot.forEach((doc) => {
                chatsData.push({ id: doc.id, ...doc.data() });
            });
            setChats(chatsData);
            
            // Auto select first chat if none selected
            if (!activeChatId && chatsData.length > 0) {
                setActiveChatId(chatsData[0].id);
            }
        });
        return () => unsubscribe();
    }, [activeChatId]);

    // Load Messages for Active Chat
    useEffect(() => {
        if (!db || !activeChatId) {
            setMessages([]);
            return;
        }
        
        const q = query(collection(db, "chats", activeChatId, "messages"), orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = [];
            snapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() });
            });
            setMessages(msgs);
        });
        return () => unsubscribe();
    }, [activeChatId]);

    const handleCreateNewChat = async () => {
        if (!db) return;
        try {
            const newChatRef = await addDoc(collection(db, "chats"), {
                title: "New Chat",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            setActiveChatId(newChatRef.id);
            setMessages([]); // Clear locally immediately
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };

    const handleRenameChat = async (id, newTitle) => {
        if (!db) return;
        try {
            await updateDoc(doc(db, "chats", id), { title: newTitle });
        } catch (error) {
            console.error("Error renaming chat:", error);
        }
    };

    const handleDeleteChat = async (id) => {
        if (!db) return;
        try {
            await deleteDoc(doc(db, "chats", id));
            
            if (activeChatId === id) {
                const remainingChats = chats.filter(c => c.id !== id);
                setActiveChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
            }
        } catch (error) {
            console.error("Error deleting chat:", error);
        }
    };

    const generateTitle = (message) => {
        const title = message.substring(0, 40);
        return title.length === 40 ? title + "..." : title;
    };

    const handleSendMessage = async (text) => {
        if (!db) return;

        let currentChatId = activeChatId;
        
        // If there is no active chat or we just typed something in an empty setup
        if (!currentChatId) {
            try {
                const newChatRef = await addDoc(collection(db, "chats"), {
                    title: generateTitle(text),
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                currentChatId = newChatRef.id;
                setActiveChatId(currentChatId);
            } catch (err) {
                 console.error("Failed to create chat doc", err);
                 return;
            }
        } else {
            // Update title if it's the first message
            if (messages.length === 0) {
                 await updateDoc(doc(db, "chats", currentChatId), {
                     title: generateTitle(text),
                     updatedAt: serverTimestamp()
                 });
            } else {
                 await updateDoc(doc(db, "chats", currentChatId), {
                     updatedAt: serverTimestamp()
                 });
            }
        }

        // Save User Message to Firestore
        await addDoc(collection(db, "chats", currentChatId, "messages"), {
            role: "user",
            content: text,
            timestamp: Date.now()
        });

        setIsLoading(true);

        // Call backend proxy for AI Stream
        try {
            const response = await fetch('http://localhost:5000/chat/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: text,
                    history: messages
                })
            });

            if (!response.ok) throw new Error("Network response was not ok");
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            
            let assistantMessage = "";
            let isStreaming = true;
            let hasStartedStreaming = false;

            // Generate a temporary ID for the streaming message
            const tempBotId = 'stream-' + Date.now();

            while (isStreaming) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n\n");
                
                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const dataStr = line.substring(6);
                        if (dataStr === "[DONE]") {
                            isStreaming = false;
                            break;
                        }
                        
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.error) {
                                assistantMessage += "\n\n**Error:** " + data.error;
                            } else if (data.text) {
                                assistantMessage += data.text;
                                
                                if (!hasStartedStreaming) {
                                    hasStartedStreaming = true;
                                    setIsLoading(false); // Stop typing indicator only when text actually arrives
                                    setMessages(prev => [...prev, { id: tempBotId, role: "assistant", content: assistantMessage, timestamp: Date.now() }]);
                                } else {
                                    // Update ONLY the local react state while streaming to avoid Firestore 1-write-per-second limit
                                    setMessages(prev => 
                                        prev.map(msg => msg.id === tempBotId ? { ...msg, content: assistantMessage } : msg)
                                    );
                                }
                            }
                        } catch (e) {
                            // Incomplete chunk parse error
                        }
                    }
                }
            }

            setIsLoading(false);

            // Streaming finished, NOW save the final complete message to Firestore
            await addDoc(collection(db, "chats", currentChatId, "messages"), {
                role: "assistant",
                content: assistantMessage,
                timestamp: Date.now()
            });
            
        } catch (error) {
            console.error("Stream connection failed:", error);
            await addDoc(collection(db, "chats", currentChatId, "messages"), {
                role: "assistant",
                content: "Sorry, I encountered an error connecting to the server.",
                timestamp: Date.now()
            });
            setIsLoading(false);
        }
    };

    const filteredChats = chats.filter(chat => 
        chat.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen w-full bg-[#343541] text-white flex-row overflow-hidden font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpenMobile && (
                <div 
                    className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpenMobile(false)}
                />
            )}

            <Sidebar 
                isOpenMobile={isSidebarOpenMobile}
                isOpenDesktop={isSidebarOpenDesktop}
                onCloseMobile={() => setIsSidebarOpenMobile(false)}
                onToggleDesktop={() => setIsSidebarOpenDesktop(!isSidebarOpenDesktop)}
                onNewChat={handleCreateNewChat}
                chats={filteredChats}
                activeChatId={activeChatId}
                onSelectChat={setActiveChatId}
                onRenameChat={handleRenameChat}
                onDeleteChat={handleDeleteChat}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <ChatWindow 
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onOpenSidebarMobile={() => setIsSidebarOpenMobile(true)}
                onToggleSidebarDesktop={() => setIsSidebarOpenDesktop(!isSidebarOpenDesktop)}
                isSidebarOpenDesktop={isSidebarOpenDesktop}
                onNewChat={handleCreateNewChat}
            />
        </div>
    );
};

export default ChatUI;
