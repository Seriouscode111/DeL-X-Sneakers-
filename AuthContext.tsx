import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { storage, STORAGE_KEYS } from '../services/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Omit<User, 'id' | 'createdAt'>, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storage.init();
    
    // Listen for state changes (Local Storage Mock)
    const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = async () => {
    // Mock Google Login
    const users = storage.get<User>(STORAGE_KEYS.USERS);
    let googleUser = users.find(u => u.email === 'kwakuopokunuamah@gmail.com');
    
    if (!googleUser) {
      googleUser = {
        id: 'google-' + Math.random().toString(36).substr(2, 9),
        name: 'Google User',
        email: 'kwakuopokunuamah@gmail.com',
        phone: '',
        role: 'buyer',
        createdAt: new Date().toISOString(),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Google'
      };
      storage.insertOne(STORAGE_KEYS.USERS, googleUser);
    }
    
    setUser(googleUser);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(googleUser));
  };

  const login = async (email: string, password: string) => {
    // Local-only login
    const users = storage.get<User>(STORAGE_KEYS.USERS);
    const foundUser = users.find(u => u.email === email);
    
    if (foundUser && (!foundUser.password || foundUser.password === password)) {
      setUser(foundUser);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(foundUser));
      return;
    }

    // Emergency Create for Admin
    if (email === 'kwakuopokunuamah@gmail.com') {
      const fallbackAdmin: User = {
        id: 'admin-local',
        name: 'Admin',
        email: email,
        phone: '',
        role: 'admin',
        createdAt: new Date().toISOString(),
        password: password
      };
      storage.insertOne(STORAGE_KEYS.USERS, fallbackAdmin);
      setUser(fallbackAdmin);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(fallbackAdmin));
      return;
    }

    throw new Error('Invalid email or password.');
  };

  const register = async (data: Omit<User, 'id' | 'createdAt'>, password: string) => {
    const newUser: User = {
      ...data,
      password,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    storage.insertOne(STORAGE_KEYS.USERS, newUser);
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    storage.updateOne(STORAGE_KEYS.USERS, user.id, updates);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
