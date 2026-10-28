import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const FeaturedCollections: React.FC = () => {
  const { products, setCurrentView, setFilter } = useShop();
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'bestseller' | 'seasonal'>('trending');

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'trending':
        return products.filter(p => p.isTrending);
      case 'new':
        return products.filter(p => p.isNewArrival);
      case 'bestseller':
        return products.filter(p => p.isBestSeller);
      case 'seasonal':
        return products.filter(p => p.isSeasonal || p.category === 'ethnic');
      default:
        return products;
    }
  };

  const currentList = getFilteredProducts().slice(0, 4);

  const handleViewAll = () => {
    setFilter(prev => ({ ...prev, collection: activeTab, category: 'all', gender: 'all' }));
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#997A45]">
              Curated Highlights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
              Seasonal Focus & Bestsellers
            </h2>
          </div>

          {/* Interactive Collection Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'trending' ? 'bg-stone-900 text-amber-300 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Trending Pieces
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'new' ? 'bg-stone-900 text-amber-300 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab('bestseller')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'bestseller' ? 'bg-stone-900 text-amber-300 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Best Sellers
            </button>
            <button
              onClick={() => setActiveTab('seasonal')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'seasonal' ? 'bg-stone-900 text-amber-300 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Gala & Seasonal
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA to view all in category */}
        <div className="text-center pt-6">
          <button
            onClick={handleViewAll}
            className="px-8 py-3.5 bg-stone-900 hover:bg-black text-white text-xs uppercase tracking-[0.18em] font-bold rounded-lg shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 group cursor-pointer"
          >
            <span>View All {activeTab.toUpperCase()} Styles</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
