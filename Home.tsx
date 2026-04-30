import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingCart, User, Menu, X, ChevronRight, ArrowRight, Instagram, Twitter, Facebook, Star, Filter, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const SNEAKERS = [
  {
    id: 'sx-01',
    name: 'Phantom Velocity V1',
    price: 249.99,
    category: 'Men',
    image: 'https://picsum.photos/seed/phantom/800/800',
    description: 'Engineered for speed, designed for the future. The Velocity V1 features our proprietary ultra-responsive foam.',
    accent: '#00FF00', // Neon Green
    isLimited: true
  },
  {
    id: 'sx-02',
    name: 'Nebula Runner',
    price: 189.99,
    category: 'Women',
    image: 'https://picsum.photos/seed/nebula/800/800',
    description: 'Step into the atmosphere. Breathable mesh meets striking aesthetics.',
    accent: '#FF3D00', // Neon Red
    isLimited: false
  },
  {
    id: 'sx-03',
    name: 'Cyber Strike High',
    price: 320.00,
    category: 'Limited Edition',
    image: 'https://picsum.photos/seed/cyber/800/800',
    description: 'Industrial durability. Mechanical precision. The ultimate techwear companion.',
    accent: '#FFD600', // Cyber Yellow
    isLimited: true
  },
  {
    id: 'sx-04',
    name: 'Zenith Lifestyle',
    price: 155.00,
    category: 'Kids',
    image: 'https://picsum.photos/seed/zenith/800/800',
    description: 'Sophisticated minimalism for everyday excellence.',
    accent: '#9E9E9E', // Grey
    isLimited: false
  },
  {
    id: 'sx-05',
    name: 'Apex Predator',
    price: 299.99,
    category: 'Men',
    image: 'https://picsum.photos/seed/apex/800/800',
    description: 'Command the urban jungle. Aggressive traction and unmatched support.',
    accent: '#00FF00',
    isLimited: true
  },
  {
    id: 'sx-06',
    name: 'Lunar Aura',
    price: 210.00,
    category: 'Women',
    image: 'https://picsum.photos/seed/lunar/800/800',
    description: 'Weightless comfort. Ethereal design. The future of walking.',
    accent: '#FF3D00',
    isLimited: false
  }
];

export const Home = () => {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredSneakers = activeCategory === 'All' 
    ? SNEAKERS 
    : SNEAKERS.filter(s => s.category === activeCategory || (activeCategory === 'Shop' && !s.isLimited));

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen font-sans transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Abstract Background Design */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-10 pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,#00FF00_0%,transparent_70%)]" />
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.05, scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black uppercase tracking-tighter italic leading-none text-gray-900 dark:text-white whitespace-nowrap select-none"
          >
            SNEAKERX
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col md:flex-row items-center justify-between mt-20">
          <div className="max-w-2xl text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <p className="text-[#00FF00] font-black uppercase tracking-[0.5em] text-xs mb-6">Premium Collection 2026</p>
              <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter italic leading-[0.8] mb-8 text-black dark:text-white">
                Step Into <br /> <span className="text-transparent border-t-2 border-b-2 border-gray-200 dark:border-white/20 inline-block py-2">The Future</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-md mb-10 leading-relaxed">
                Experience the next generation of athletic performance and urban aesthetics. Engineered for those who never stop.
              </p>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button 
                  onClick={() => navigate('/search')}
                  className="bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-none font-black uppercase tracking-widest hover:bg-[#00FF00] dark:hover:bg-[#00FF00] transition-colors flex items-center group w-full sm:w-auto justify-center"
                >
                  Shop Now <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </button>
                <button className="text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-white/20 hover:border-[#00FF00] py-4 font-black uppercase tracking-widest text-[10px] transition-all">
                  Explore Drops
                </button>
              </div>
            </motion.div>
          </div>

          <div className="relative mt-20 md:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -15, x: 100 }}
              animate={{ opacity: 1, scale: 1, rotate: -10, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative z-20"
            >
              <img 
                src="https://picsum.photos/seed/hero-sneaker/800/800"
                alt="Featured Sneaker"
                className="w-[400px] md:w-[600px] drop-shadow-[0_35px_35px_rgba(0,255,0,0.2)]"
                referrerPolicy="no-referrer"
              />
              {/* Product Info Floating Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -right-10 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hidden md:block"
              >
                <p className="text-[10px] font-black text-[#00FF00] uppercase tracking-widest mb-1">Limited Release</p>
                <p className="font-black text-xl italic uppercase tracking-tight">Phantom Velocity</p>
                <div className="flex items-center justify-between mt-4">
                   <p className="text-sm font-bold text-gray-400">$249.99</p>
                   <div className="flex space-x-1">
                      {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-[#00FF00] text-[#00FF00]" />)}
                   </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-px h-24 bg-gradient-to-b from-white/20 to-transparent relative overflow-hidden">
                <motion.div 
                    animate={{ y: [0, 96] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-transparent via-[#00FF00] to-transparent"
                />
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-500 mt-4 -rotate-90 origin-center absolute -bottom-12">Scroll</p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0">
            <div>
              <p className="text-[#00FF00] font-black uppercase tracking-[0.5em] text-[10px] mb-4">The Collection</p>
              <h2 className="text-5xl font-black uppercase tracking-tighter italic text-gray-900 dark:text-white">Latest <span className="text-transparent border-b border-gray-200 dark:border-white/20">Manifestations</span></h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {['All', 'Men', 'Women', 'Kids', 'Limited Edition'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                    activeCategory === cat 
                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' 
                    : 'bg-transparent text-gray-400 border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredSneakers.map((sneaker, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  key={sneaker.id}
                  className="group relative bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/5 p-8 rounded-[2.5rem] hover:border-gray-200 dark:hover:border-white/20 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                  <div className="absolute top-6 right-6 z-10">
                    <button className="w-12 h-12 bg-gray-100 dark:bg-black/40 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-colors hover:bg-gray-200 dark:hover:bg-black/80">
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {sneaker.isLimited && (
                    <div className="absolute top-6 left-6 z-10">
                      <span className="bg-[#00FF00] text-black text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Limited</span>
                    </div>
                  )}

                  <div className="aspect-square mb-8 overflow-hidden rounded-3xl bg-gray-50 dark:bg-black/20 flex items-center justify-center group-hover:bg-gray-100 dark:group-hover:bg-black/40 transition-colors">
                    <motion.img 
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      src={sneaker.image}
                      alt={sneaker.name}
                      className="w-4/5 h-4/5 object-contain transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{sneaker.category}</p>
                       <p className="text-xl font-black italic text-gray-900 dark:text-white">{formatPrice(sneaker.price)}</p>
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight italic group-hover:text-[#00FF00] transition-colors mb-4 text-gray-900 dark:text-white">{sneaker.name}</h3>
                    
                    <button 
                      onClick={() => addItem({ id: sneaker.id, name: sneaker.name, price: sneaker.price, image: sneaker.image, quantity: 1, sellerId: 'sneakerx' })}
                      className="w-full py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all rounded-2xl flex items-center justify-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Vault</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Categories / Visual Cards */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-[600px] group overflow-hidden rounded-[3rem]">
              <img 
                src="https://picsum.photos/seed/men-cat/1200/1200" 
                alt="Men" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 dark:from-black via-transparent to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                <p className="text-[#00FF00] font-black uppercase tracking-[0.5em] text-[10px] mb-4">Elite Segment</p>
                <h3 className="text-6xl font-black uppercase italic tracking-tighter mb-8 leading-none text-white">Men's <br /> High Performance</h3>
                <Link to="/search?category=Men" className="inline-flex items-center space-x-4 group/link">
                   <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover/link:bg-white group-hover/link:text-black transition-all">
                      <ArrowRight className="h-6 w-6" />
                   </div>
                   <span className="font-black uppercase tracking-widest text-xs">Explore Division</span>
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="relative flex-1 group overflow-hidden rounded-[3rem]">
                <img 
                  src="https://picsum.photos/seed/women-cat/1200/800" 
                  alt="Women" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 dark:from-black via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10">
                   <h4 className="text-4xl font-black uppercase italic tracking-tighter mb-4 text-white">Women's Core</h4>
                   <Link to="/search?category=Women" className="text-[10px] font-black uppercase tracking-widest border-b border-white/20 hover:border-white transition-all py-1 text-white">View Collection</Link>
                </div>
              </div>
              <div className="relative flex-1 group overflow-hidden rounded-[3rem]">
                <img 
                  src="https://picsum.photos/seed/kids-cat/1200/800" 
                  alt="Limited" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-40"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00FF00_0%,transparent_100%)] opacity-20" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                   <p className="text-[10px] font-black text-[#00FF00] uppercase tracking-[0.5em] mb-4">Rarest Artifacts</p>
                   <h4 className="text-5xl font-black uppercase italic tracking-tighter mb-6">Limited <span className="text-transparent border-b border-white/20">Editions</span></h4>
                   <Link to="/search?filter=limited" className="bg-white text-black px-8 py-3 rounded-none font-black uppercase tracking-widest text-[10px] hover:bg-[#00FF00] transition-colors">Access Vault</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-gray-900 dark:bg-white rounded-[4rem] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between overflow-hidden relative transition-colors duration-500">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 dark:bg-indigo-50/50 skew-x-12 translate-x-20 pointer-events-none" />
          <div className="relative z-10 max-w-xl text-center md:text-left">
             <h2 className="text-5xl md:text-7xl font-black text-white dark:text-black uppercase italic tracking-tighter leading-none mb-8">
                Drop 092 <br /> <span className="text-[#00FF00] dark:text-indigo-600">Now Active</span>
             </h2>
             <p className="text-gray-400 dark:text-gray-500 font-medium text-lg mb-10 leading-relaxed">
                Exclusive early access for SneakerX members. Use your access token to reveal hidden pricing and early shipping.
             </p>
             <button className="bg-[#00FF00] dark:bg-black text-black dark:text-white px-12 py-5 font-black uppercase tracking-widest hover:bg-white dark:hover:bg-black/80 transition-all rounded-full shadow-2xl">
                Get Access
             </button>
          </div>
          <div className="mt-12 md:mt-0 relative z-10">
             <motion.div 
               animate={{ rotate: [0, 5, 0] }}
               transition={{ duration: 6, repeat: Infinity }}
               className="bg-black dark:bg-black p-10 rounded-[3rem] shadow-2xl relative"
             >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black italic">!</div>
                <img 
                  src="https://picsum.photos/seed/promo/500/500" 
                  alt="Promo Item" 
                  className="w-64 h-64 object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="mt-6 text-center">
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Upcoming Archive</p>
                   <p className="text-white font-black italic uppercase tracking-tight">Vanguard Z-1</p>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};
