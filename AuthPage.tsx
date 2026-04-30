import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validatePassword } from '../utils/validation';
import { UserRole } from '../types';
import { 
  Mail, Lock, User, Phone, 
  ArrowRight, Github, Chrome, Eye, EyeOff,
  CheckCircle, AlertCircle, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthPage = () => {
  const [params] = useSearchParams();
  const [isLogin, setIsLogin] = useState(params.get('mode') !== 'register');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const { login, register, loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    avatar: '',
    idDocument: '',
    role: 'buyer' as UserRole
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'idDocument') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        const validation = validatePassword(formData.password);
        if (!validation.isValid) {
          setError(validation.error);
          setIsLoading(false);
          return;
        }

        await register({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          avatar: formData.avatar,
          idDocument: formData.idDocument,
          role: formData.role
        }, formData.password);
      }
      navigate('/');
    } catch (err: any) {
      if (err.message && err.message.includes('auth/operation-not-allowed') || err.message.includes('Login provider disabled')) {
        setError('Email/Password login is currently disabled in your Firebase console. Please go to Authentication > Sign-in Method to enable it.');
      } else {
        setError(err.message || 'Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    if (!formData.email) {
      setError('Please enter your email address first');
      return;
    }
    setSuccess(`A password reset link has been sent to ${formData.email}`);
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-gray-50/50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-indigo-100/50 border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-400 mt-2 font-medium">
              {isLogin ? 'Sign in to access your dashboard' : 'Join thousands of shoppers and sellers'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center text-sm font-bold border border-red-100 animate-shake">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center text-sm font-bold border border-emerald-100">
              <CheckCircle className="h-4 w-4 mr-2" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-300">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-8 w-8 text-gray-300" />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg cursor-pointer hover:bg-indigo-700 transition-all">
                    <Camera className="h-4 w-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'avatar')} />
                  </label>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-3">Upload Profile Image</p>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'buyer'})}
                    className={`py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${formData.role === 'buyer' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'seller'})}
                    className={`py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${formData.role === 'seller' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}
                  >
                    Seller
                  </button>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 group hover:border-indigo-300 transition-all">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center">ID Document (National ID/Passport)</p>
                  <div className="flex items-center justify-center">
                    {formData.idDocument ? (
                      <div className="relative w-full h-20 bg-white rounded-xl border border-indigo-100 flex items-center justify-center overflow-hidden">
                        <img src={formData.idDocument} alt="ID Document Preview" className="w-full h-full object-cover opacity-50" />
                        <span className="absolute inset-0 flex items-center justify-center text-emerald-600 font-black text-xs uppercase">Document Attached</span>
                      </div>
                    ) : (
                      <label className="cursor-pointer bg-white text-indigo-600 px-6 py-2 rounded-xl text-xs font-black uppercase border border-indigo-100 hover:bg-indigo-50 transition-all">
                        Select File
                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'idDocument')} required />
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {!isLogin && formData.password && (
              <div className="px-1 text-[10px] space-y-1">
                <div className="flex gap-1 h-1">
                  <div className={`h-full flex-1 rounded-full ${formData.password.length >= 8 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                  <div className={`h-full flex-1 rounded-full ${(/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password)) ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                  <div className={`h-full flex-1 rounded-full ${/\d/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                  <div className={`h-full flex-1 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                </div>
                <div className="flex justify-between text-gray-400 font-bold uppercase tracking-tighter">
                  <span>Size</span>
                  <span>A/a</span>
                  <span>123</span>
                  <span>#@!</span>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <button 
                  type="button" 
                  onClick={handleResetPassword}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center group disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button 
              type="button"
              onClick={async () => {
                try {
                  setError('');
                  setIsLoading(true);
                  await loginWithGoogle();
                  navigate('/');
                } catch (err: any) {
                  if (err.message && err.message.includes('popup-closed-by-user')) {
                    setError('Login cancelled. Please finish the process in the popup.');
                  } else {
                    setError(err.message || 'Google login failed');
                  }
                } finally {
                  setIsLoading(false);
                }
              }}
              className="flex items-center justify-center space-x-3 px-4 py-4 border border-gray-100 rounded-2xl bg-white hover:bg-gray-50 transition-all shadow-sm group"
            >
              <Chrome className="h-5 w-5 text-gray-600 group-hover:scale-110 transition-transform" />
              <span className="text-gray-600 font-bold text-sm">Continue with Google</span>
            </button>
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-indigo-600 font-black hover:underline focus:outline-none"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
