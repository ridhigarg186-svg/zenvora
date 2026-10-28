import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Address } from '../types';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
  loginAsDemo: (role: 'customer' | 'admin') => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register' | 'forgot';
  setAuthModalTab: (tab: 'login' | 'register' | 'forgot') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('zenvora_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to guest or pre-logged customer for immediate seamless experience
    return null;
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('zenvora_token'));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');

  useEffect(() => {
    if (user) {
      localStorage.setItem('zenvora_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('zenvora_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('zenvora_token', token);
    } else {
      localStorage.removeItem('zenvora_token');
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to login' };
      }
      setUser(data.user);
      setToken(data.token);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error communicating with server' };
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setUser(data.user);
      setToken(data.token);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error connecting to registration service' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return false;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, ...data }),
      });
      const result = await res.json();
      if (res.ok && result.user) {
        setUser(result.user);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const addAddress = async (newAddr: Omit<Address, 'id'>) => {
    if (!user) return false;
    const addressWithId: Address = {
      ...newAddr,
      id: `addr-${Date.now()}`
    };
    const updated = [...(user.savedAddresses || []), addressWithId];
    return await updateProfile({ savedAddresses: updated });
  };

  const deleteAddress = async (id: string) => {
    if (!user) return false;
    const updated = (user.savedAddresses || []).filter(a => a.id !== id);
    return await updateProfile({ savedAddresses: updated });
  };

  const loginAsDemo = async (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      await login('admin@zenvora.com', 'admin123');
    } else {
      await login('customer@zenvora.com', 'customer123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        token,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        loginAsDemo,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
