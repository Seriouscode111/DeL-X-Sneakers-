/**
 * Local Storage Service
 * Mimics a database for persistent storage without AI dependencies
 */

import { Product, User } from '../types';

const STORAGE_KEYS = {
  USERS: 'mm_users',
  PRODUCTS: 'mm_products',
  ORDERS: 'mm_orders',
  REVIEWS: 'mm_reviews',
  CHATS: 'mm_chats',
  MESSAGES: 'mm_messages',
  NOTIFICATIONS: 'mm_notifications',
  CURRENT_USER: 'mm_current_user',
};

// Initial Sample Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'sx-01',
    sellerId: 'sneakerx',
    name: 'Phantom Velocity V1',
    description: 'Engineered for speed, designed for the future. The Velocity V1 features our proprietary ultra-responsive foam.',
    price: 249.99,
    category: 'Men',
    images: ['https://picsum.photos/seed/phantom/800/800'],
    stock: 50,
    rating: 4.9,
    reviewsCount: 312,
    featured: true
  },
  {
    id: 'sx-02',
    sellerId: 'sneakerx',
    name: 'Nebula Runner',
    description: 'Step into the atmosphere. Breathable mesh meets striking aesthetics.',
    price: 189.99,
    category: 'Women',
    images: ['https://picsum.photos/seed/nebula/800/800'],
    stock: 45,
    rating: 4.7,
    reviewsCount: 156,
    featured: true
  },
  {
    id: 'sx-03',
    sellerId: 'sneakerx',
    name: 'Cyber Strike High',
    description: 'Industrial durability. Mechanical precision. The ultimate techwear companion.',
    price: 320.00,
    category: 'Limited Edition',
    images: ['https://picsum.photos/seed/cyber/800/800'],
    stock: 12,
    rating: 4.9,
    reviewsCount: 88,
    featured: true
  },
  {
    id: 'sx-04',
    sellerId: 'sneakerx',
    name: 'Zenith Lifestyle',
    description: 'Sophisticated minimalism for everyday excellence.',
    price: 155.00,
    category: 'Kids',
    images: ['https://picsum.photos/seed/zenith/800/800'],
    stock: 30,
    rating: 4.5,
    reviewsCount: 42,
    featured: false
  },
  {
    id: 'sx-05',
    sellerId: 'sneakerx',
    name: 'Apex Predator',
    description: 'Command the urban jungle. Aggressive traction and unmatched support.',
    price: 299.99,
    category: 'Men',
    images: ['https://picsum.photos/seed/apex/800/800'],
    stock: 20,
    rating: 4.8,
    reviewsCount: 124,
    featured: true
  }
];

export const storage = {
  get: <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },
  
  save: <T>(key: string, data: T[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  },

  getOne: <T extends { id: string }>(key: string, id: string): T | undefined => {
    return storage.get<T>(key).find(item => item.id === id);
  },

  insertOne: <T extends { id: string }>(key: string, item: T) => {
    const data = storage.get<T>(key);
    data.push(item);
    storage.save(key, data);
  },

  updateOne: <T extends { id: string }>(key: string, id: string, updates: Partial<T>) => {
    const data = storage.get<T>(key);
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      storage.save(key, data);
    }
  },

  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      storage.save(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    }
    // Add default admin if no users
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      storage.save(STORAGE_KEYS.USERS, [
        {
          id: 'admin1',
          email: 'admin@marketmaster.com',
          name: 'System Admin',
          phone: '0000000000',
          role: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: 's1',
          email: 'seller1@example.com',
          name: 'Tech Haven',
          phone: '1234567890',
          role: 'seller',
          verificationStatus: 'verified',
          createdAt: new Date().toISOString()
        },
        {
          id: 's2',
          email: 'seller2@example.com',
          name: 'Lifestyle Co',
          phone: '0987654321',
          role: 'seller',
          verificationStatus: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          id: 'b1',
          email: 'buyer1@example.com',
          name: 'John Doe',
          phone: '5555555555',
          role: 'buyer',
          createdAt: new Date().toISOString()
        }
      ]);
    }
    
    // Explicitly update s2 status for this request if it exists but is idle
    const users = storage.get<User>(STORAGE_KEYS.USERS);
    const s2 = users.find(u => u.id === 's2');
    if (s2 && (s2.verificationStatus === 'idle' || !s2.verificationStatus)) {
      storage.updateOne<User>(STORAGE_KEYS.USERS, 's2', { verificationStatus: 'pending' });
    }
  }
};

export { STORAGE_KEYS };
