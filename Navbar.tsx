import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Bell, MessageSquare, LogOut, Globe, X, ExternalLink, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { useChat } from '../context/ChatContext';
import { useCurrency, SUPPORTED_CURRENCIES } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { Notification } from '../types';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { threads, unreadMessageCount } = useChat();
  const { currency, setCurrency } = useCurrency();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNotificationClick = (notif: Notification) => {
    markAsRead(notif.id);
    if (notif.link) {
      if (notif.link.startsWith('http')) {
        window.open(notif.link, '_blank');
      } else {
        navigate(notif.link);
      }
      setIsNotificationsOpen(false);
    } else {
      setSelectedNotification(notif);
      setIsNotificationsOpen(false);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md py-3 border-b border-gray-100 dark:border-white/5' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="text-2xl font-black tracking-tighter uppercase italic group text-black dark:text-white">
              Sneaker<span className="text-[#00FF00] group-hover:text-black dark:group-hover:text-white transition-colors">X</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-10">
              {[
                { label: 'Home', path: '/' },
                { label: 'Shop', path: '/search' },
                { label: 'New Drops', path: '/new-drops' },
                { label: 'Contact', path: '/contact' }
              ].map((item) => (
                <Link 
                  key={item.label} 
                  to={item.path} 
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400 hover:text-[#00FF00] hover:tracking-[0.4em] transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors p-2 rounded-xl bg-gray-100 dark:bg-white/5"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 text-white" /> : <Moon className="h-4 w-4 text-black" />}
              </button>

              {/* Search */}
              <button 
                onClick={() => navigate('/search')}
                className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
              
              {/* Cart */}
              <Link to="/cart" className="relative text-gray-400 hover:text-white transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-black leading-none text-black bg-[#00FF00] rounded-full">
                    {items.length}
                  </span>
                )}
              </Link>

              {/* Messages */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsMessagesOpen(!isMessagesOpen);
                    setIsNotificationsOpen(false);
                  }}
                  className="relative text-gray-400 hover:text-white transition-colors focus:outline-none"
                >
                  <MessageSquare className="h-5 w-5" />
                  {user && unreadMessageCount > 0 && (
                    <span className="absolute -top-2 -right-2 block h-4 w-4 rounded-full bg-[#00FF00] text-[8px] font-black text-black flex items-center justify-center">
                      {unreadMessageCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isMessagesOpen && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMessagesOpen(false)}
                        className="fixed inset-0 z-40 bg-transparent"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-80 bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/10 rounded-[1.5rem] shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-black/50">
                          <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Incoming Comms</h3>
                          {user && <Link to="/chat" onClick={() => setIsMessagesOpen(false)} className="text-[8px] font-black text-[#00FF00] uppercase tracking-widest hover:underline">Full Console</Link>}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                          {user ? (
                            threads.length > 0 ? (
                              <div className="divide-y divide-white/5">
                                {threads.map((thread) => (
                                  <Link 
                                    key={thread.id} 
                                    to={`/chat?seller=${thread.partner.id}`}
                                    className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center"
                                    onClick={() => setIsMessagesOpen(false)}
                                  >
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-[#00FF00] font-black italic flex-shrink-0">
                                      {thread.partner.avatar ? (
                                        <img src={thread.partner.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                                      ) : (
                                        thread.partner.name?.charAt(0) || '?'
                                      )}
                                    </div>
                                    <div className="ml-3 min-w-0 flex-grow">
                                      <div className="flex justify-between items-center mb-0.5">
                                        <p className="text-[10px] font-black text-gray-900 dark:text-white truncate uppercase tracking-tight">{thread.partner.name}</p>
                                        <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500">{new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                      </div>
                                      <p className="text-[10px] text-gray-500 truncate font-medium">{thread.lastMessage || 'Open link to initiate chat'}</p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <div className="p-10 text-center">
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Digital Silence</p>
                              </div>
                            )
                          ) : (
                            <div className="p-10 text-center">
                              <Link to="/auth" className="bg-[#00FF00] text-black px-6 py-2 rounded-none text-[8px] font-black uppercase tracking-widest">Sign In</Link>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsMessagesOpen(false);
                  }}
                  className="relative text-gray-400 hover:text-white transition-colors focus:outline-none"
                >
                  <Bell className="h-5 w-5" />
                  {user && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-[#00FF00] ring-2 ring-black" />
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsNotificationsOpen(false)}
                        className="fixed inset-0 z-40 bg-transparent"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-80 bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/10 rounded-[1.5rem] shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-black/50">
                          <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Signal Feed</h3>
                          {user && <span className="text-[8px] font-black text-[#00FF00] uppercase tracking-widest">{unreadCount} Active</span>}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                          {user ? (
                            notifications.length > 0 ? (
                              <div className="divide-y divide-white/5">
                                {notifications.map((notif) => (
                                  <div 
                                    key={notif.id} 
                                    className={`p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${!notif.read ? 'bg-[#00FF00]/5' : ''}`}
                                    onClick={() => handleNotificationClick(notif)}
                                  >
                                    <div className="flex justify-between items-start mb-1">
                                      <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{notif.title}</p>
                                      <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500">{new Date(notif.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-[10px] text-gray-500 leading-relaxed truncate font-medium">{notif.message}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-10 text-center">
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">No Signals</p>
                              </div>
                            )
                          ) : (
                            <div className="p-10 text-center">
                               <Link to="/auth" className="bg-[#00FF00] text-black px-6 py-2 rounded-none text-[8px] font-black uppercase tracking-widest">Authorize Access</Link>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center focus:outline-none">
                    <div className="w-8 h-8 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center bg-white/5 group-hover:border-[#00FF00] transition-colors">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  <div className="absolute right-0 mt-4 w-56 bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-2">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5">
                      <p className="text-[10px] font-black text-gray-900 dark:text-white truncate uppercase tracking-tight">{user.name}</p>
                      <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 truncate lowercase">{user.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#00FF00] transition-colors">Terminal profile</Link>
                    <Link to="/orders" className="block px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#00FF00] transition-colors">Orders Archive</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[#00FF00] hover:text-white transition-colors">Admin Matrix</Link>
                    )}
                    {user.role === 'seller' && (
                      <Link to="/seller" className="block px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[#00FF00] hover:text-white transition-colors">Seller Nexus</Link>
                    )}
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-colors flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Terminate Session
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 border-b-2 border-transparent hover:bg-[#00FF00] dark:hover:bg-[#00FF00] transition-all text-[10px] font-black uppercase tracking-widest"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {selectedNotification && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedNotification(null)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
              
              <div className="w-16 h-16 bg-[#00FF00]/10 rounded-2xl flex items-center justify-center mb-6">
                <Bell className="h-8 w-8 text-[#00FF00]" />
              </div>
              
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">
                {selectedNotification.title}
              </h3>
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                {new Date(selectedNotification.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-8">
                {selectedNotification.message}
              </p>
              
              <div className="flex space-x-3">
                {selectedNotification.link && (
                  <button 
                    onClick={() => {
                      if (selectedNotification.link?.startsWith('http')) {
                        window.open(selectedNotification.link, '_blank');
                      } else {
                        navigate(selectedNotification.link!);
                      }
                      setSelectedNotification(null);
                    }}
                    className="flex-1 bg-white text-black py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#00FF00] transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Execute Link</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className={`flex-1 ${selectedNotification.link ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-[#00FF00] text-black hover:bg-white'} py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all`}
                >
                  {selectedNotification.link ? 'Dismiss' : 'Acknowledge'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
