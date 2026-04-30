import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Star, ArrowRight, Bell } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const DROPS = [
  {
    id: 'dx-01',
    name: 'Phantom Velocity V1',
    price: 249.99,
    image: 'https://picsum.photos/seed/phantom/800/800',
    status: 'Active',
    time: 'Live Now',
    accent: '#00FF00'
  },
  {
    id: 'dx-02',
    name: 'Cyber Strike High',
    price: 320.00,
    image: 'https://picsum.photos/seed/cyber/800/800',
    status: 'Active',
    time: '24 Units Left',
    accent: '#FFD600'
  },
  {
    id: 'dx-03',
    name: 'Vanguard Z-1',
    price: 350.00,
    image: 'https://picsum.photos/seed/promo/800/800',
    status: 'Upcoming',
    time: 'May 05, 2026',
    accent: '#00D1FF'
  },
  {
     id: 'dx-04',
     name: 'Apex Predator Dark',
     price: 310.00,
     image: 'https://picsum.photos/seed/apex/800/800',
     status: 'Upcoming',
     time: 'May 12, 2026',
     accent: '#FF3D00'
  }
];

export const NewDrops = () => {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen pt-24 pb-32 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
          <div>
            <p className="text-[#00FF00] font-black uppercase tracking-[0.5em] text-xs mb-8">Exclusive Releases</p>
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">
              New <br /> <span className="text-transparent border-b-2 border-gray-200 dark:border-white/20">Drop Status</span>
            </h1>
          </div>
          <div className="mt-8 md:mt-0 flex items-center space-x-4 p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl backdrop-blur-xl">
             <div className="w-10 h-10 bg-[#00FF00] rounded-lg flex items-center justify-center text-black">
                <Bell className="h-5 w-5" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#00FF00]">Notify Me</p>
                <p className="text-xs font-bold text-gray-400">Join the priority queue</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {DROPS.map((drop, i) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={drop.id}
              className="group relative bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/5 overflow-hidden rounded-[3.5rem] flex flex-col md:flex-row shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300"
            >
              <div className="w-full md:w-1/2 aspect-square bg-gray-50 dark:bg-black/20 flex items-center justify-center p-12 overflow-hidden">
                <motion.img 
                  whileHover={{ scale: 1.1, rotate: -10 }}
                  src={drop.image} 
                  alt={drop.name} 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                <div className="flex items-center space-x-3 mb-4">
                   <span className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: drop.accent }} />
                   <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: drop.accent }}>{drop.status}</span>
                   <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">— {drop.time}</span>
                </div>
                
                <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-4 leading-tight">{drop.name}</h3>
                <p className="text-2xl font-black text-gray-400 mb-8">{formatPrice(drop.price)}</p>
                
                <div className="space-y-3">
                  {drop.status === 'Active' ? (
                    <button 
                      onClick={() => addItem({ id: drop.id, name: drop.name, price: drop.price, image: drop.image, quantity: 1, sellerId: 'sneakerx' })}
                      className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[10px] hover:bg-[#00FF00] dark:hover:bg-[#00FF00] transition-colors rounded-xl flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Vault</span>
                    </button>
                  ) : (
                    <button className="w-full py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-black uppercase tracking-widest text-[10px] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all rounded-xl">
                      Reserve My Unit
                    </button>
                  )}
                  <button className="w-full py-4 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors flex items-center justify-center space-x-2">
                    <span>Technical Details</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Decorative Background Element */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 opacity-5 pointer-events-none">
                 <div className="w-full h-full rounded-full" style={{ backgroundColor: drop.accent, filter: 'blur(100px)' }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
