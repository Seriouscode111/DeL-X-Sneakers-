import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Download, ShoppingBag } from 'lucide-react';
import { Order } from '../types';
import { useCurrency } from '../context/CurrencyContext';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  const { formatPrice } = useCurrency();
  
  if (!order) return null;

  const handlePrint = () => {
    const printContent = document.getElementById('invoice-content');
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'left=50,top=50,width=800,height=900');

    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice #${order.id}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                .no-print { display: none; }
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <div class="p-10 font-sans">
              ${printContent.innerHTML}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 className="text-xl font-black text-gray-900 flex items-center">
                <ShoppingBag className="h-5 w-5 mr-3 text-indigo-600" />
                Invoice Details
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Order #{order.id}</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={handlePrint}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <Printer className="h-4 w-4" />
                <span>Print Invoice</span>
              </button>
              <button onClick={onClose} className="p-2.5 hover:bg-gray-200 rounded-2xl transition-all">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-grow overflow-y-auto p-12" id="invoice-content">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">KWATRACO</h3>
                <p className="text-sm text-gray-500 max-w-[200px]">
                  Official e-Commerce & Logistics Hub<br/>
                  Accra Digital Centre, Ghana
                </p>
              </div>
              <div className="text-right">
                <h4 className="text-lg font-black text-gray-900 mb-1">INVOICE</h4>
                <p className="text-xs font-bold text-gray-400 uppercase">Issued: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-xs font-bold text-gray-400 uppercase mt-1">Due: PAID</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Bill To:</h5>
                <p className="text-sm font-black text-gray-900 mb-1">Customer</p>
                <p className="text-xs text-gray-500 whitespace-pre-wrap">
                  {order.shippingAddress?.street}<br/>
                  {order.shippingAddress?.city}, {order.shippingAddress?.zip}<br/>
                  {order.shippingAddress?.ghanaPostGps && `GPS: ${order.shippingAddress.ghanaPostGps}`}
                </p>
              </div>
              <div className="text-right">
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Payment Info:</h5>
                <p className="text-sm font-black text-gray-900 mb-1">{order.paymentMethod.toUpperCase()}</p>
                <p className="text-xs text-gray-500 uppercase">Status: Success</p>
              </div>
            </div>

            {/* Table */}
            <div className="border border-gray-100 rounded-3xl overflow-hidden mb-12">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Item</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Qty</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Price</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-500 text-center">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-500 text-right">{formatPrice(item.price)}</td>
                      <td className="px-6 py-4 text-sm font-black text-indigo-600 text-right">{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100">
              <div className="w-full max-w-[250px] space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-400">Subtotal</span>
                  <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-400">Delivery</span>
                  <span className="font-bold text-gray-900">{formatPrice(0)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-100">
                  <span className="text-lg font-black text-gray-900">Total</span>
                  <span className="text-lg font-black text-indigo-600">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thank you for your purchase!</p>
              <p className="text-[8px] text-gray-300 mt-2">KWATRACO HUB - REG: 593-291-032</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
