import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Truck, Crosshair, Map as MapIcon, Globe, Phone, MessageCircle } from 'lucide-react';
import { Order } from '../types';

interface TrackingModalProps {
  order: Order | null;
  onClose: () => void;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const lat = order.tracking?.lat || 5.6037;
  const lng = order.tracking?.lng || -0.1870;
  
  // Using Google Maps Embed API with satellite view
  // Note: Standard embed doesn't always support maptype in the public URL without an API key, 
  // but we can use a stylized iframe or a placeholder if needed.
  // For this app, we'll use a direct maps link in satellite mode.
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=REPLACE_WITH_YOUR_KEY&q=${lat},${lng}&maptype=satellite`;
  
  // Since we don't have a real API key here, we'll use the generic URL structure 
  // or a placeholder that looks like a satellite map.
  const genericMapUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=k&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row h-full max-h-[800px]"
        >
          {/* Map Section */}
          <div className="relative flex-grow h-[300px] lg:h-auto bg-gray-200">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={genericMapUrl}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[0.2] contrast-[1.1]"
              title="Satellite Tracking view"
            />
            <div className="absolute top-6 left-6 flex space-x-2">
              <div className="bg-white/90 backdrop-blur shadow-xl px-4 py-2 rounded-2xl flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Live Satellite Feed</span>
              </div>
            </div>
            
            {/* Custom Overlay Controls */}
            <div className="absolute bottom-6 left-6 flex space-x-2">
               <button className="bg-white/90 backdrop-blur shadow-lg p-3 rounded-2xl text-gray-700 hover:bg-white transition-all">
                 <Crosshair className="h-4 w-4" />
               </button>
               <button className="bg-indigo-600 shadow-lg px-4 py-2 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
                 <Globe className="h-4 w-4" />
                 <span>Switch View</span>
               </button>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="w-full lg:w-[350px] bg-white p-8 overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-100">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-black text-gray-900">Track Item</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-8">
              <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Current Status</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-indigo-700" />
                    <p className="text-lg font-black text-indigo-900 capitalize">{order.status}</p>
                  </div>
                  {order.estimatedDelivery && (
                    <div className="text-right">
                      <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Est. Arrival</p>
                      <p className="text-xs font-black text-indigo-900">
                        {new Date(order.estimatedDelivery).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Delivery Destination</h3>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{order.shippingAddress?.street}</p>
                      <p className="text-xs text-gray-400">{order.shippingAddress?.city}</p>
                      {order.shippingAddress?.ghanaPostGps && (
                        <div className="mt-2 inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black uppercase border border-emerald-100">
                          Ghana Post: {order.shippingAddress.ghanaPostGps}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-50">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Order Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-gray-500">Order ID</span>
                      <span className="font-black text-gray-900">#{order.id}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-gray-500">Carrier</span>
                      <span className="font-black text-indigo-600 uppercase">{order.carrier || 'Kwatraco Express'}</span>
                    </div>
                    {order.sellerPhone && (
                      <div className="pt-4 space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Contact Seller</p>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => window.location.href = `tel:${order.sellerPhone}`}
                            className="flex items-center justify-center space-x-2 bg-gray-50 py-2 rounded-xl text-[10px] font-black text-gray-700 hover:bg-gray-100 transition-all border border-gray-100"
                          >
                            <Phone className="h-3 w-3" />
                            <span>Phone Call</span>
                          </button>
                          <button 
                            onClick={() => window.location.href = `https://wa.me/${order.sellerPhone?.replace(/\D/g, '')}`}
                            className="flex items-center justify-center space-x-2 bg-emerald-50 py-2 rounded-xl text-[10px] font-black text-emerald-700 hover:bg-emerald-100 transition-all border border-emerald-100"
                          >
                            <MessageCircle className="h-3 w-3" />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between text-xs font-black pt-4">
                      <span className="text-gray-500">Tracking Code</span>
                      <span className="text-gray-900 font-mono tracking-widest">TRK-{order.id.slice(0, 4)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {order.deliveryContact && (
                <button 
                  onClick={() => window.location.href = `tel:${order.deliveryContact}`}
                  className="w-full bg-gray-900 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-black transition-all flex items-center justify-center space-x-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Delivery Agent</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
