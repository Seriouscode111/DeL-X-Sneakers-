import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, Check, Trash2, ExternalLink, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../types';

export const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const navigate = useNavigate();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const handleNotificationClick = (notif: Notification) => {
    markAsRead(notif.id);
    if (notif.link) {
      if (notif.link.startsWith('http')) {
        window.open(notif.link, '_blank');
      } else {
        navigate(notif.link);
      }
    } else {
      setSelectedNotification(notif);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Notifications</h1>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex items-center space-x-3">
            <button 
              onClick={markAllAsRead}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
            >
              <Check className="h-3 w-3" />
              <span>Mark all read</span>
            </button>
            <button 
              onClick={clearAll}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear all</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`group p-6 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden ${
                notif.read 
                  ? 'bg-white border-gray-100 hover:border-indigo-100' 
                  : 'bg-indigo-50/30 border-indigo-100 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-2xl ${notif.read ? 'bg-gray-50 text-gray-400' : 'bg-indigo-600 text-white'}`}>
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="w-2 h-2 bg-indigo-600 rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed mb-4">
                      {notif.message}
                    </p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {notif.link && (
                  <div className="p-2 bg-white/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-4 w-4 text-indigo-600" />
                  </div>
                )}
              </div>

              {!notif.read && (
                <div className="absolute top-0 right-0 p-4">
                   <div className="bg-indigo-600/10 text-[8px] font-black text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                     New
                   </div>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 border-dashed">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="h-10 w-10 text-gray-200" />
            </div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">All caught up!</h2>
            <p className="text-gray-400 font-medium mt-2">No new notifications for you right now.</p>
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedNotification(null)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
              
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                <Bell className="h-8 w-8 text-indigo-600" />
              </div>
              
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">
                {selectedNotification.title}
              </h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                {new Date(selectedNotification.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed font-medium mb-8">
                {selectedNotification.message}
              </p>
              
              <div className="flex space-x-3">
                {selectedNotification.link && (
                  <button 
                    onClick={() => {
                      if (selectedNotification.link?.startsWith('http')) {
                        window.open(selectedNotification.link, '_blank');
                      } else {
                        navigate(selectedNotification.link!);
                      }
                      setSelectedNotification(null);
                    }}
                    className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Visit Link</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className={`flex-1 ${selectedNotification.link ? 'bg-gray-50 text-gray-900 hover:bg-gray-100' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700'} py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all`}
                >
                  {selectedNotification.link ? 'Close' : 'Got it'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
