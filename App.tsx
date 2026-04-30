/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';
import { Chat } from './pages/Chat';
import { Notifications } from './pages/Notifications';
import { About } from './pages/About';
import { Sellers } from './pages/Sellers';
import { Policy } from './pages/Policy';
import { NewDrops } from './pages/NewDrops';
import { Contact } from './pages/Contact';
import { AdminDashboard } from './pages/AdminDashboard';
import { SellerDashboard } from './pages/SellerDashboard';
import { AuthPage } from './pages/AuthPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';

function PrivateRoute({ children, role }: { children: React.ReactNode, role?: 'buyer' | 'seller' | 'admin' }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  if (role && user.role !== role && user.role !== 'admin') return <Navigate to="/" />;
  
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <CurrencyProvider>
              <NotificationProvider>
                <ChatProvider>
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route path="search" element={<Search />} />
                      <Route path="product/:id" element={<ProductDetails />} />
                      <Route path="cart" element={<Cart />} />
                      <Route path="auth" element={<AuthPage />} />
                      
                      {/* Protected Routes */}
                      <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                      <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                      <Route path="orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
                      <Route path="chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
                      <Route path="notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                      <Route path="about" element={<About />} />
                      <Route path="sellers" element={<Sellers />} />
                      <Route path="policy" element={<Policy />} />
                      <Route path="new-drops" element={<NewDrops />} />
                      <Route path="contact" element={<Contact />} />
                      
                      {/* Admin/Seller Routes */}
                      <Route path="admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
                      <Route path="seller" element={<PrivateRoute role="seller"><SellerDashboard /></PrivateRoute>} />
                    </Route>
                  </Routes>
                </ChatProvider>
              </NotificationProvider>
            </CurrencyProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
