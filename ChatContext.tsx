import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, ChatThread, User } from '../types';
import { storage, STORAGE_KEYS } from '../services/storage';
import { useAuth } from './AuthContext';

interface ChatContextType {
  threads: (ChatThread & { partner: User })[];
  unreadMessageCount: number;
  refreshThreads: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<(ChatThread & { partner: User })[]>([]);

  const refreshThreads = () => {
    if (!user) {
      setThreads([]);
      return;
    }

    const allThreads = storage.get<ChatThread>(STORAGE_KEYS.CHATS);
    const userThreads = allThreads.filter(t => t.participants.includes(user.id));
    
    const enriched = userThreads.map(t => {
      const partnerId = t.participants.find(id => id !== user.id);
      const partner = storage.getOne<User>(STORAGE_KEYS.USERS, partnerId!) || { name: 'Unknown User' } as User;
      return { ...t, partner };
    }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    setThreads(enriched);
  };

  useEffect(() => {
    refreshThreads();
    const interval = setInterval(refreshThreads, 5000); // Poll for updates
    return () => clearInterval(interval);
  }, [user]);

  // For this mock, we'll consider threads with updatedAt > last visit or something as "unread" 
  // but let's keep it simple: unreadMessageCount is just a mock for now or 0 if nothing new.
  // In a real app we'd have a 'read' status on messages or thread members.
  const unreadMessageCount = threads.filter(t => !t.lastMessage?.includes('seen')).length > 0 ? threads.length : 0; 

  return (
    <ChatContext.Provider value={{ threads, unreadMessageCount, refreshThreads }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
