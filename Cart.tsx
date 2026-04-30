import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '../context/CurrencyContext';

export const Cart = () => {
  const { items, removeItem, updateQuantity, total } = useCart();
  const { formatPrice } = useCurrency();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 max-w-sm mb-8">Upgrade your lifestyle today. Explore our collections and find something you love.</p>
        <Link 
          to="/search" 
          className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 transition-colors duration-300">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-10 tracking-tight uppercase italic">Shopping Vault</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-6 p-6 bg-white dark:bg-[#0d0d0d] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group"
              >
                <Link to={`/product/${item.id}`} className="w-24 h-24 flex-shrink-0 bg-gray-50 dark:bg-black/40 rounded-2xl overflow-hidden">
                  <img src={item.images?.[0] || ''} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </Link>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white hover:text-[#00FF00] dark:hover:text-[#00FF00] transition-colors">
                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 uppercase tracking-tight">{item.category}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center bg-gray-50 dark:bg-white/5 rounded-xl px-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00FF00]"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-4 py-1 text-sm font-black text-gray-900 dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00FF00]"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-xl font-black text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Link to="/search" className="inline-flex items-center text-indigo-600 font-bold hover:translate-x-1 transition-transform">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0d0d0d] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-white/5 pb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-500">
                <span className="text-sm font-medium">Subtotal</span>
                <span className="font-bold text-gray-900 dark:text-white">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span className="text-sm font-medium">Shipping</span>
                <span className="text-[#00FF00] font-black text-xs uppercase bg-[#00FF00]/10 px-2 py-0.5 rounded">Free</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span className="text-sm font-medium">Estimated tax</span>
                <span className="font-bold text-gray-900 dark:text-white">{formatPrice(0)}</span>
              </div>
            </div>

            <div className="h-px bg-gray-100 dark:bg-white/5" />

            <div className="flex justify-between items-end">
              <span className="text-gray-900 dark:text-white font-black text-lg">Total</span>
              <span className="text-3xl font-black text-[#00FF00]">{formatPrice(total)}</span>
            </div>

            <Link
              to="/checkout"
              className="w-full flex items-center justify-center space-x-2 bg-black dark:bg-white text-white dark:text-black py-5 rounded-3xl font-black hover:bg-[#00FF00] dark:hover:bg-[#00FF00] transition-all shadow-xl shadow-black/10 dark:shadow-white/10"
            >
              <span>Secure Checkout</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <div className="space-y-4 pt-4">
              <div className="flex items-center text-gray-400 text-[10px] space-x-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span className="flex-grow">SSL Secure Payment Processing</span>
              </div>
              <div className="flex items-center text-gray-400 text-[10px] space-x-2">
                <Truck className="h-4 w-4 text-indigo-400" />
                <span className="flex-grow">Estimated delivery: 3-5 business days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
