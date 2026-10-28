import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Mail, 
  Instagram, 
  Twitter, 
  CheckCircle,
  Lock
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

export const Footer: React.FC = () => {
  const { setCurrentView, setFilter, openAiAssistant, showToast } = useShop();
  const { isAdmin } = useAuth();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    showToast('Welcome to the Zenvora Circle. Code ZENLUXE40 is now active for you!');
  };

  const handleNav = (view: any, filterUpdate?: any) => {
    if (filterUpdate) {
      setFilter(prev => ({ ...prev, ...filterUpdate }));
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Newsletter Subscription Banner */}
        <div className="bg-stone-900 rounded-3xl p-8 sm:p-12 border border-stone-800 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-md text-center lg:text-left space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E2C792]">
              The Zenvora Circle
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Privileged Access & VIP Drops
            </h3>
            <p className="text-xs text-stone-400 font-light">
              Subscribe to receive private preview invitations, invitations to seasonal drops, and an immediate 40% VIP concession code.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            {newsletterSubscribed ? (
              <div className="p-4 bg-stone-800/80 rounded-xl border border-stone-700 flex items-center gap-3 text-xs text-amber-200">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">Invitation Confirmed.</p>
                  <p className="text-[11px] text-stone-300">Enjoy 40% off using code <strong>ZENLUXE40</strong> at checkout.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="px-4 py-3 bg-stone-950 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 sm:w-72"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#FAF9F6] hover:bg-white text-stone-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow"
                >
                  Join Circle <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Dedicated Admin Dashboard Featured Section in Footer */}
        <div className="bg-stone-900/90 rounded-2xl p-6 sm:p-7 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-[#D4AF37] flex-shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h4 className="font-serif text-lg font-bold text-white">
                  Zenvora Admin Dashboard
                </h4>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-mono font-semibold">
                  SECURE PORTAL
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-1 max-w-xl font-light">
                Secure management console for authorized administrators to oversee live sales KPIs, catalog products, real-time order dispatch, discount codes, and client feedback.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleNav('admin')}
            className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 via-[#D4AF37] to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-[0.16em] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 transform hover:-translate-y-0.5"
          >
            <ShieldCheck className="w-4 h-4 text-stone-950" />
            <span>Open Admin Dashboard</span>
          </button>
        </div>

        {/* 5-Column Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          
          {/* Brand Info (Col 2 on mobile) */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-bold tracking-[0.25em] text-white">ZENVORA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm font-light">
              Fashion Meets Confidence. High-fashion atelier clothing designed for men and women. Uncompromising luxury, natural materials, and personal styling.
            </p>
            <div className="pt-2 text-[11px] text-stone-400 space-y-1">
              <p>Atelier: 740 Fifth Avenue, Floor 14, New York, NY</p>
              <p>Email: concierge@zenvora.com</p>
              <p>Hotline: +1 (800) 555-ZENVORA</p>
            </div>
          </div>

          {/* Men's Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm tracking-wider uppercase">Men's Edit</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button onClick={() => handleNav('shop', { gender: 'men', category: 'jackets' })} className="hover:text-white transition-colors">
                  Wool & Cashmere Overcoats
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop', { gender: 'men', category: 'shirts' })} className="hover:text-white transition-colors">
                  French Linen Shirts
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop', { gender: 'men', category: 'trousers' })} className="hover:text-white transition-colors">
                  Gurkha Pleated Chinos
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop', { gender: 'men', category: 'jeans' })} className="hover:text-white transition-colors">
                  Japanese Selvedge Denim
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop', { gender: 'men', category: 'ethnic' })} className="hover:text-white transition-colors">
                  Bandhgala Sherwanis
                </button>
              </li>
            </ul>
          </div>

          {/* Women's Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm tracking-wider uppercase">Women's Edit</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button onClick={() => handleNav('shop', { gender: 'women', category: 'dresses' })} className="hover:text-white transition-colors">
                  Mulberry Silk Gowns
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop', { gender: 'women', category: 'jackets' })} className="hover:text-white transition-colors">
                  Structured Virgin Wool Blazers
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop', { gender: 'women', category: 'trousers' })} className="hover:text-white transition-colors">
                  High-Waist Palazzo Trousers
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop', { gender: 'women', category: 'ethnic' })} className="hover:text-white transition-colors">
                  Embroidered Anarkalis
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop', { gender: 'women', category: 'accessories' })} className="hover:text-white transition-colors">
                  Tuscan Leather Crossbodies
                </button>
              </li>
            </ul>
          </div>

          {/* Atelier & Admin Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm tracking-wider uppercase">Administration & Care</h4>
            <ul className="space-y-2 text-stone-400">
              <li className="pt-0.5 pb-1">
                <button 
                  onClick={() => handleNav('admin')} 
                  className="text-amber-300 font-semibold hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Admin Dashboard</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors">
                  About Zenvora Heritage
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors">
                  Concierge & Inquiries
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('account')} className="hover:text-white transition-colors">
                  Track Delivery Status
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors">
                  Complimentary 30-Day Returns
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors">
                  Privacy Policy & Terms
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Highlighted Footer Actions: Admin Dashboard Link & AI Style Assistant Button (Requirement 9 & 12) */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex flex-wrap items-center gap-6">
            {/* AI Style Assistant Button (Requirement 12) */}
            <button
              onClick={() => openAiAssistant('I would like to explore wardrobe combinations recommended by the AI Stylist.')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-300 border border-[#D4AF37]/50 font-semibold tracking-wider uppercase text-[11px] transition-all cursor-pointer shadow-sm group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
              AI Style Assistant
            </button>

            {/* Admin Dashboard Link (Requirement 9 & 12) */}
            <button
              onClick={() => handleNav('admin')}
              className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors font-semibold uppercase tracking-wider text-[11px] cursor-pointer group bg-stone-900/80 px-3 py-1.5 rounded-full border border-stone-700 hover:border-amber-400"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] transition-colors" />
              <span>Admin Dashboard</span>
              {isAdmin && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
            </button>
          </div>

          {/* Copyright Text (Requirement 12) */}
          <div className="text-stone-500 text-[11px] text-center sm:text-right font-light">
            © 2026 Zenvora. All rights reserved. Fashion Meets Confidence.
          </div>

        </div>

      </div>
    </footer>
  );
};
