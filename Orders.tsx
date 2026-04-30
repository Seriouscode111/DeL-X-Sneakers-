import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storage, STORAGE_KEYS } from '../services/storage';
import { Order, Product } from '../types';
import { 
  Package, Truck, CheckCircle, Clock, 
  ChevronRight, ShoppingBag, ExternalLink,
  Search, Filter, Printer, MessageSquare, Phone, MessageCircle
} from 'lucide-react';

import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { TrackingModal } from '../components/TrackingModal';
import { InvoiceModal } from '../components/InvoiceModal';

export const Orders = () => {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) return;
    const all = storage.get<Order>(STORAGE_KEYS.ORDERS);
    if (user.role === 'admin') {
      setOrders(all);
    } else if (user.role === 'seller') {
      setOrders(all.filter(o => o.sellerIds.includes(user.id)));
    } else {
      setOrders(all.filter(o => o.buyerId === user.id));
    }
  }, [user]);

  const handleUpdateOrder = (orderId: string, updates: Partial<Order>) => {
    try {
      const all = storage.get<Order>(STORAGE_KEYS.ORDERS);
      const updated = all.map(o => o.id === orderId ? { ...o, ...updates } : o);
      storage.save(STORAGE_KEYS.ORDERS, updated);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  const filteredOrders = orders.filter(o => activeTab === 'all' || o.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-indigo-100 text-indigo-700';
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      default: return Package;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <div className="flex justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Your Orders</h1>
          <p className="text-gray-500 font-medium">Manage and track your recent purchases</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
          {['all', 'pending', 'shipped', 'delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                   ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                   : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <TrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />
      <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={order.id}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="p-8">
                  <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getStatusColor(order.status).replace('text-', 'bg-').replace('100', '50')} ${getStatusColor(order.status).split(' ')[1]}`}>
                        <StatusIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 underline decoration-indigo-200 decoration-2 underline-offset-4">Order #{order.id}</p>
                        <p className="text-xs text-gray-400 font-medium">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                            <img src={item.images?.[0] || ''} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow">
                            <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                            <p className="text-xs text-gray-400">Qty: {item.quantity} • {formatPrice(item.price)}</p>
                          </div>
                          <p className="font-black text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50/50 rounded-2xl p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-gray-400 uppercase tracking-widest">Payment</span>
                            <span className="text-gray-900 uppercase tracking-widest">{order.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-gray-400 uppercase tracking-widest">Shipping</span>
                            <span className="text-emerald-600 uppercase tracking-widest">Free Express</span>
                          </div>
                          {(order.trackingNumber || order.carrier) && (
                            <div className="pt-2 border-t border-gray-100">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tracking Info</p>
                              <div className="flex justify-between text-xs font-bold">
                                <span className="text-indigo-600 uppercase">{order.carrier || 'Standard'}</span>
                                <span className="text-gray-900 font-mono tracking-tighter">{order.trackingNumber}</span>
                              </div>
                            </div>
                          )}
                          {order.estimatedDelivery && order.status !== 'delivered' && (
                            <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. Delivery</p>
                              <p className="text-xs font-black text-indigo-600">
                                {new Date(order.estimatedDelivery).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Seller Controls for tracking */}
                        {(user?.role === 'seller' || user?.role === 'admin') && order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <div className="pt-4 border-t border-gray-100 space-y-3">
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Update Shipping Status</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Carrier</label>
                                <input 
                                  type="text" 
                                  placeholder="DHL, FedEx..."
                                  defaultValue={order.carrier}
                                  onBlur={(e) => handleUpdateOrder(order.id, { carrier: e.target.value })}
                                  className="w-full px-3 py-2 bg-white rounded-xl border border-gray-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Tracking #</label>
                                <input 
                                  type="text" 
                                  placeholder="TRK-123..."
                                  defaultValue={order.trackingNumber}
                                  onBlur={(e) => handleUpdateOrder(order.id, { trackingNumber: e.target.value })}
                                  className="w-full px-3 py-2 bg-white rounded-xl border border-gray-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {order.status === 'pending' && (
                                <button 
                                  onClick={() => handleUpdateOrder(order.id, { status: 'processing' })}
                                  className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700"
                                >
                                  Process
                                </button>
                              )}
                              {(order.status === 'pending' || order.status === 'processing') && (
                                <button 
                                  onClick={() => {
                                    if (!order.trackingNumber) {
                                      alert("Please enter a tracking number before shipping.");
                                      return;
                                    }
                                    handleUpdateOrder(order.id, { status: 'shipped' });
                                  }}
                                  className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700"
                                >
                                  Mark Shipped
                                </button>
                              )}
                              {order.status === 'shipped' && (
                                <button 
                                  onClick={() => handleUpdateOrder(order.id, { status: 'delivered' })}
                                  className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700"
                                >
                                  Delivered
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="pt-4 border-t border-gray-100 mt-4 flex justify-between items-end">
                        <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
                        <span className="text-2xl font-black text-indigo-600">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                  <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setTrackingOrder(order)}
                      className="text-[10px] font-black text-indigo-600 bg-white px-4 py-2 rounded-xl shadow-sm uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center"
                    >
                      <Truck className="h-3 w-3 mr-1.5" /> Track
                    </button>
                    <button 
                      onClick={() => setInvoiceOrder(order)}
                      className="text-[10px] font-black text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all flex items-center"
                    >
                      <Printer className="h-3 w-3 mr-1.5" /> Invoice
                    </button>
                    <button 
                      className="text-[10px] font-black text-indigo-600 bg-white px-3 py-2 rounded-xl shadow-sm uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center border border-indigo-50"
                      onClick={() => navigate(`/chat?seller=${order.sellerIds?.[0] || ''}`)}
                    >
                      <MessageSquare className="h-3 w-3 mr-1.5" /> Chat on MarketMaster
                    </button>
                    <button 
                      className="text-[10px] font-black text-gray-500 bg-white px-3 py-2 rounded-xl shadow-sm uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center border border-gray-50"
                      onClick={() => window.location.href = `https://wa.me/${order.sellerPhone?.replace(/\D/g, '')}`}
                    >
                      <MessageCircle className="h-3 w-3 mr-1.5" /> WhatsApp Seller
                    </button>
                    <button 
                      className="text-[10px] font-black text-gray-500 bg-white px-3 py-2 rounded-xl shadow-sm uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center border border-gray-50"
                      onClick={() => window.location.href = `tel:${order.sellerPhone}`}
                    >
                      <Phone className="h-3 w-3 mr-1.5" /> Call Seller
                    </button>
                    {order.deliveryContact && (
                      <button 
                        className="text-[10px] font-black text-indigo-600 bg-white px-3 py-2 rounded-xl shadow-sm uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center border border-indigo-50"
                        onClick={() => window.location.href = `tel:${order.deliveryContact}`}
                      >
                        <Phone className="h-3 w-3 mr-1.5" /> Call Agent
                      </button>
                    )}
                  </div>
                  <button className="flex items-center text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform">
                    Need Help? <ExternalLink className="ml-1.5 h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredOrders.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-400 max-w-xs mx-auto mb-8 font-medium">It looks like you haven't placed any orders in this category yet.</p>
            <Link to="/search" className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold hover:bg-indigo-700 transition-all">
              Go Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
