import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CategoryShowcase: React.FC = () => {
  const { setCurrentView, setFilter } = useShop();

  const handleCategoryClick = (category: string, gender?: 'men' | 'women') => {
    setFilter(prev => ({
      ...prev,
      category,
      gender: gender || prev.gender,
      collection: 'all'
    }));
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    {
      title: 'Haute Slip Dresses & Gowns',
      category: 'dresses',
      gender: 'women' as const,
      tagline: 'Pure 22-momme Mulberry silk bias cut silhouettes',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      span: 'col-span-1 md:col-span-2',
    },
    {
      title: 'Milanese Overcoats & Blazers',
      category: 'jackets',
      gender: 'men' as const,
      tagline: 'Italian virgin wool with sculpted shoulder architecture',
      image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=80',
      span: 'col-span-1 md:col-span-1',
    },
    {
      title: 'Sartorial Gurkha & Pleated Trousers',
      category: 'trousers',
      gender: 'men' as const,
      tagline: 'High-waisted fluid drape with side buckle adjusters',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      span: 'col-span-1 md:col-span-1',
    },
    {
      title: 'Heritage Ethnic & Bandhgalas',
      category: 'ethnic',
      gender: 'women' as const,
      tagline: 'Regal Banarasi brocades and micro-zari embroidery',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      span: 'col-span-1 md:col-span-2',
    },
    {
      title: 'Normandy French Linen Shirts',
      category: 'shirts',
      gender: 'men' as const,
      tagline: 'Stone-washed lightweight luxury with mother-of-pearl buttons',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      span: 'col-span-1 md:col-span-1',
    },
    {
      title: 'Tuscan Leather & Gold Accents',
      category: 'accessories',
      gender: 'women' as const,
      tagline: 'Handcrafted in Florence with vegetable-tanned full grain calfskin',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      span: 'col-span-1 md:col-span-2',
    },
  ];

  return (
    <section id="explore-categories" className="py-20 bg-[#FAF9F6] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold tracking-[0.25em] text-[#997A45] uppercase">
              Curated Wardrobe Pillars
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
              Explore By Category
            </h2>
          </div>
          <button 
            onClick={() => {
              setFilter(prev => ({ ...prev, category: 'all', gender: 'all', collection: 'all' }));
              setCurrentView('shop');
            }}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-stone-900 hover:text-[#997A45] transition-colors group cursor-pointer"
          >
            View Complete Catalog
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Dual Gender Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Women's Spotlight */}
          <div 
            onClick={() => {
              setFilter(prev => ({ ...prev, gender: 'women', category: 'all', collection: 'all' }));
              setCurrentView('shop');
            }}
            className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all"
          >
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80" 
              alt="Women's Haute" 
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 text-white">
              <span className="text-xs uppercase tracking-[0.2em] text-[#E2C792] font-semibold">Atelier Series</span>
              <h3 className="font-serif text-3xl font-bold mt-1">Women's Collection</h3>
              <p className="text-sm text-stone-300 mt-1 max-w-sm">Dresses, tailored blazers, silk tops & artisanal jewels.</p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FAF9F6] group-hover:text-[#E2C792]">
                Explore Women's Wear <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Men's Spotlight */}
          <div 
            onClick={() => {
              setFilter(prev => ({ ...prev, gender: 'men', category: 'all', collection: 'all' }));
              setCurrentView('shop');
            }}
            className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all"
          >
            <img 
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80" 
              alt="Men's Sartorial" 
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 text-white">
              <span className="text-xs uppercase tracking-[0.2em] text-[#E2C792] font-semibold">Sartorial Series</span>
              <h3 className="font-serif text-3xl font-bold mt-1">Men's Collection</h3>
              <p className="text-sm text-stone-300 mt-1 max-w-sm">Cashmere coats, French linen, selvedge denim & Gurkha chinos.</p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FAF9F6] group-hover:text-[#E2C792]">
                Explore Men's Wear <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

        </div>

        {/* Detailed Category Mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => handleCategoryClick(cat.category, cat.gender)}
              className={`group relative h-64 rounded-xl overflow-hidden cursor-pointer bg-stone-900 shadow-md hover:shadow-xl transition-all ${cat.span}`}
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#E2C792] font-semibold">
                  {cat.gender}
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-bold mt-0.5">{cat.title}</h4>
                <p className="text-xs text-stone-300 mt-1 line-clamp-1">{cat.tagline}</p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
