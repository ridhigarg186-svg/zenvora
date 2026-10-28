import React from 'react';
import { ArrowLeft, Sparkles, Shield, HeartHandshake, Compass } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AboutView: React.FC = () => {
  const { setCurrentView, openAiAssistant } = useShop();

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <button
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-black cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Boutique
        </button>

        {/* Hero Editorial */}
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#997A45] font-semibold">
            Our Atelier Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 leading-tight">
            Fashion Meets <span className="italic text-[#997A45]">Confidence.</span>
          </h1>
          <p className="text-sm sm:text-base text-stone-600 font-light max-w-2xl mx-auto leading-relaxed">
            Zenvora was founded on a singular conviction: when garments are crafted with impeccable proportions and pure natural materials, they empower the wearer with unwavering poise.
          </p>
        </div>

        {/* Editorial Photo Banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[16/9] bg-stone-900">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
            alt="Zenvora Atelier"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-8 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#E2C792] font-semibold">Bespoke Workshop</p>
              <h3 className="font-serif text-2xl font-bold">Florence • Normandy • Okayama</h3>
            </div>
          </div>
        </div>

        {/* Brand Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Purity of Material</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We exclusively source Grade 6A 22-momme Mulberry silk, Australian superfine Merino wool, and vintage shuttle-loom Japanese selvedge denim.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">AI-Guided Styling</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We combine traditional high-fashion tailoring with our proprietary AI Stylist to provide personalized wardrobe curation anytime.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Quiet Luxury</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              No loud logos or disposable trends. Timeless garments designed to be worn across decades with enduring confidence.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-stone-900 text-white rounded-2xl p-8 text-center space-y-4">
          <h3 className="font-serif text-2xl font-bold">Discover Your Signature Silhouette</h3>
          <p className="text-xs text-stone-300 max-w-md mx-auto">
            Consult our AI Stylist or browse our curated Autumn/Winter 2026 Collection today.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCurrentView('shop')}
              className="px-6 py-3 bg-white text-stone-900 text-xs uppercase font-bold tracking-wider rounded-lg hover:bg-stone-100 transition-colors"
            >
              Explore Collection
            </button>
            <button
              onClick={() => openAiAssistant('Tell me about Zenvora and what outfits best suit me')}
              className="px-6 py-3 bg-stone-800 text-amber-300 border border-amber-400/40 text-xs uppercase font-bold tracking-wider rounded-lg hover:bg-stone-700 transition-colors"
            >
              Consult AI Stylist
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
