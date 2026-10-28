import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalTab, 
    setAuthModalTab, 
    login, 
    register, 
    loginAsDemo 
  } = useAuth();

  const { showToast } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (authModalTab === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Authentication failed');
      } else {
        showToast('Welcome back to Zenvora.');
      }
    } else if (authModalTab === 'register') {
      const res = await register(name, email, password, phone);
      if (!res.success) {
        setError(res.error || 'Registration failed');
      } else {
        showToast('Your Zenvora profile has been created.');
      }
    } else if (authModalTab === 'forgot') {
      setForgotSent(true);
      showToast('Password reset link dispatched to your email.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-6 relative">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-stone-400 hover:text-black p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <span className="font-serif text-2xl font-bold tracking-[0.25em] text-stone-900">ZENVORA</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Fashion Meets Confidence</p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => { setAuthModalTab('login'); setError(''); }}
            className={`flex-1 pb-2.5 border-b-2 text-center transition-all ${authModalTab === 'login' ? 'border-stone-900 text-stone-900 font-bold' : 'border-transparent text-stone-400 hover:text-stone-700'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setAuthModalTab('register'); setError(''); }}
            className={`flex-1 pb-2.5 border-b-2 text-center transition-all ${authModalTab === 'register' ? 'border-stone-900 text-stone-900 font-bold' : 'border-transparent text-stone-400 hover:text-stone-700'}`}
          >
            Create Profile
          </button>
        </div>

        {/* Form Body */}
        {authModalTab === 'forgot' ? (
          <div className="space-y-4 text-xs">
            <p className="text-stone-600">
              Enter your registered email address and our concierge will transmit a secure password-reset link.
            </p>
            {forgotSent ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium">
                Reset link sent to <strong>{email}</strong>. Check your inbox or spam folder.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-stone-900 text-white font-bold uppercase tracking-wider rounded-lg"
                >
                  Send Reset Link
                </button>
              </form>
            )}
            <button
              onClick={() => { setAuthModalTab('login'); setForgotSent(false); }}
              className="text-stone-500 hover:text-black text-center block w-full pt-1"
            >
              ← Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {authModalTab === 'register' && (
              <>
                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Julian Vance"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0144"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block font-semibold uppercase text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@zenvora.com"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold uppercase text-stone-700">Password</label>
                {authModalTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthModalTab('forgot')}
                    className="text-[11px] text-[#997A45] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>

            {error && <p className="text-red-600 text-[11px] font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-stone-900 hover:bg-black text-white font-bold uppercase tracking-[0.15em] rounded-lg shadow-md transition-colors cursor-pointer"
            >
              {loading ? 'Processing...' : (authModalTab === 'login' ? 'Sign In to Account' : 'Create Bespoke Profile')}
            </button>
          </form>
        )}

        {/* Demo One-Click Sign-Ins for Reviewers */}
        <div className="pt-2 border-t border-stone-200 text-center space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Fast Review Quick Logins</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => loginAsDemo('customer')}
              className="py-2 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[11px] font-semibold transition-colors truncate"
            >
              Demo Client (Julian)
            </button>
            <button
              onClick={() => loginAsDemo('admin')}
              className="py-2 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-semibold transition-colors truncate flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Demo Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
