import React from 'react';
import { motion } from 'motion/react';
import { Star, ShieldCheck, MapPin, Search as SearchIcon, ChevronRight, MessageSquare, ShoppingBag, Terminal } from 'lucide-react';
import { storage, STORAGE_KEYS } from '../services/storage';
import { User, Product } from '../types';
import { Link } from 'react-router-dom';

export const Sellers = () => {
  const allUsers = storage.get<User>(STORAGE_KEYS.USERS);
  const sellers = allUsers.filter(u => u.role === 'seller' || u.id === 'sneakerx');
  const products = storage.get<Product>(STORAGE_KEYS.PRODUCTS);

  // Add virtual SneakerX seller if not exists in list
  if (!sellers.find(s => s.id === 'sneakerx')) {
    sellers.unshift({
        id: 'sneakerx',
        name: 'SneakerX Authorized',
        email: 'ops@sneakerx.store',
        role: 'seller',
        verificationStatus: 'verified',
        createdAt: new Date().toISOString()
    } as User);
  }

  return (
    <div className="bg-white dark:bg-black min-h-screen text-gray-900 dark:text-white pt-24 pb-32 transition-colors duration-300">
      {/* Header */}
      <div className="py-24 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#00FF00] font-black uppercase tracking-[0.5em] text-xs mb-8"
            >
              Network Protocol
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none mb-12"
            >
              Verified <br /> <span className="text-transparent border-b-2 border-gray-200 dark:border-white/20">Distributors</span>
            </motion.h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-xl">
              Access the validated network of high-performance footwear providers and custom manufacturers across the primary sectors.
            </p>
          </div>
          
          <div className="mt-16 flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text"
                placeholder="PROBE DISTRIBUTOR INDEX..."
                className="w-full pl-16 pr-6 py-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-black uppercase tracking-widest text-xs focus:border-[#00FF00] focus:outline-none transition-colors"
              />
            </div>
            <div className="flex gap-4">
              <select className="px-8 py-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-black text-[10px] uppercase tracking-[0.2em] focus:border-[#00FF00] focus:outline-none cursor-pointer">
                <option className="bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white">ALL SECTORS</option>
                <option className="bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white">ACCRA PRIME</option>
                <option className="bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white">ASHANTI CORE</option>
                <option className="bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white">WESTERN DIV</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sellers List */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {sellers.map((seller, i) => {
            const sellerProducts = products.filter(p => p.sellerId === seller.id);
            const isAuthorized = seller.id === 'sneakerx';
            
            return (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white dark:bg-[#0d0d0d] rounded-[3rem] p-10 border transition-all duration-500 relative overflow-hidden group shadow-sm hover:shadow-xl dark:shadow-none ${isAuthorized ? 'border-[#00FF00]/30' : 'border-gray-100 dark:border-white/5'}`}
              >
                {isAuthorized && (
                  <div className="absolute top-0 right-0 p-6">
                    <Terminal className="h-4 w-4 text-[#00FF00]" />
                  </div>
                )}
                
                <div className="flex items-center space-x-6 mb-10">
                  <div className={`w-20 h-20 rounded-[1.5rem] overflow-hidden border flex items-center justify-center bg-gray-50 dark:bg-black transition-colors ${isAuthorized ? 'border-[#00FF00]' : 'border-gray-100 dark:border-white/10'}`}>
                    {seller.avatar ? (
                      <img src={seller.avatar} alt={seller.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`font-black text-2xl italic ${isAuthorized ? 'text-[#00FF00]' : 'text-gray-400 dark:text-gray-700'}`}>
                        {seller.name?.[0] || '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-black text-xl italic uppercase tracking-tighter text-gray-900 dark:text-white truncate max-w-[150px]">{seller.name}</h3>
                      <ShieldCheck className={`h-4 w-4 ${isAuthorized ? 'text-[#00FF00]' : 'text-emerald-500'}`} />
                    </div>
                    <div className="flex items-center text-gray-400 dark:text-gray-600 text-[10px] font-black uppercase tracking-widest">
                      <MapPin className="h-3 w-3 mr-1" />
                      {seller.region || (isAuthorized ? 'GLOBAL OPS' : 'ACCRA, GH')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-10">
                  <div className="text-center p-4 bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-white/5 rounded-2xl group-hover:border-[#00FF00]/20 transition-colors">
                    <p className="text-lg font-black italic text-gray-900 dark:text-white">{isAuthorized ? '24' : sellerProducts.length}</p>
                    <p className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Units</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-white/5 rounded-2xl">
                    <p className="text-lg font-black italic text-gray-900 dark:text-white">4.9</p>
                    <p className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Sync</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-white/5 rounded-2xl">
                    <p className="text-lg font-black italic text-gray-900 dark:text-white">{isAuthorized ? 'Instant' : '2h'}</p>
                    <p className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Ping</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link 
                    to={`/search?sellerId=${seller.id}`}
                    className={`w-full flex items-center justify-center space-x-3 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isAuthorized ? 'bg-[#00FF00] text-black shadow-lg shadow-[#00FF00]/20 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black' : 'bg-black dark:bg-white text-white dark:text-black hover:bg-[#00FF00] dark:hover:bg-[#00FF00]'}`}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Access Vault</span>
                  </Link>
                  <Link 
                    to={isAuthorized ? '/about' : `/chat?seller=${seller.id}`}
                    className="w-full flex items-center justify-center space-x-3 py-5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Communicate</span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
