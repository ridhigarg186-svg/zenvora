import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, CartItem, FilterState, Order } from '../types';

interface ShopContextType {
  products: Product[];
  loadingProducts: boolean;
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilter: () => void;
  currentView: 'home' | 'shop' | 'product-detail' | 'cart' | 'checkout' | 'order-confirmation' | 'wishlist' | 'account' | 'admin' | 'about' | 'contact' | 'policies';
  setCurrentView: (view: 'home' | 'shop' | 'product-detail' | 'cart' | 'checkout' | 'order-confirmation' | 'wishlist' | 'account' | 'admin' | 'about' | 'contact' | 'policies') => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  openProductDetail: (p: Product) => void;
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedCoupon: { code: string; discountPercent: number; discountAmount: number } | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;
  shippingFee: number;
  taxAmount: number;
  cartTotal: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAiOpen: boolean;
  setIsAiOpen: (open: boolean) => void;
  aiInitialPrompt: string;
  aiContextProduct: Product | null;
  openAiAssistant: (prompt?: string, contextProduct?: Product | null) => void;
  placedOrder: Order | null;
  setPlacedOrder: (order: Order | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  refreshProducts: () => Promise<void>;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

const defaultFilter: FilterState = {
  gender: 'all',
  category: 'all',
  search: '',
  sort: 'featured',
  minPrice: 0,
  maxPrice: 1000,
  collection: 'all',
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'product-detail' | 'cart' | 'checkout' | 'order-confirmation' | 'wishlist' | 'account' | 'admin' | 'about' | 'contact' | 'policies'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart state persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zenvora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zenvora_wishlist');
      return saved ? JSON.parse(saved) : ['zen-w-001', 'zen-m-001'];
    } catch {
      return ['zen-w-001', 'zen-m-001'];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent: number;
    discountAmount: number;
  } | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');
  const [aiContextProduct, setAiContextProduct] = useState<Product | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Save cart & wishlist
  useEffect(() => {
    localStorage.setItem('zenvora_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('zenvora_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products from server:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetFilter = () => {
    setFilter(defaultFilter);
  };

  const openProductDetail = (p: Product) => {
    setSelectedProduct(p);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    const itemPrice = product.discountPrice || product.price;
    const cartItemId = `${product.id}-${size}-${color}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            product,
            size,
            color,
            quantity,
            price: itemPrice,
          },
        ];
      }
    });

    showToast(`Added ${product.name} (${size}) to your shopping bag.`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return Math.round(cart.reduce((acc, item) => acc + item.price * item.quantity, 0) * 100) / 100;
  }, [cart]);

  const shippingFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    if (appliedCoupon?.code === 'FREESHIP') return 0;
    return cartSubtotal >= 100 ? 0 : 15;
  }, [cartSubtotal, appliedCoupon]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return Math.round(((cartSubtotal * appliedCoupon.discountPercent) / 100) * 100) / 100;
  }, [cartSubtotal, appliedCoupon]);

  const taxAmount = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    const taxable = Math.max(0, cartSubtotal - discountAmount);
    return Math.round(taxable * 0.07 * 100) / 100;
  }, [cartSubtotal, discountAmount]);

  const cartTotal = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    const total = cartSubtotal - discountAmount + shippingFee + taxAmount;
    return Math.round(Math.max(0, total) * 100) / 100;
  }, [cartSubtotal, discountAmount, shippingFee, taxAmount]);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal: cartSubtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Invalid code' };
      }
      setAppliedCoupon({
        code: data.code,
        discountPercent: data.discountPercent,
        discountAmount: data.discountAmount,
      });
      showToast(`Promo code ${data.code} applied: -${data.discountPercent}% off!`);
      return { success: true };
    } catch {
      return { success: false, error: 'Could not connect to discount service' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo code removed', 'info');
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Item removed from your wishlist.', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your wishlist.');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const openAiAssistant = (prompt?: string, contextProduct?: Product | null) => {
    if (prompt) setAiInitialPrompt(prompt);
    if (contextProduct !== undefined) setAiContextProduct(contextProduct);
    setIsAiOpen(true);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        loadingProducts,
        filter,
        setFilter,
        resetFilter,
        currentView,
        setCurrentView,
        selectedProduct,
        setSelectedProduct,
        openProductDetail,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        shippingFee,
        taxAmount,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setIsCartOpen,
        isAiOpen,
        setIsAiOpen,
        aiInitialPrompt,
        aiContextProduct,
        openAiAssistant,
        placedOrder,
        setPlacedOrder,
        searchQuery,
        setSearchQuery,
        refreshProducts: fetchProducts,
        toast,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};
