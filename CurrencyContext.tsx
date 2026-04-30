import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency } from '../types';
import { useAuth } from './AuthContext';

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1, name: 'US Dollar' },
  { code: 'GHS', symbol: '₵', rate: 12.5, name: 'Ghana Cedi' },
  { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
  { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound' },
  { code: 'NGN', symbol: '₦', rate: 1450, name: 'Nigerian Naira' },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: string) => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateProfile } = useAuth();
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(SUPPORTED_CURRENCIES[0]);

  useEffect(() => {
    const savedCurrency = localStorage.getItem('mm_currency');
    if (user?.currency) {
      const found = SUPPORTED_CURRENCIES.find(c => c.code === user.currency);
      if (found) {
         setCurrentCurrency(found);
         return;
      }
    }
    
    if (savedCurrency) {
      const found = SUPPORTED_CURRENCIES.find(c => c.code === savedCurrency);
      if (found) setCurrentCurrency(found);
    }
  }, [user]);

  const setCurrency = (code: string) => {
    const found = SUPPORTED_CURRENCIES.find(c => c.code === code);
    if (found) {
      setCurrentCurrency(found);
      localStorage.setItem('mm_currency', code);
      if (user) {
        updateProfile({ currency: code });
      }
    }
  };

  const convertPrice = (price: number) => {
    return price * currentCurrency.rate;
  };

  const formatPrice = (price: number) => {
    const converted = convertPrice(price);
    return `${currentCurrency.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency: currentCurrency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
