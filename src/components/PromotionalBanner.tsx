import React, { useState } from 'react';
import { Tag, Sparkles, Copy, Check, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const PromotionalBanner: React.FC = () => {
  const { setCurrentView, setFilter, showToast } = useShop();
  const [copied, setCopied] = useState(false);

  const promoCode = 'ZENLUXE40';

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    showToast(`Code ${promoCode} copied! Apply at checkout for 40% off.`);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-12 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white p-8 sm:p-12 border border-[#D4AF37]/30 shadow-2xl">
          {/* Subtle background luxury accent */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-amber-300 text-[11px] font-bold tracking-[0.2em] uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Limited Atelier Privilege
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                Mid-Season Concession: <span className="text-[#E2C792]">40% Off Selected Styles</span>
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 font-light max-w-xl">
                Elevate your sartorial repertoire with an exclusive 40% VIP concession on pure silk gowns, virgin wool overcoats, and Japanese selvedge denim.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-3">
              <div className="flex items-center bg-stone-900/90 border border-stone-700 rounded-xl p-2.5 w-full sm:w-auto lg:w-full justify-between">
                <div className="flex items-center gap-2 pl-2">
                  <Tag className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-mono text-sm font-bold tracking-widest text-amber-200">{promoCode}</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setFilter(prev => ({ ...prev, collection: 'bestseller', category: 'all', gender: 'all' }));
                  setCurrentView('shop');
                }}
                className="w-full sm:w-auto lg:w-full py-3 bg-[#FAF9F6] hover:bg-white text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Shop Eligible Pieces</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
