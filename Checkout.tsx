import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useCurrency } from '../context/CurrencyContext';
import { 
  CreditCard, Smartphone, Banknote, 
  ChevronRight, Lock, ShieldCheck, 
  MapPin, CheckCircle2, Bitcoin
} from 'lucide-react';
import { storage, STORAGE_KEYS } from '../services/storage';
import { motion, AnimatePresence } from 'motion/react';

export const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mtn' | 'bitcoin' | 'paypal' | 'cash'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [address, setAddress] = useState({
    street: '',
    city: '',
    zip: '',
    ghanaPostGps: ''
  });

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newOrder = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      buyerId: user!.id,
      sellerIds: [...new Set(items.map(i => i.sellerId))],
      items: [...items],
      total,
      status: 'pending' as const,
      paymentMethod,
      carrier: 'Kwatraco Logistics',
      sellerPhone: '+233 50 123 4567',
      deliveryContact: '+233 24 555 0192',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      shippingAddress: address,
      tracking: {
        lat: 5.6037, // Accra coordinates
        lng: -0.1870,
        lastUpdated: new Date().toISOString(),
        path: [
          { lat: 5.6037, lng: -0.1870 },
          { lat: 5.6100, lng: -0.1900 },
          { lat: 5.6200, lng: -0.2000 }
        ]
      },
      createdAt: new Date().toISOString()
    };

    storage.insertOne(STORAGE_KEYS.ORDERS, newOrder);
    addNotification('Order Placed!', `Your order ${newOrder.id} has been received and is being processed.`);
    
    setIsProcessing(false);
    setIsCompleted(true);
    clearCart();
  };

  if (isCompleted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        </motion.div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-500 max-w-sm mb-8">
          Thank you for your purchase. We've sent a confirmation email and will update you when your order ships.
        </p>
        <div className="flex gap-4">
          <Link 
            to="/orders" 
            className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
          >
            Track Order
          </Link>
          <Link 
            to="/" 
            className="bg-white border border-gray-200 text-gray-600 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-all"
          >
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-2 text-sm text-gray-400 mb-10 overflow-x-auto whitespace-nowrap pb-2">
        <span className={step >= 1 ? 'text-indigo-600 font-black' : ''}>Shipping</span>
        <ChevronRight className="h-4 w-4" />
        <span className={step >= 2 ? 'text-indigo-600 font-black' : ''}>Payment</span>
        <ChevronRight className="h-4 w-4" />
        <span className={step >= 3 ? 'text-indigo-600 font-black' : ''}>Confirmation</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Side: Forms */}
        <div className="space-y-12">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Street Address</label>
                  <input 
                    type="text" 
                    value={address.street}
                    onChange={e => setAddress({...address, street: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">City</label>
                  <input 
                    type="text" 
                    value={address.city}
                    onChange={e => setAddress({...address, city: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">ZIP Code</label>
                  <input 
                    type="text" 
                    value={address.zip}
                    onChange={e => setAddress({...address, zip: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" /> Ghana Post GPS Address
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. AK-484-9321"
                    value={address.ghanaPostGps}
                    onChange={e => setAddress({...address, ghanaPostGps: e.target.value})}
                    className="w-full bg-indigo-50/30 border border-indigo-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-bold placeholder:text-indigo-200"
                  />
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!address.street || !address.city}
                className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
              >
                Continue to Payment
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'card', name: 'Credit Card', icon: CreditCard, color: 'indigo' },
                  { id: 'mtn', name: 'MTN Mobile Money', icon: Smartphone, color: 'yellow' },
                  { id: 'bitcoin', name: 'Bitcoin (BTC)', icon: Bitcoin, color: 'amber' },
                  { id: 'paypal', name: 'PayPal', icon: ShieldCheck, color: 'blue' },
                  { id: 'cash', name: 'Cash on Delivery', icon: Banknote, color: 'emerald' }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-6 rounded-3xl border-2 text-left transition-all ${
                      paymentMethod === method.id 
                        ? `border-indigo-600 bg-indigo-50/50 shadow-md` 
                        : 'border-gray-100 hover:border-gray-200 bg-white shadow-sm'
                    }`}
                  >
                    <method.icon className={`h-6 w-6 mb-4 ${paymentMethod === method.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span className="block font-black text-gray-900">{method.name}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1 block">Secure Option</span>
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Card Number</label>
                    <input type="text" placeholder="•••• •••• •••• ••••" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expiry Date</label>
                      <input type="text" placeholder="MM/YY" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">CVC</label>
                      <input type="text" placeholder="•••" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="px-8 py-5 rounded-3xl font-black text-gray-500 hover:bg-gray-100 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex-grow bg-indigo-600 text-white py-5 rounded-3xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>Place Order {formatPrice(total)}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Side: Summary Card */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-indigo-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-200">
            <h3 className="text-xl font-black mb-8">Order Summary</h3>
            <div className="space-y-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex-shrink-0 overflow-hidden">
                    <img src={item.images?.[0] || ''} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-sm truncate">{item.name}</p>
                    <p className="text-indigo-300 text-xs">{item.quantity} x {formatPrice(item.price)}</p>
                  </div>
                  <p className="font-black text-sm">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
              <div className="flex justify-between text-indigo-300 text-sm font-medium">
                <span>Subtotal</span>
                <span className="text-white font-bold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-indigo-300 text-sm font-medium">
                <span>Shipping</span>
                <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest bg-emerald-400/10 px-2 py-0.5 rounded">Free</span>
              </div>
              <div className="flex justify-between items-end mt-4">
                <span className="text-indigo-200 font-black text-lg">Total</span>
                <span className="text-4xl font-black">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-10 p-4 bg-white/5 rounded-2xl flex items-center space-x-3">
              <ShieldCheck className="h-5 w-5 text-indigo-300" />
              <p className="text-[10px] text-indigo-200 font-medium">Your data is encrypted with bank-level security. We never store your full card details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
