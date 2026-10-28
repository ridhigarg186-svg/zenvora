import React from 'react';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin, 
  Printer, 
  ArrowRight, 
  Copy, 
  Sparkles,
  Calendar,
  Clock,
  Database
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OrderConfirmationView: React.FC = () => {
  const { placedOrder, setCurrentView, openAiAssistant, showToast } = useShop();

  if (!placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-900">No recent order found</h2>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 px-6 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(placedOrder.trackingNumber);
    showToast('Tracking number copied to clipboard.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Celebration Header */}
        <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
            <CheckCircle className="w-8 h-8" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#997A45]">
            Acquisition Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Thank you, {placedOrder.customerName}.
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
            Your bespoke order <strong className="text-stone-900">{placedOrder.id}</strong> has been received by the Zenvora atelier. A confirmation receipt has been dispatched to <strong>{placedOrder.customerEmail}</strong>.
          </p>

          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saved to Supabase Backend (`kvzlznatxrstgjorhnor`)</span>
            </span>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 hover:text-black hover:border-black text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Luxury Receipt
            </button>
            <button
              onClick={() => openAiAssistant(`Can you suggest jewelry or shoes to pair with my recent order ${placedOrder.id}?`)}
              className="px-4 py-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Ask Stylist for Pairing Advice
            </button>
          </div>
        </div>

        {/* Live Delivery Tracking Stepper */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-stone-500 font-semibold">Real-Time Courier Tracking</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-sm font-bold text-stone-900">{placedOrder.trackingNumber}</span>
                <button
                  onClick={handleCopyTracking}
                  className="text-stone-400 hover:text-black"
                  title="Copy tracking ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-stone-500">Estimated Arrival:</p>
              <p className="text-xs font-bold text-emerald-800">In 3-5 Business Days (DHL Signature Express)</p>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {placedOrder.timeline.map((step, idx) => (
              <div key={idx} className="flex md:flex-col items-start gap-3 md:gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${step.completed ? 'bg-stone-900 text-[#D4AF37]' : 'bg-stone-100 text-stone-400 border border-stone-200'}`}>
                  {step.completed ? '✓' : idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{step.title}</h4>
                  <p className="text-[11px] text-stone-500 font-medium">{step.date}</p>
                  <p className="text-[10px] text-stone-400 mt-0.5 leading-tight">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Items Purchased */}
          <div className="md:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
              Purchased Items ({placedOrder.items.length})
            </h3>
            <div className="divide-y divide-stone-100">
              {placedOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-14 h-18 object-cover rounded-lg bg-stone-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-stone-900 truncate">{item.productName}</h4>
                    <p className="text-[11px] text-stone-500">Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</p>
                    <p className="text-xs font-bold text-stone-900 mt-0.5">${item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address & Financials */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
              <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#997A45]" /> Shipping Destination
              </h3>
              <div className="text-xs text-stone-600 space-y-0.5">
                <p className="font-semibold text-stone-900">{placedOrder.shippingAddress.fullName}</p>
                <p>{placedOrder.shippingAddress.street}</p>
                <p>{placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.state} {placedOrder.shippingAddress.postalCode}</p>
                <p>{placedOrder.shippingAddress.country}</p>
                {placedOrder.shippingAddress.phone && <p>Tel: {placedOrder.shippingAddress.phone}</p>}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">${placedOrder.subtotal.toFixed(2)}</span>
              </div>
              {placedOrder.discount > 0 && (
                <div className="flex justify-between text-amber-800 font-semibold">
                  <span>Concession Saved</span>
                  <span>-${placedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-stone-900">
                  {placedOrder.shipping === 0 ? 'FREE' : `$${placedOrder.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-semibold text-stone-900">${placedOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-serif font-bold text-stone-900 pt-2 border-t border-stone-100">
                <span>Total Paid</span>
                <span>${placedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Button to return to store */}
        <div className="text-center pt-4">
          <button
            onClick={() => setCurrentView('shop')}
            className="px-8 py-3.5 bg-stone-900 hover:bg-black text-white text-xs uppercase tracking-[0.18em] font-bold rounded-lg shadow-lg transition-transform active:scale-98 inline-flex items-center gap-2 cursor-pointer"
          >
            Continue Exploring Collections <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>

      </div>
    </div>
  );
};
