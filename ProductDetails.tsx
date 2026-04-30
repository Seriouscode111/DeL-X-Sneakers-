import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, Shield, Truck, Share2, Heart, 
  ChevronRight, ArrowLeft, Minus, Plus, 
  ShoppingCart, MessageCircle, AlertCircle, MessageSquare
} from 'lucide-react';
import { storage, STORAGE_KEYS } from '../services/storage';
import { Product, Review, User } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { motion } from 'motion/react';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = storage.getOne<Product>(STORAGE_KEYS.PRODUCTS, id!);
    if (p) {
      setProduct(p);
      const s = storage.getOne<User>(STORAGE_KEYS.USERS, p.sellerId);
      setSeller(s || null);
      const allReviews = storage.get<Review>(STORAGE_KEYS.REVIEWS);
      setReviews(allReviews.filter(r => r.productId === id));
    }
    setLoading(false);
  }, [id]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading product...</div>;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Product not found.</div>;

  const handleAddToCart = () => {
    addItem(product);
    // Visual feedback
  };

  const handleBuyNow = () => {
    addItem(product);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      {/* Breadcrumbs */}
      <nav className="flex mb-8 text-sm text-gray-500 font-medium">
        <Link to="/" className="hover:text-[#00FF00]">Home</Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <Link to={`/search?category=${product.category}`} className="hover:text-[#00FF00]">{product.category}</Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="text-gray-900 dark:text-white truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square rounded-3xl overflow-hidden bg-white dark:bg-black/40 border border-gray-100 dark:border-white/5 shadow-sm"
          >
            <img 
              src={product.images?.[selectedImage] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'} 
              alt={product.name} 
              className="w-full h-full object-contain p-8 transition-all duration-300"
            />
          </motion.div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  selectedImage === i ? 'border-[#00FF00] shadow-md dark:shadow-[#00FF00]/10' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="px-3 py-1 bg-[#00FF00]/10 text-[#00FF00] text-xs font-bold rounded-full uppercase tracking-widest leading-none">Limited Division</span>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mt-4 uppercase italic tracking-tighter leading-none">{product.name}</h1>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shadow-sm">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 hover:text-[#00FF00] hover:bg-[#00FF00]/10 transition-all shadow-sm">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center mt-6 space-x-4">
              <div className="flex items-center bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-lg">
                <Star className="h-4 w-4 text-amber-500 fill-current" />
                <span className="ml-1 text-sm font-black text-amber-700 dark:text-amber-500">{product.rating}</span>
              </div>
              <span className="text-gray-400 text-sm font-medium tracking-tight uppercase">{product.reviewsCount} Archive Entries</span>
              <div className="h-4 w-px bg-gray-200 dark:bg-white/10" />
              <span className={`text-sm font-black uppercase tracking-widest ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {product.stock > 0 ? `${product.stock} Units Available` : 'Depleted'}
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-5xl font-black text-gray-900 dark:text-white italic tracking-tighter">{formatPrice(product.price)}</span>
            <span className="ml-4 text-gray-400 line-through text-lg font-medium">{formatPrice(product.price * 1.2)}</span>
            <span className="ml-3 bg-[#00FF00] text-black text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-widest">20% Discount</span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg font-medium">
            {product.description}
          </p>

          <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Unit Quantity</span>
              <div className="flex items-center bg-white dark:bg-black/40 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Minus className="h-4 w-4 dark:text-white" />
                </button>
                <span className="px-8 py-2 text-sm font-black text-gray-900 dark:text-white border-x border-gray-100 dark:border-white/10">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Plus className="h-4 w-4 dark:text-white" />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center space-x-3 bg-transparent text-gray-900 dark:text-white border-2 border-gray-200 dark:border-white/10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Add to Vault</span>
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-black dark:bg-[#00FF00] text-white dark:text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#00FF00] dark:hover:bg-white transition-all shadow-xl shadow-black/20 dark:shadow-[#00FF00]/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Acquire Now
              </button>
            </div>
          </div>

          {/* Seller Info Card */}
          <div className="flex items-center p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10">
            <div className="w-14 h-14 rounded-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 overflow-hidden flex-shrink-0">
              {seller?.avatar ? (
                <img src={seller.avatar} alt={seller.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black dark:bg-[#00FF00] text-white dark:text-black font-black italic">
                  {seller?.name?.charAt(0) || '?'}
                </div>
              )}
            </div>
            <div className="ml-4 flex-grow">
              <h4 className="font-black uppercase italic tracking-tight text-gray-900 dark:text-white">{seller?.name || 'Verified Sector Unit'}</h4>
              <p className="text-[10px] uppercase font-black tracking-widest text-[#00FF00]">Verified Entity • Alpha Status</p>
            </div>
            <Link 
              to={user ? `/chat?seller=${product.sellerId}` : '/auth'}
              className="flex items-center space-x-2 px-6 py-3 bg-black dark:bg-[#00FF00] rounded-xl text-white dark:text-black font-black text-[10px] uppercase tracking-widest hover:bg-[#00FF00] dark:hover:bg-white transition-all shadow-xl shadow-black/10 dark:shadow-[#00FF00]/10 group"
            >
              <MessageSquare className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Connect</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-4 p-5 bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm">
              <Truck className="h-6 w-6 text-[#00FF00]" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Rapid Transit</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">3-5 Solar Successions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-5 bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm">
              <Shield className="h-6 w-6 text-[#00FF00]" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Encrypted Protocol</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Total Asset Protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-24 border-t border-gray-100 dark:border-white/10 pt-20">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">Public <span className="text-[#00FF00]">Logs</span></h2>
          <button className="text-[10px] font-black uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl hover:bg-[#00FF00] dark:hover:bg-[#00FF00] transition-colors">Submit Review</button>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-[#0d0d0d] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-black/40 flex items-center justify-center text-gray-900 dark:text-white font-black italic text-xs">
                      {review.userName?.charAt(0) || '?'}
                    </div>
                    <span className="ml-4 font-black uppercase italic text-gray-900 dark:text-white tracking-widest text-xs">{review.userName}</span>
                  </div>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current text-amber-500' : 'text-gray-200 dark:text-white/10'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-relaxed italic">"{review.comment}"</p>
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10">
            <AlertCircle className="h-12 w-12 text-gray-300 dark:text-white/10 mx-auto mb-4" />
            <p className="text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest text-[10px]">No operational feedback detected.</p>
          </div>
        )}
      </div>
    </div>
  );
};
