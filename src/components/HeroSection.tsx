import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  RefreshCw, 
  Truck, 
  ChevronUp, 
  ChevronDown, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Flame,
  Layers
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const HeroSection: React.FC = () => {
  const { setCurrentView, setFilter, openAiAssistant } = useShop();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const heroSlides = [
    {
      id: 1,
      tag: 'Autumn / Winter 2026 Collection',
      headlinePrefix: 'Fashion Meets',
      headlineHighlight: 'Confidence.',
      description: 'Uncompromising sartorial precision and timeless silhouettes for men and women. Crafted from 22-momme Mulberry silk, pure Virgin wool, and bespoke tailoring.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
      capsuleTitle: 'The Silk & Wool Dialogues',
      bestsellerTitle: 'Milanese Overcoat',
      bestsellerPrice: '$360',
      bestsellerOriginal: '$450',
      bestsellerImg: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      tag: 'Atelier Sartorial Men & Women',
      headlinePrefix: 'Elegance In Every',
      headlineHighlight: 'Silhouette.',
      description: 'Sculpted peak-lapel blazers, pleated Italian Gurkha chinos, and pure French linen designed to command respect in boardrooms and evening celebrations.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      capsuleTitle: 'Architectural Tailoring Series',
      bestsellerTitle: 'Sartorial Wool Blazer',
      bestsellerPrice: '$275',
      bestsellerOriginal: '$320',
      bestsellerImg: 'https://images.unsplash.com/photo-1548624149-f9b1859aa9d0?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      tag: 'Grand Gala & Heritage Festive',
      headlinePrefix: 'Royal Heritage &',
      headlineHighlight: 'Modern Splendor.',
      description: 'Handcrafted Banarasi brocades, pure raw silk bandhgalas, and fluid 32-kali Anarkali ensembles woven with authentic micro-zari craftsmanship.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      capsuleTitle: 'Festive Banarasi & Zari Edition',
      bestsellerTitle: 'Bandhgala Sherwani',
      bestsellerPrice: '$395',
      bestsellerOriginal: '$480',
      bestsellerImg: 'https://images.unsplash.com/photo-1583391733975-d85c88b20921?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const currentSlide = heroSlides[currentSlideIndex];

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const handleExplore = (gender: 'men' | 'women') => {
    setFilter(prev => ({ ...prev, gender, category: 'all', collection: 'all' }));
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCategories = () => {
    const el = document.getElementById('explore-categories');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: 600, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#121212] text-[#FAF9F6]">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-stone-700/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Action Button Bar on First Slide */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between z-20 relative">
        <button
          onClick={() => {
            setFilter(prev => ({ ...prev, collection: 'trending', category: 'all', gender: 'all' }));
            setCurrentView('shop');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer group"
        >
          <ArrowUpCircle className="w-4 h-4 text-[#D4AF37] group-hover:-translate-y-0.5 transition-transform" />
          <span>Top Featured Styles & Drops</span>
        </button>

        {/* Slide Carousel Top Navigation Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevSlide}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            title="Previous / Top Slide"
          >
            <ChevronUp className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Top Slide</span>
          </button>
          <button
            onClick={handleNextSlide}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            title="Next / Bottom Slide"
          >
            <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Bottom Slide</span>
          </button>
          <span className="text-[11px] text-stone-500 font-mono ml-1">
            0{currentSlideIndex + 1} / 0{heroSlides.length}
          </span>
        </div>
      </div>

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 z-10 text-center lg:text-left transition-all duration-500">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-medium tracking-[0.2em] uppercase">
              <Sparkles className="w-3.5 h-3.5" /> {currentSlide.tag}
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
              {currentSlide.headlinePrefix} <br />
              <span className="italic font-normal text-[#E2C792]">{currentSlide.headlineHighlight}</span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              {currentSlide.description}
            </p>

            {/* CTA Buttons in Middle */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => handleExplore('women')}
                className="px-6 py-3.5 bg-[#FAF9F6] text-stone-900 hover:bg-white text-xs uppercase font-bold tracking-[0.15em] rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group cursor-pointer"
              >
                Shop Women's Haute
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleExplore('men')}
                className="px-6 py-3.5 bg-stone-900/90 text-[#FAF9F6] hover:bg-stone-800 text-xs uppercase font-bold tracking-[0.15em] rounded-lg border border-stone-700 hover:border-stone-500 transition-all flex items-center gap-2 cursor-pointer"
              >
                Shop Men's Sartorial
              </button>

              <button
                onClick={() => openAiAssistant('Recommend an outfit based on my personal style preferences')}
                className="px-5 py-3.5 bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 hover:from-[#D4AF37]/30 hover:to-[#D4AF37]/20 text-[#E2C792] border border-[#D4AF37]/40 text-xs uppercase font-bold tracking-[0.15em] rounded-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" /> AI Stylist
              </button>
            </div>

            {/* Social Proof / Stats */}
            <div className="pt-8 border-t border-stone-800 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <p className="font-serif text-2xl font-bold text-white">100%</p>
                <p className="text-[11px] text-stone-400 uppercase tracking-wider">Natural Fibers</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-white">4.9 / 5</p>
                <p className="text-[11px] text-stone-400 uppercase tracking-wider">Client Rating</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[#E2C792]">24/7</p>
                <p className="text-[11px] text-stone-400 uppercase tracking-wider">AI Concierge</p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Collage with Slide Indicator */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main large image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-800 aspect-[4/5] bg-stone-900">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.capsuleTitle}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#E2C792] font-semibold">Featured Capsule</span>
                    <h3 className="font-serif text-xl font-bold text-white">{currentSlide.capsuleTitle}</h3>
                  </div>
                </div>
              </div>

              {/* Overlapping secondary floating card */}
              <div className="hidden sm:block absolute -bottom-6 -left-8 w-48 rounded-xl overflow-hidden shadow-2xl border border-stone-700 bg-stone-900/90 backdrop-blur-md p-2 transform hover:-translate-y-1 transition-transform">
                <img
                  src={currentSlide.bestsellerImg}
                  alt={currentSlide.bestsellerTitle}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <div className="pt-2 px-1">
                  <p className="text-[10px] text-[#E2C792] uppercase tracking-wider font-semibold">Bestseller</p>
                  <p className="text-xs font-semibold text-white truncate">{currentSlide.bestsellerTitle}</p>
                  <p className="text-[11px] text-stone-300 font-bold">{currentSlide.bestsellerPrice} <span className="line-through text-stone-500 font-normal">{currentSlide.bestsellerOriginal}</span></p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Button on First Slide */}
        <div className="pt-10 flex flex-col items-center justify-center text-center">
          <button
            onClick={scrollToCategories}
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-700 hover:border-[#D4AF37]/50 text-xs font-bold uppercase tracking-[0.16em] transition-all shadow-xl cursor-pointer"
          >
            <span>Explore Bottom Wardrobe Pillars</span>
            <ArrowDownCircle className="w-4 h-4 text-[#D4AF37] group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>

      {/* Value Proposition Ribbon */}
      <div className="border-t border-stone-800 bg-stone-950/70 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2.5 rounded-lg bg-stone-900 text-[#D4AF37]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-white">Complimentary Delivery</h4>
                <p className="text-[12px] text-stone-400">On all orders above $100 worldwide</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2.5 rounded-lg bg-stone-900 text-[#D4AF37]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-white">Artisanal Quality</h4>
                <p className="text-[12px] text-stone-400">Pure Grade 6A Silk & Virgin Merino Wool</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2.5 rounded-lg bg-stone-900 text-[#D4AF37]">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-white">30-Day Effortless Returns</h4>
                <p className="text-[12px] text-stone-400">Pre-paid labels & luxury pickup service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
