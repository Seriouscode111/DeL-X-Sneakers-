import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Filter, X, Star, ChevronDown, LayoutGrid, List, MessageSquare, ShoppingCart } from 'lucide-react';
import { storage, STORAGE_KEYS } from '../services/storage';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Search = () => {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'All';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const all = storage.get<Product>(STORAGE_KEYS.PRODUCTS);
    setProducts(all);
    const uniqueCats = ['All', ...new Set(all.map(p => p.category))];
    setCategories(uniqueCats);
  }, []);

  useEffect(() => {
    let result = products.filter(p => 
      (p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase())) &&
      (categoryParam === 'All' || p.category === categoryParam) &&
      p.price >= priceRange[0] && p.price <= priceRange[1] &&
      p.rating >= minRating
    );

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

    setFilteredProducts(result);
  }, [query, categoryParam, priceRange, minRating, sortBy, products]);

  const toggleCategory = (cat: string) => {
    setSearchParams({ q: query, category: cat });
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen text-gray-900 dark:text-white pt-24 pb-32 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="md:hidden flex items-center justify-between bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-2xl w-full"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Filter Vault</span>
            <Filter className="h-4 w-4 text-[#00FF00]" />
          </button>

          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden md:block w-72 space-y-12">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-8">Category Matrix</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`block w-full text-left px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      categoryParam === cat 
                        ? 'bg-[#00FF00] text-black shadow-lg shadow-[#00FF00]/20' 
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-8">Price Ceiling</h3>
              <div className="space-y-6">
                <input 
                  type="range" 
                  min="0" 
                  max="1000" 
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-[#00FF00]"
                />
                <div className="flex justify-between text-[10px] font-black text-gray-400 tracking-widest uppercase">
                  <span>{formatPrice(0)}</span>
                  <span className="text-[#00FF00]">{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-8">Rating Score</h3>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(star => (
                  <button
                    key={star}
                    onClick={() => setMinRating(star)}
                    className={`h-12 rounded-xl flex items-center justify-center border text-[10px] font-black transition-all ${
                      minRating === star 
                        ? 'bg-[#00FF00]/10 border-[#00FF00] text-[#00FF00]' 
                        : 'border-white/5 text-gray-500 hover:border-white/20'
                    }`}
                  >
                    {star}+
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-[2rem] gap-6">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                <span className="text-gray-900 dark:text-white">{filteredProducts.length}</span> Units Detected
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex bg-gray-100 dark:bg-black/50 rounded-xl p-1 border border-gray-200 dark:border-white/5">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#00FF00] text-black' : 'text-gray-500'}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#00FF00] text-black' : 'text-gray-500'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="newest" className="bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white">Newest Drops</option>
                  <option value="price-low" className="bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white">Price: Low</option>
                  <option value="price-high" className="bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white">Price: High</option>
                  <option value="rating" className="bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white">Top Rated</option>
                </select>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={product.id}
                    className={`bg-white dark:bg-[#0d0d0d] rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 group ${
                      viewMode === 'list' ? 'flex flex-row gap-8 h-64 shadow-sm' : 'flex flex-col shadow-sm'
                    } hover:shadow-xl transition-all duration-300`}
                  >
                    <Link to={`/product/${product.id}`} className={viewMode === 'list' ? 'w-64 flex-shrink-0 bg-gray-50 dark:bg-black/40' : 'h-72 bg-gray-50 dark:bg-black/40'}>
                      <img 
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'} 
                        alt={product.name} 
                        className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3" 
                        referrerPolicy="no-referrer"
                      />
                    </Link>
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#00FF00] mb-2 block">{product.category}</span>
                          <h3 className="text-xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">
                            <Link to={`/product/${product.id}`}>{product.name}</Link>
                          </h3>
                        </div>
                        <div className="flex items-center text-[#FFD600] text-[10px] font-black">
                          <Star className="h-3 w-3 fill-current mr-1" />
                          {product.rating}
                        </div>
                      </div>
                      <p className="text-gray-500 text-[10px] font-medium leading-relaxed line-clamp-2 mb-6">{product.description}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xl font-black text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.images?.[0] || '', quantity: 1, sellerId: product.sellerId })}
                            className="bg-[#00FF00] text-black p-3 rounded-xl hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all shadow-xl shadow-[#00FF00]/10"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </button>
                          <Link 
                            to={`/product/${product.id}`}
                            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            Observe
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-[#0d0d0d] rounded-[3.5rem] border border-dashed border-white/10">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8">
                  <SearchIcon className="h-8 w-8 text-gray-700" />
                </div>
                <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Zero matches in current sector.</p>
                <button 
                  onClick={() => {
                    setSearchParams({});
                    setPriceRange([0, 1000]);
                    setMinRating(0);
                  }}
                  className="mt-6 text-[#00FF00] text-[10px] font-black uppercase tracking-widest hover:underline"
                >
                  Reset Parameters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Filter) */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]" 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full max-w-xs bg-white dark:bg-[#0d0d0d] border-l border-gray-100 dark:border-white/10 z-[70] shadow-2xl p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-900 dark:text-white">Filter Console</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-100 dark:bg-white/5 rounded-full"><X className="h-5 w-5 text-gray-400" /></button>
              </div>
              
              <div className="space-y-12">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Categories</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`px-4 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${
                          categoryParam === cat ? 'bg-[#00FF00] border-[#00FF00] text-black' : 'border-white/5 text-gray-500'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Price Range</h3>
                   <input 
                      type="range" 
                      min="0" 
                      max="1000" 
                      step="50"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-[#00FF00]"
                    />
                    <div className="flex justify-between mt-4">
                      <span className="text-[8px] font-black text-gray-500">{formatPrice(0)}</span>
                      <span className="text-[8px] font-black text-[#00FF00]">{formatPrice(priceRange[1])}</span>
                    </div>
                </div>

                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-[10px]"
                >
                  Apply Config
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
