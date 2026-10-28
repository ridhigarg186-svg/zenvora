import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryShowcase } from './components/CategoryShowcase';
import { FeaturedCollections } from './components/FeaturedCollections';
import { PromotionalBanner } from './components/PromotionalBanner';
import { AiSectionCTA } from './components/AiSectionCTA';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ShopView } from './components/ShopView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { UserAccountView } from './components/UserAccountView';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { AuthModal } from './components/AuthModal';
import { AIFashionAssistant } from './components/AIFashionAssistant';
import { Footer } from './components/Footer';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentView, toast } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900 selection:bg-[#C5A880]/30 selection:text-stone-900">
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-bounce duration-300">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold border backdrop-blur-md ${
            toast.type === 'error'
              ? 'bg-red-950/90 text-red-200 border-red-700'
              : toast.type === 'info'
              ? 'bg-stone-900/95 text-stone-200 border-stone-700'
              : 'bg-stone-950/95 text-amber-200 border-[#D4AF37]/50'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-stone-400 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection />
            <CategoryShowcase />
            <FeaturedCollections />
            <PromotionalBanner />
            <AiSectionCTA />
            <TestimonialsSection />
          </>
        )}

        {currentView === 'shop' && <ShopView />}
        {currentView === 'product-detail' && <ProductDetailModal />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'order-confirmation' && <OrderConfirmationView />}
        {currentView === 'account' && <UserAccountView />}
        {currentView === 'wishlist' && <UserAccountView />}
        {currentView === 'admin' && <AdminDashboard />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'contact' && <ContactView />}
      </main>

      {/* Persistent Components */}
      <CartDrawer />
      <AuthModal />
      <AIFashionAssistant />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <MainContent />
      </ShopProvider>
    </AuthProvider>
  );
}
