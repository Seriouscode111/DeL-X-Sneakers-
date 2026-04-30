import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '../types';
import { storage, STORAGE_KEYS } from '../services/storage';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  addNotification: (title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      const all = storage.get<Notification>(STORAGE_KEYS.NOTIFICATIONS);
      const userNotifs = all.filter(n => n.userId === user.id);
      
      if (userNotifs.length === 0) {
        // Add welcome notifications
        const welcomeNotifs: Notification[] = [
          {
            id: 'welcome_1',
            userId: user.id,
            title: 'Welcome to MarketMaster!',
            message: 'Start exploring elite products and verified sellers across Ghana.',
            read: false,
            link: '/search',
            createdAt: new Date().toISOString()
          },
          {
            id: 'welcome_2',
            userId: user.id,
            title: 'Security Tip',
            message: 'Always check for the Verified badge on seller profiles for a safe shopping experience.',
            read: false,
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 'welcome_3',
            userId: user.id,
            title: 'First Purchase Discount',
            message: 'Use code MASTER10 for 10% off your first order!',
            read: false,
            link: '/cart',
            createdAt: new Date(Date.now() - 7200000).toISOString()
          }
        ];
        welcomeNotifs.forEach(n => storage.insertOne(STORAGE_KEYS.NOTIFICATIONS, n));
        setNotifications(welcomeNotifs);
      } else {
        setNotifications(userNotifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } else {
      setNotifications([]);
    }
  }, [user]);

  const addNotification = (title: string, message: string) => {
    if (!user) return;
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };
    storage.insertOne(STORAGE_KEYS.NOTIFICATIONS, newNotif);
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    storage.updateOne<Notification>(STORAGE_KEYS.NOTIFICATIONS, id, { read: true });
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    if (!user) return;
    const all = storage.get<Notification>(STORAGE_KEYS.NOTIFICATIONS);
    const updated = all.map(n => n.userId === user.id ? { ...n, read: true } : n);
    storage.save(STORAGE_KEYS.NOTIFICATIONS, updated);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    if (!user) return;
    const all = storage.get<Notification>(STORAGE_KEYS.NOTIFICATIONS);
    const updated = all.filter(n => n.userId !== user.id);
    storage.save(STORAGE_KEYS.NOTIFICATIONS, updated);
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, clearAll, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
