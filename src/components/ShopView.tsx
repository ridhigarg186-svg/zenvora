import React from 'react';
import { Filter, Sparkles, RotateCcw, ArrowUpDown } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const ShopView: React.FC = () => {
  const { 
    products, 
    filter, 
    setFilter, 
    resetFilter, 
    openAiAssistant,
    loadingProducts 
  } = useShop();

  const categories = [
    { id: 'all', label: 'All Styles' },
    { id: 'dresses', label: 'Dresses' },
    { id: 'jackets', label: 'Jackets & Blazers' },
    { id: 'trousers', label: 'Trousers & Chinos' },
    { id: 'shirts', label: 'Shirts' },
    { id: 't-shirts', label: 'T-Shirts' },
    { id: 'jeans', label: 'Selvedge Denim' },
    { id: 'ethnic', label: 'Ethnic & Bandhgala' },
    { id: 'tops', label: 'Tops & Knitwear' },
    { id: 'accessories', label: 'Accessories & Watches' },
  ];

  // Client-side filtering on catalog
  let filtered = [...products];

  if (filter.gender !== 'all') {
    filtered = filtered.filter(p => p.gender === filter.gender || p.gender === 'unisex');
  }

  if (filter.category !== 'all') {
    filtered = filtered.filter(p => p.category === filter.category);
  }

  if (filter.collection && filter.collection !== 'all') {
    if (filter.collection === 'trending') filtered = filtered.filter(p => p.isTrending);
    if (filter.collection === 'new') filtered = filtered.filter(p => p.isNewArrival);
    if (filter.collection === 'bestseller') filtered = filtered.filter(p => p.isBestSeller);
    if (filter.collection === 'seasonal') filtered = filtered.filter(p => p.isSeasonal);
  }

  if (filter.search) {
    const s = filter.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(s) ||
      p.tagline.toLowerCase().includes(s) ||
      p.description.toLowerCase().includes(s) ||
      p.tags.some(t => t.toLowerCase().includes(s))
    );
  }

  // Sorting
  if (filter.sort === 'price-low') {
    filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (filter.sort === 'price-high') {
    filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (filter.sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (filter.sort === 'newest') {
    filtered.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Editorial Collection Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#997A45]">
            Atelier Curated Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 capitalize">
            {filter.gender === 'all' ? 'The Complete Wardrobe' : `${filter.gender}'s Collection`}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-light">
            Silhouettes constructed with uncompromising purity of line, grade-6A Mulberry silk, and Italian virgin wool.
          </p>
        </div>

        {/* Gender Selection Bar */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1 bg-white rounded-xl border border-stone-200 shadow-sm text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setFilter(prev => ({ ...prev, gender: 'all' }))}
              className={`px-5 py-2 rounded-lg transition-all ${filter.gender === 'all' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:text-black'}`}
            >
              All Styles
            </button>
            <button
              onClick={() => setFilter(prev => ({ ...prev, gender: 'women' }))}
              className={`px-5 py-2 rounded-lg transition-all ${filter.gender === 'women' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:text-black'}`}
            >
              Women's Haute
            </button>
            <button
              onClick={() => setFilter(prev => ({ ...prev, gender: 'men' }))}
              className={`px-5 py-2 rounded-lg transition-all ${filter.gender === 'men' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:text-black'}`}
            >
              Men's Sartorial
            </button>
          </div>
        </div>

        {/* Category Carousel / Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar justify-start md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(prev => ({ ...prev, category: cat.id }))}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${filter.category === cat.id ? 'bg-stone-900 text-amber-300 border-stone-900 shadow-sm font-semibold' : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Secondary Filter & Sort Control Bar */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Collection Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setFilter(prev => ({ ...prev, collection: 'all' }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider ${filter.collection === 'all' ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:text-stone-800'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter(prev => ({ ...prev, collection: 'trending' }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider ${filter.collection === 'trending' ? 'bg-amber-100 text-amber-900' : 'text-stone-500 hover:text-stone-800'}`}
            >
              Trending
            </button>
            <button
              onClick={() => setFilter(prev => ({ ...prev, collection: 'new' }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider ${filter.collection === 'new' ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:text-stone-800'}`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setFilter(prev => ({ ...prev, collection: 'bestseller' }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider ${filter.collection === 'bestseller' ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:text-stone-800'}`}
            >
              Bestsellers
            </button>
          </div>

          {/* Right Sorting & Count */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <span className="text-xs text-stone-500 font-medium">
              Showing <strong className="text-stone-900">{filtered.length}</strong> styles
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={filter.sort}
                onChange={(e: any) => setFilter(prev => ({ ...prev, sort: e.target.value }))}
                className="text-xs bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium focus:outline-none"
              >
                <option value="featured">Featured Order</option>
                <option value="newest">Newest Drops</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Client Rating</option>
              </select>
            </div>
          </div>

        </div>

        {/* Product Grid */}
        {loadingProducts ? (
          <div className="py-24 text-center">
            <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold animate-pulse">
              Curating Zenvora Atelier Catalog...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-4 max-w-md mx-auto">
            <p className="font-serif text-lg font-bold text-stone-900">No matching pieces found</p>
            <p className="text-xs text-stone-500">
              Try adjusting your category or collection filters, or ask our AI Stylist to find matching items.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={resetFilter}
                className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
              </button>
              <button
                onClick={() => openAiAssistant('Find me an outfit that matches my taste')}
                className="px-4 py-2 bg-stone-900 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Ask AI Stylist
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
