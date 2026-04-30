import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storage, STORAGE_KEYS } from '../services/storage';
import { User, Order, Product, UserRole } from '../types';
import { 
  Users, ShoppingBag, DollarSign, TrendingUp,
  Clock, Trash2, Shield, Eye, CheckCircle, XCircle,
  AlertCircle, ShieldCheck, ShieldAlert, Settings,
  CreditCard, Bell, Lock
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '../context/CurrencyContext';
import { TrackingModal } from '../components/TrackingModal';
import { InvoiceModal } from '../components/InvoiceModal';

const MOCK_CHART_DATA = [
  { name: 'Mon', sales: 4000, users: 2400 },
  { name: 'Tue', sales: 3000, users: 1398 },
  { name: 'Wed', sales: 2000, users: 9800 },
  { name: 'Thu', sales: 2780, users: 3908 },
  { name: 'Fri', sales: 1890, users: 4800 },
  { name: 'Sat', sales: 2390, users: 3800 },
  { name: 'Sun', sales: 3490, users: 4300 },
];

export const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const { formatPrice } = useCurrency();
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  
  const [activeUserTab, setActiveUserTab] = useState<UserRole | 'pending-sellers'>('seller');
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteInput, setDeleteInput] = useState('');

  useEffect(() => {
    if (deleteInput === 'DELETE' && deleteConfirmUser) {
      // Small delay to let the user see "DELETE" has been typed before the modal vanishes
      const timer = setTimeout(() => {
        executeDeleteUser();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [deleteInput, deleteConfirmUser]);

  useEffect(() => {
    setUsers(storage.get<User>(STORAGE_KEYS.USERS));
    setOrders(storage.get<Order>(STORAGE_KEYS.ORDERS));
    setProducts(storage.get<Product>(STORAGE_KEYS.PRODUCTS));
  }, [currentUser]);

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const activeSellers = users.filter(u => u.role === 'seller' && u.verificationStatus === 'verified').length;
  const pendingVerifications = users.filter(u => u.role === 'seller' && u.verificationStatus === 'pending').length;

  const handleUpdateVerification = async (userId: string, status: 'verified' | 'rejected') => {
    try {
      const allUsers = storage.get<User>(STORAGE_KEYS.USERS);
      const updatedUsers = allUsers.map(u => 
        u.id === userId ? { ...u, verificationStatus: status } : u
      );
      storage.save(STORAGE_KEYS.USERS, updatedUsers);
      setUsers(updatedUsers);

      alert(`Seller ${status === 'verified' ? 'verified' : 'rejected'} successfully.`);
    } catch (error) {
      console.error("Verification update failed:", error);
      alert("Failed to update verification status.");
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (!userId) return;

    if (currentUser && userId === currentUser.id) {
      alert("You cannot delete your own administrative account.");
      return;
    }
    
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;

    setDeleteConfirmUser(userToDelete);
    setDeleteInput('');
  };

  const executeDeleteUser = async () => {
    if (!deleteConfirmUser || deleteInput !== 'DELETE') return;

    const userId = deleteConfirmUser.id;
    try {
      // Local update
      const updatedUsersList = users.filter(u => u.id !== userId);
      setUsers(updatedUsersList);
      
      const allUsers = storage.get<User>(STORAGE_KEYS.USERS);
      storage.save(STORAGE_KEYS.USERS, allUsers.filter(u => u.id !== userId));

      if (deleteConfirmUser.role === 'seller') {
        const allProducts = storage.get<Product>(STORAGE_KEYS.PRODUCTS);
        const remainingProducts = allProducts.filter(p => p.sellerId !== userId);
        storage.save(STORAGE_KEYS.PRODUCTS, remainingProducts);
        setProducts(remainingProducts);
      }

      setDeleteConfirmUser(null);
      setDeleteInput('');
      alert("User and associated data successfully removed.");
    } catch (error: any) {
      console.error("DELETE ERROR:", error);
      alert(`Deletion Failed: ${error.message || 'Unknown error'}`);
      setDeleteConfirmUser(null);
      setDeleteInput('');
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const allUsers = storage.get<User>(STORAGE_KEYS.USERS);
      const updatedList = allUsers.map(u => u.id === userId ? { ...u, ...updates } : u);
      storage.save(STORAGE_KEYS.USERS, updatedList);
      setUsers(updatedList);

      setEditingUser(null);
      alert("User settings updated successfully.");
    } catch (error) {
      console.error("User update failed:", error);
      alert("Failed to update user settings.");
    }
  };

  const filteredUsers = users.filter(u => {
    if (activeUserTab === 'pending-sellers') {
      return u.role === 'seller' && u.verificationStatus === 'pending';
    }
    return u.role === activeUserTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Administration</h1>
          <p className="text-gray-500 font-medium">Monitoring platform usage and performance</p>
        </div>
      </div>

      <TrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />
      <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: formatPrice(totalSales), icon: DollarSign, color: 'emerald', trend: '+12.5%' },
          { label: 'Active Users', value: users.length.toString(), icon: Users, color: 'indigo', trend: '+4.2%' },
          { label: 'Total Orders', value: orders.length.toString(), icon: ShoppingBag, color: 'violet', trend: '+18.1%' },
          { label: 'Total Sellers', value: activeSellers.toString(), icon: Shield, color: 'amber', trend: '+2.4%' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className={`text-xs font-black text-${stat.color}-600 bg-${stat.color}-50 px-2 py-1 rounded-full`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center">
            <TrendingUp className="h-5 w-5 mr-4 text-emerald-500" />
            Sales Performance
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center">
            <Users className="h-5 w-5 mr-4 text-indigo-500" />
            User Acquisition
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="users" fill="#818cf8" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-center bg-gray-50/30 gap-6">
          <div>
            <h3 className="text-lg font-black text-gray-900">Platform Users</h3>
            <p className="text-xs font-medium text-gray-400">Manage accounts and verify identities</p>
          </div>
          <div className="flex flex-wrap bg-white p-1 rounded-2xl border border-gray-100">
             <button 
              onClick={() => setActiveUserTab('buyer')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeUserTab === 'buyer' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}
             >
                Buyers
             </button>
             <button 
              onClick={() => setActiveUserTab('seller')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeUserTab === 'seller' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}
             >
                Sellers
             </button>
             <button 
              onClick={() => setActiveUserTab('pending-sellers')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${activeUserTab === 'pending-sellers' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}
             >
                Verifications
                {pendingVerifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                    {pendingVerifications}
                  </span>
                )}
             </button>
             <button 
              onClick={() => setActiveUserTab('admin')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeUserTab === 'admin' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}
             >
                Admins
             </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Status</th>
                {activeUserTab === 'pending-sellers' && <th className="px-8 py-4">Identity Document</th>}
                <th className="px-8 py-4">Joined</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-indigo-600 font-black">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {u.role === 'seller' ? (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center w-fit space-x-1.5 ${
                        u.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-700' : 
                        u.verificationStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                        u.verificationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {u.verificationStatus === 'verified' ? <ShieldCheck className="h-3 w-3" /> : 
                         u.verificationStatus === 'pending' ? <Clock className="h-3 w-3" /> :
                         u.verificationStatus === 'rejected' ? <ShieldAlert className="h-3 w-3" /> :
                         <AlertCircle className="h-3 w-3" />}
                        <span>{u.verificationStatus || 'unverified'}</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-700">
                        {u.role}
                      </span>
                    )}
                  </td>
                  {activeUserTab === 'pending-sellers' && (
                    <td className="px-8 py-6">
                      {u.idDocument ? (
                        <button 
                          onClick={() => setViewingId(u.idDocument!)}
                          className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-bold text-xs"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Document</span>
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs italic">No document</span>
                      )}
                    </td>
                  )}
                  <td className="px-8 py-6 text-sm text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-8 py-6 text-right space-x-2">
                    {activeUserTab === 'pending-sellers' ? (
                      <>
                        <button 
                          onClick={() => handleUpdateVerification(u.id, 'verified')}
                          className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                          title="Approve Seller"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleUpdateVerification(u.id, 'rejected')}
                          className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Reject Seller"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center justify-end space-x-1">
                        <button 
                          onClick={() => setEditingUser(u)}
                          className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-emerald-50 rounded-xl transition-all"
                          title="Manage Settings"
                        >
                          <Settings className="h-5 w-5" />
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUser(u.id);
                          }}
                          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group"
                          title="Delete User"
                        >
                          <Trash2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={activeUserTab === 'pending-sellers' ? 5 : 4} className="px-8 py-20 text-center text-gray-300 font-medium italic">No {activeUserTab === 'pending-sellers' ? 'pending verifications' : activeUserTab + 's'} found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ID Viewer Modal */}
      <AnimatePresence>
        {viewingId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setViewingId(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white max-w-4xl w-full rounded-[3rem] p-4 shadow-2xl overflow-hidden">
              <button 
                onClick={() => setViewingId(null)}
                className="absolute top-6 right-6 z-10 bg-white/90 text-gray-900 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <XCircle className="h-6 w-6" />
              </button>
              <div className="max-h-[80vh] overflow-auto rounded-[2rem]">
                <img src={viewingId} alt="Verification ID" className="w-full h-auto" />
              </div>
              <div className="p-6 text-center">
                <p className="text-gray-500 font-medium">Verify the details on the identification card carefully before approving.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Recent Transactions */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h3 className="text-lg font-black text-gray-900">Recent Transactions</h3>
          <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">Download CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-4">ID</th>
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Est. Delivery</th>
                <th className="px-8 py-4 text-right">Date</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6 text-sm font-black text-indigo-600">#{order.id}</td>
                  <td className="px-8 py-6 font-bold text-gray-900">{users.find(u => u.id === order.buyerId)?.name || 'Guest'}</td>
                  <td className="px-8 py-6 font-black text-gray-900">{formatPrice(order.total)}</td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase">
                      <Clock className="h-3 w-3 mr-1.5" />
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-[10px] font-black text-indigo-600 uppercase">
                    {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'Pending'}
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-400 text-right">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button 
                      onClick={() => setTrackingOrder(order)}
                      className="p-1 px-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg hover:bg-indigo-600 hover:text-white"
                    >
                      Track
                    </button>
                    <button 
                      onClick={() => setInvoiceOrder(order)}
                      className="p-1 px-2 bg-gray-50 text-gray-600 text-[10px] font-black uppercase rounded-lg hover:bg-gray-900 hover:text-white"
                    >
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-300 font-medium">No transactions recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Management Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setEditingUser(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white max-w-2xl w-full rounded-[3rem] shadow-2xl overflow-hidden">
              <div className="p-8 md:p-12 space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Manage Account</h2>
                    <p className="text-sm font-medium text-gray-400">Overriding settings for {editingUser.name}</p>
                  </div>
                  <button onClick={() => setEditingUser(null)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                    <XCircle className="h-6 w-6 text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Account Settings */}
                  <div className="space-y-4 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                      <Settings className="h-3 w-3 mr-2" /> Account Settings
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-bold text-gray-400 ml-1">Role</label>
                        <select 
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                          className="w-full p-3 bg-white border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="buyer">Buyer</option>
                          <option value="seller">Seller</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-gray-400 ml-1">Verification</label>
                        <select 
                          value={editingUser.verificationStatus || 'idle'}
                          onChange={(e) => setEditingUser({ ...editingUser, verificationStatus: e.target.value as any })}
                          className="w-full p-3 bg-white border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="idle">Unverified</option>
                          <option value="pending">Pending</option>
                          <option value="verified">Verified</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>

                      {/* Payment Methods */}
                      <div className="space-y-4 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                          <CreditCard className="h-3 w-3 mr-2" /> Payment & Currency
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-[9px] font-bold text-gray-400 ml-1">Default Currency</label>
                            <select 
                              value={editingUser.settings?.payment.currency || 'NGN'}
                              onChange={(e) => setEditingUser({
                                ...editingUser,
                                settings: {
                                  ...(editingUser.settings || {
                                    notifications: { email: true, push: false },
                                    payment: { currency: 'NGN', defaultMethod: 'card' },
                                    security: { twoFactorEnabled: false, lastLoginAlert: true }
                                  }),
                                  payment: {
                                    ...(editingUser.settings?.payment || { defaultMethod: 'card' }),
                                    currency: e.target.value
                                  }
                                }
                              })}
                              className="w-full p-3 bg-white border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="NGN">NGN (₦)</option>
                              <option value="USD">USD ($)</option>
                              <option value="EUR">EUR (€)</option>
                              <option value="GBP">GBP (£)</option>
                              <option value="GHS">GHS (₵)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-gray-400 ml-1">Payment Method</label>
                            <select 
                              value={editingUser.settings?.payment.defaultMethod || 'card'}
                              onChange={(e) => setEditingUser({
                                ...editingUser,
                                settings: {
                                  ...(editingUser.settings || {
                                    notifications: { email: true, push: false },
                                    payment: { currency: 'NGN', defaultMethod: 'card' },
                                    security: { twoFactorEnabled: false, lastLoginAlert: true }
                                  }),
                                  payment: {
                                    ...(editingUser.settings?.payment || { currency: 'NGN' }),
                                    defaultMethod: e.target.value
                                  }
                                }
                              })}
                              className="w-full p-3 bg-white border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="card">Credit / Debit Card</option>
                              <option value="bank">Bank Transfer</option>
                              <option value="wallet">Digital Wallet</option>
                              <option value="mtn">MTN Mobile Money</option>
                              <option value="bitcoin">Bitcoin (BTC)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                  {/* Security & Privacy */}
                  <div className="space-y-4 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                      <Lock className="h-3 w-3 mr-2" /> Security & Privacy
                    </h4>
                    <div className="space-y-2">
                       <button className="w-full p-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-emerald-100">
                        Force Password Reset
                      </button>
                      <button className="w-full p-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase">
                        Enable 2FA (Bypass)
                      </button>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="space-y-4 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                      <Bell className="h-3 w-3 mr-2" /> Notifications
                    </h4>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100">
                        <span className="text-xs font-bold text-gray-600">Email Alerts</span>
                        <div className="w-8 h-4 bg-emerald-500 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" /></div>
                      </label>
                      <label className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100">
                        <span className="text-xs font-bold text-gray-600">Push Alerts</span>
                        <div className="w-8 h-4 bg-gray-200 rounded-full cursor-not-allowed" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setEditingUser(null)}
                    className="flex-1 px-8 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-50 transition-all border border-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateUser(editingUser.id, { 
                      role: editingUser.role,
                      verificationStatus: editingUser.verificationStatus,
                      settings: editingUser.settings
                    })}
                    className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmUser(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
              >
                <div className="p-8 md:p-10">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6 mx-auto">
                    <Trash2 className="h-8 w-8" />
                  </div>
                  
                  <h2 className="text-2xl font-black text-gray-900 text-center mb-2">Delete {deleteConfirmUser.role}?</h2>
                  <p className="text-gray-500 text-center text-sm font-medium mb-8">
                    You are about to permanently delete <span className="text-gray-900 font-bold">{deleteConfirmUser.name}</span>. 
                    This action <span className="text-red-600 font-bold underline">cannot be undone</span>.
                  </p>

                  <div className="bg-gray-50 rounded-2xl p-6 mb-8 space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consequences</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start text-xs font-bold text-gray-600">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                        Account access will be revoked immediately
                      </li>
                      {deleteConfirmUser.role === 'seller' && (
                        <li className="flex items-start text-xs font-bold text-gray-600">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                          All products listed by this seller will be removed
                        </li>
                      )}
                      <li className="flex items-start text-xs font-bold text-gray-600">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                        Chat history and notifications will be archived
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                        Type <span className="text-red-600 font-black">DELETE</span> for immediate removal
                      </label>
                      <input
                        type="text"
                        value={deleteInput}
                        onChange={(e) => setDeleteInput(e.target.value)}
                        placeholder="Type DELETE"
                        className={`w-full border-2 rounded-2xl px-5 py-4 outline-none transition-all font-black text-center placeholder:text-gray-200 ${
                          deleteInput === 'DELETE' 
                            ? 'bg-red-600 text-white border-red-600' 
                            : 'bg-gray-50 border-transparent focus:border-red-500 focus:bg-white text-red-600'
                        }`}
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setDeleteConfirmUser(null)}
                        className="flex-1 px-4 py-4 rounded-2xl font-black text-gray-500 hover:bg-gray-100 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={executeDeleteUser}
                        disabled={deleteInput !== 'DELETE'}
                        className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black hover:bg-red-700 transition-all shadow-xl shadow-red-200 disabled:opacity-50 disabled:shadow-none"
                      >
                        Confirm Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

