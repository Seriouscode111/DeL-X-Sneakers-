import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storage, STORAGE_KEYS } from '../services/storage';
import { Message, ChatThread, User } from '../types';
import { Send, Search, User as UserIcon, MessageSquare, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Chat = () => {
  const [params] = useSearchParams();
  const sellerId = params.get('seller');
  const { user } = useAuth();
  
  const [threads, setThreads] = useState<(ChatThread & { partner: User })[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    
    // Load threads
    const allThreads = storage.get<ChatThread>(STORAGE_KEYS.CHATS);
    const userThreads = allThreads.filter(t => t.participants.includes(user.id));
    
    // Enrich threads with partner info
    const enriched = userThreads.map(t => {
      const partnerId = t.participants.find(id => id !== user.id);
      const partner = storage.getOne<User>(STORAGE_KEYS.USERS, partnerId!) || { name: 'Unknown User' } as User;
      return { ...t, partner };
    });
    
    setThreads(enriched);

    // If sellerId param exists, find or create thread
    if (sellerId && sellerId !== user.id) {
      const existing = enriched.find(t => t.participants.includes(sellerId));
      if (existing) {
        setActiveThreadId(existing.id);
      } else {
        const newThread: ChatThread = {
          id: `chat_${Date.now()}`,
          participants: [user.id, sellerId],
          updatedAt: new Date().toISOString()
        };
        storage.insertOne(STORAGE_KEYS.CHATS, newThread);
        const partner = storage.getOne<User>(STORAGE_KEYS.USERS, sellerId) || { name: 'Seller' } as User;
        setThreads([{ ...newThread, partner }, ...enriched]);
        setActiveThreadId(newThread.id);
      }
    } else if (enriched.length > 0) {
      if (enriched.length > 0) {
        setActiveThreadId(enriched[0].id);
      }
    }
  }, [user, sellerId]);

  useEffect(() => {
    if (!activeThreadId) return;
    
    const loadMessages = () => {
      const allMsgs = storage.get<Message>(STORAGE_KEYS.MESSAGES);
      setMessages(allMsgs.filter(m => m.chatId === activeThreadId));
    };
    
    loadMessages();
    const interval = setInterval(loadMessages, 3000); // Poll as "real-time" mock
    return () => clearInterval(interval);
  }, [activeThreadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeThreadId || !user) return;

    const msg: Message = {
      id: `msg_${Date.now()}`,
      chatId: activeThreadId,
      senderId: user.id,
      text: newMessage,
      createdAt: new Date().toISOString()
    };

    storage.insertOne(STORAGE_KEYS.MESSAGES, msg);
    storage.updateOne<ChatThread>(STORAGE_KEYS.CHATS, activeThreadId, { 
      lastMessage: newMessage,
      updatedAt: new Date().toISOString()
    });
    
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  const activeThread = threads.find(t => t.id === activeThreadId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 h-[80vh]">
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-gray-100 flex h-full overflow-hidden">
        
        {/* Thread Sidebar */}
        <aside className="w-full sm:w-80 border-r border-gray-100 flex flex-col bg-gray-50/30">
          <div className="p-6">
            <h2 className="text-xl font-black text-gray-900 mb-6">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search chats..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto custom-scrollbar px-3 space-y-2">
            {threads.filter(t => t.partner.name.toLowerCase().includes(searchQuery.toLowerCase())).map((thread) => (
              <button
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className={`w-full flex items-center p-4 rounded-2xl transition-all ${
                  activeThreadId === thread.id 
                    ? 'bg-white shadow-md border border-gray-100 scale-[1.02]' 
                    : 'hover:bg-gray-100/50 text-gray-500'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black relative flex-shrink-0">
                  {thread.partner.name.charAt(0)}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div className="ml-4 text-left min-w-0">
                  <div className="flex justify-between items-center">
                    <p className={`font-black truncate ${activeThreadId === thread.id ? 'text-gray-900' : 'text-gray-700'}`}>{thread.partner.name}</p>
                    <span className="text-[10px] whitespace-nowrap ml-2 opacity-60">
                      {new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs truncate opacity-70">{thread.lastMessage || 'Start a conversation'}</p>
                </div>
              </button>
            ))}
            {threads.length === 0 && (
              <div className="text-center py-10 px-6">
                <MessageSquare className="h-10 w-10 text-gray-200 mx-auto mb-4" />
                <p className="text-sm text-gray-400">No conversations yet.</p>
              </div>
            )}
          </div>
        </aside>

        {/* Chat window */}
        <main className="flex-grow flex flex-col bg-white">
          {activeThread ? (
            <>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold overflow-hidden border border-gray-100">
                    {activeThread.partner.avatar ? (
                      <img src={activeThread.partner.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      activeThread.partner.name.charAt(0)
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-bold text-gray-900 leading-none">{activeThread.partner.name}</p>
                    <p className="text-[10px] text-emerald-500 font-black tracking-wide uppercase mt-1 flex items-center">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
                      Active Now
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                    <Search className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50/20">
                {messages.map((msg, i) => {
                  const isMe = msg.senderId === user?.id;
                  const prevMsgSame = i > 0 && messages[i-1].senderId === msg.senderId;
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      key={msg.id} 
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${prevMsgSame ? 'mt-1' : 'mt-4'}`}
                    >
                      <div className={`max-w-[75%] px-5 py-3 rounded-3xl text-sm font-medium shadow-sm transition-all ${
                        isMe 
                          ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-200' 
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                      }`}>
                        {msg.text}
                        <div className={`text-[9px] mt-1.5 opacity-50 text-right ${isMe ? 'text-indigo-100' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-6 border-t border-gray-100 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button type="button" className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <button type="button" className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                      <Smile className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex-grow relative">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 pr-12"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                    />
                    <button 
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:grayscale"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-12 bg-gray-50/20">
              <div className="w-24 h-24 bg-white rounded-full shadow-2xl shadow-indigo-100 flex items-center justify-center mb-6">
                <MessageSquare className="h-12 w-12 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-400 max-w-xs font-medium">Connect with buyers and sellers instantly through our real-time messaging system.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
