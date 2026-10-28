import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User as UserIcon, 
  Search, 
  Sparkles, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut, 
  Package, 
  MapPin,
  ChevronDown
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { 
    cartCount, 
    setIsCartOpen, 
    wishlist, 
    setCurrentView, 
    currentView, 
    setFilter, 
    openAiAssistant,
    products,
    openProductDetail
  } = useShop();

  const { user, isAdmin, logout, setIsAuthModalOpen, setAuthModalTab } = useAuth();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const searchResults = searchInput.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.category.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.gender.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchInput.toLowerCase()))
      ).slice(0, 4)
    : [];

  const handleNavClick = (view: any, filterUpdate?: any) => {
    if (filterUpdate) {
      setFilter(prev => ({ ...prev, ...filterUpdate }));
    }
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#141414] text-[#FAF9F6] text-[11px] uppercase tracking-[0.2em] py-2 px-4 text-center font-medium flex items-center justify-center gap-3">
        <span>Complimentary Worldwide Express Shipping on Orders Over $100</span>
        <span className="hidden md:inline text-[#D4AF37]">•</span>
        <span className="hidden md:inline text-amber-200">Use code <strong className="text-white underline">ZENLUXE40</strong> for 40% Off</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-stone-800 hover:text-black focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-initial flex items-center justify-center lg:justify-start">
            <button 
              onClick={() => handleNavClick('home')}
              className="group text-left focus:outline-none"
            >
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-stone-900 group-hover:text-[#997A45] transition-colors">
                  ZENVORA
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              </div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-stone-700 font-medium -mt-1 hidden sm:block">
                Fashion Meets Confidence
              </p>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-medium tracking-[0.15em] uppercase text-stone-700">
            <button 
              onClick={() => handleNavClick('home')}
              className={`hover:text-black transition-colors ${currentView === 'home' ? 'text-black font-semibold border-b border-black pb-0.5' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('shop', { gender: 'men', category: 'all' })}
              className={`hover:text-black transition-colors`}
            >
              Men
            </button>
            <button 
              onClick={() => handleNavClick('shop', { gender: 'women', category: 'all' })}
              className={`hover:text-black transition-colors`}
            >
              Women
            </button>
            <button 
              onClick={() => handleNavClick('shop', { collection: 'new' })}
              className={`hover:text-black transition-colors`}
            >
              New Arrivals
            </button>
            <button 
              onClick={() => handleNavClick('shop', { collection: 'trending' })}
              className={`hover:text-black transition-colors`}
            >
              Trending
            </button>
            <button 
              onClick={() => handleNavClick('shop', { collection: 'bestseller' })}
              className={`hover:text-black transition-colors text-amber-800`}
            >
              Offers
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              className={`hover:text-black transition-colors`}
            >
              About Us
            </button>
            <button 
              onClick={() => handleNavClick('contact')}
              className={`hover:text-black transition-colors`}
            >
              Contact Us
            </button>
          </nav>

          {/* Right Action Icons & AI Stylist Entry Point 1 */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Top AI Stylist Button (Requirement 6) */}
            <button
              onClick={() => openAiAssistant('Recommend a stylish outfit for this season')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-stone-900 to-stone-800 text-amber-300 hover:text-white hover:from-black hover:to-stone-900 text-xs font-medium tracking-wide shadow-sm hover:shadow transition-all border border-[#D4AF37]/40 group"
              title="Consult AI Fashion Stylist"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Ask AI Stylist</span>
            </button>

            {/* Search Trigger */}
            <div className="relative">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-stone-700 hover:text-black transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Instant Search Dropdown */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-stone-200 p-4 z-50">
                  <div className="relative">
                    <input 
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search silk gown, overcoat, chinos..."
                      autoFocus
                      className="w-full pl-9 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <Search className="w-4 h-4 text-stone-700 absolute left-3 top-3" />
                    {searchInput && (
                      <button 
                        onClick={() => setSearchInput('')}
                        className="absolute right-3 top-2.5 text-xs text-stone-700 hover:text-black"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {searchResults.length > 0 && (
                    <div className="mt-3 divide-y divide-stone-100 max-h-72 overflow-y-auto">
                      <p className="text-[10px] uppercase tracking-wider text-stone-700 pb-1">Products Found</p>
                      {searchResults.map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => {
                            openProductDetail(item);
                            setIsSearchOpen(false);
                            setSearchInput('');
                          }}
                          className="flex items-center gap-3 py-2 cursor-pointer hover:bg-stone-50 rounded-lg px-2 transition-colors"
                        >
                          <img src={item.images[0]} alt={item.name} className="w-10 h-12 object-cover rounded bg-stone-100" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-stone-900 truncate">{item.name}</p>
                            <p className="text-[11px] text-stone-700 capitalize">{item.gender} • {item.category}</p>
                          </div>
                          <span className="text-xs font-semibold text-stone-900">${item.discountPrice || item.price}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchInput && searchResults.length === 0 && (
                    <div className="py-4 text-center text-xs text-stone-700">
                      No matching products. Try searching for "silk", "wool", or "blazer".
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-stone-100 flex justify-between items-center text-[11px] text-stone-700">
                    <span>Press enter to view full results</span>
                    <button 
                      onClick={() => {
                        handleNavClick('shop', { search: searchInput });
                        setIsSearchOpen(false);
                      }}
                      className="text-stone-900 font-semibold underline"
                    >
                      Browse All
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button 
              onClick={() => handleNavClick('wishlist')}
              className="relative p-2 text-stone-700 hover:text-black transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#1A1A1A] text-[#FAF9F6] text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-700 hover:text-black transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-stone-900 text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center gap-1 p-2 text-stone-700 hover:text-black transition-colors focus:outline-none"
                aria-label="Account menu"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover border border-stone-300" />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
                <ChevronDown className="w-3 h-3 text-stone-700" />
              </button>

              {isAccountMenuOpen && (
                <div 
                  className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-stone-200 py-2 z-50 divide-y divide-stone-100"
                  onMouseLeave={() => setIsAccountMenuOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-3">
                        <p className="text-xs font-semibold text-stone-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-stone-700 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                            <ShieldCheck className="w-3 h-3" /> Administrator
                          </span>
                        )}
                      </div>
                      <div className="py-1 text-xs">
                        <button 
                          onClick={() => { handleNavClick('account'); setIsAccountMenuOpen(false); }}
                          className="w-full px-4 py-2 text-left hover:bg-stone-50 flex items-center gap-2 text-stone-700"
                        >
                          <UserIcon className="w-4 h-4" /> My Profile
                        </button>
                        <button 
                          onClick={() => { handleNavClick('account'); setIsAccountMenuOpen(false); }}
                          className="w-full px-4 py-2 text-left hover:bg-stone-50 flex items-center gap-2 text-stone-700"
                        >
                          <Package className="w-4 h-4" /> Order History
                        </button>
                        <button 
                          onClick={() => { handleNavClick('account'); setIsAccountMenuOpen(false); }}
                          className="w-full px-4 py-2 text-left hover:bg-stone-50 flex items-center gap-2 text-stone-700"
                        >
                          <MapPin className="w-4 h-4" /> Saved Addresses
                        </button>
                        {isAdmin && (
                          <button 
                            onClick={() => { handleNavClick('admin'); setIsAccountMenuOpen(false); }}
                            className="w-full px-4 py-2 text-left hover:bg-amber-50 text-amber-900 font-semibold flex items-center gap-2"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-700" /> Admin Dashboard
                          </button>
                        )}
                      </div>
                      <div className="py-1 text-xs">
                        <button 
                          onClick={() => { logout(); setIsAccountMenuOpen(false); }}
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 text-center space-y-2">
                      <p className="text-xs text-stone-600">Access orders, bespoke wishlists & exclusive perks.</p>
                      <button 
                        onClick={() => {
                          setAuthModalTab('login');
                          setIsAuthModalOpen(true);
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-black transition-colors"
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={() => {
                          setAuthModalTab('register');
                          setIsAuthModalOpen(true);
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full py-1.5 text-stone-700 border border-stone-200 rounded-lg text-xs font-medium hover:bg-stone-50 transition-colors"
                      >
                        Create Account
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-[#FAF9F6] px-4 pt-4 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium tracking-wider uppercase text-stone-800">
            <button 
              onClick={() => handleNavClick('home')}
              className="py-2 text-left border-b border-stone-100"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('shop', { gender: 'men', category: 'all' })}
              className="py-2 text-left border-b border-stone-100"
            >
              Men's Sartorial
            </button>
            <button 
              onClick={() => handleNavClick('shop', { gender: 'women', category: 'all' })}
              className="py-2 text-left border-b border-stone-100"
            >
              Women's Haute
            </button>
            <button 
              onClick={() => handleNavClick('shop', { collection: 'new' })}
              className="py-2 text-left border-b border-stone-100"
            >
              New Arrivals
            </button>
            <button 
              onClick={() => handleNavClick('shop', { collection: 'trending' })}
              className="py-2 text-left border-b border-stone-100"
            >
              Trending Lookbook
            </button>
            <button 
              onClick={() => handleNavClick('shop', { collection: 'bestseller' })}
              className="py-2 text-left border-b border-stone-100 text-amber-800"
            >
              Seasonal Offers
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              className="py-2 text-left border-b border-stone-100"
            >
              About Zenvora
            </button>
            <button 
              onClick={() => handleNavClick('contact')}
              className="py-2 text-left border-b border-stone-100"
            >
              Concierge & Contact
            </button>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => {
                openAiAssistant('Help me discover the ideal outfit for my upcoming event');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-lg bg-stone-900 text-amber-300 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 border border-[#D4AF37]/50"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Ask AI Fashion Stylist
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
