import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  ArrowLeft, 
  Lock, 
  MapPin, 
  Building2,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { Address } from '../types';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    shippingFee, 
    taxAmount, 
    cartTotal, 
    appliedCoupon, 
    setCurrentView,
    setPlacedOrder,
    clearCart,
    showToast
  } = useShop();

  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);

  // Shipping details state
  const [shippingAddress, setShippingAddress] = useState<Address>(() => {
    if (user?.savedAddresses && user.savedAddresses.length > 0) {
      return user.savedAddresses[0];
    }
    return {
      id: 'addr-new',
      fullName: user?.name || '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      phone: user?.phone || ''
    };
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'razorpay' | 'cod'>('card');

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState(user?.name || '');
  const [upiId, setUpiId] = useState('');

  const handleFillDemoCard = () => {
    setCardNumber('4532 •••• •••• 8892');
    setCardExpiry('08/29');
    setCardCvv('784');
    setCardName(user?.name || 'Julian Vance');
    showToast('Demo payment credentials pre-filled securely.');
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      showToast('Please complete all shipping address fields.', 'error');
      setStep(1);
      return;
    }

    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      showToast('Please enter valid payment card details.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        userId: user?.id || 'guest',
        customerName: shippingAddress.fullName,
        customerEmail: user?.email || 'guest@zenvora.com',
        customerPhone: shippingAddress.phone,
        items: cart.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          image: i.product.images[0],
          size: i.size,
          color: i.color,
          price: i.price,
          quantity: i.quantity
        })),
        subtotal: cartSubtotal,
        discount: appliedCoupon ? appliedCoupon.discountAmount : 0,
        shipping: deliveryMethod === 'express' ? shippingFee + 20 : shippingFee,
        tax: taxAmount,
        total: deliveryMethod === 'express' ? cartTotal + 20 : cartTotal,
        couponCode: appliedCoupon?.code,
        shippingAddress,
        paymentMethod
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authorize transaction');
      }

      setPlacedOrder(data.order);
      clearCart();
      setCurrentView('order-confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      showToast(err.message || 'Payment simulation failed. Try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Your bag is empty</h2>
        <p className="text-xs text-stone-500 mt-2">Add items to proceed to checkout.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-6 px-6 py-3 bg-stone-900 text-white rounded-lg text-xs uppercase font-semibold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          onClick={() => setCurrentView('shop')}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-black mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Return to shopping
        </button>

        {/* Header Stepper */}
        <div className="mb-10 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[#997A45] font-semibold">
            Secure Bespoke Checkout
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            Complete Your Acquisition
          </h1>

          <div className="flex items-center justify-center gap-3 sm:gap-8 mt-6 text-xs uppercase tracking-wider font-semibold">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 ${step === 1 ? 'text-stone-900 border-b-2 border-stone-900 pb-1' : 'text-stone-400'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-stone-900 text-white' : 'bg-stone-200'}`}>1</span>
              <span>Shipping</span>
            </button>
            <span className="text-stone-300">—</span>
            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 ${step === 2 ? 'text-stone-900 border-b-2 border-stone-900 pb-1' : 'text-stone-400'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-stone-900 text-white' : 'bg-stone-200'}`}>2</span>
              <span>Delivery</span>
            </button>
            <span className="text-stone-300">—</span>
            <button
              onClick={() => setStep(3)}
              className={`flex items-center gap-2 ${step === 3 ? 'text-stone-900 border-b-2 border-stone-900 pb-1' : 'text-stone-400'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-stone-900 text-white' : 'bg-stone-200'}`}>3</span>
              <span>Payment</span>
            </button>
          </div>
        </div>

        {/* Content Layout: Left Form (Col 7) + Right Order Summary (Col 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Checkout Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#997A45]" /> Shipping & Concierge Destination
                  </h3>
                  {user && (
                    <span className="text-xs text-stone-500">
                      Logged in as <strong>{user.name}</strong>
                    </span>
                  )}
                </div>

                {/* Saved addresses picker if available */}
                {user?.savedAddresses && user.savedAddresses.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-stone-700">Choose from Saved Addresses:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {user.savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setShippingAddress(addr)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${shippingAddress.street === addr.street ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900' : 'border-stone-200 hover:border-stone-400'}`}
                        >
                          <p className="font-bold text-stone-900">{addr.fullName}</p>
                          <p className="text-stone-600 truncate">{addr.street}</p>
                          <p className="text-stone-500">{addr.city}, {addr.postalCode}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      placeholder="e.g. Julian Vance"
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      placeholder="e.g. 742 Evergreen Terrace, Suite 402"
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">City</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      placeholder="e.g. New York"
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">State / Province</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      placeholder="e.g. NY"
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      placeholder="e.g. 10001"
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      placeholder="e.g. +1 555-0144"
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      if (!shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city) {
                        showToast('Please fill in required address fields', 'error');
                        return;
                      }
                      setStep(2);
                    }}
                    className="px-6 py-3 bg-stone-900 hover:bg-black text-white text-xs uppercase tracking-wider font-bold rounded-lg transition-all"
                  >
                    Continue to Delivery
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Delivery Method */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-stone-100">
                  <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#997A45]" /> Select Delivery Experience
                  </h3>
                  <p className="text-xs text-stone-500">Delivered in luxury velvet-lined Zenvora signature packaging.</p>
                </div>

                <div className="space-y-3">
                  <div
                    onClick={() => setDeliveryMethod('standard')}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${deliveryMethod === 'standard' ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900' : 'border-stone-200 hover:border-stone-400'}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-xs">Standard Express (3-5 Business Days)</span>
                        {shippingFee === 0 && (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            FREE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">Dispatched via DHL Express with signature security tracking.</p>
                    </div>
                    <span className="text-xs font-bold text-stone-900">
                      {shippingFee === 0 ? '$0.00' : `$${shippingFee}`}
                    </span>
                  </div>

                  <div
                    onClick={() => setDeliveryMethod('express')}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${deliveryMethod === 'express' ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900' : 'border-stone-200 hover:border-stone-400'}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-xs">Priority Air Concierge (1-2 Business Days)</span>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                          VIP SPEED
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">Guaranteed next-flight out dispatch with white-glove packaging.</p>
                    </div>
                    <span className="text-xs font-bold text-stone-900">
                      ${(shippingFee + 20).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-stone-600 hover:text-black text-xs font-semibold"
                  >
                    Back to Shipping
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 bg-stone-900 hover:bg-black text-white text-xs uppercase tracking-wider font-bold rounded-lg transition-all"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Gateway Simulation */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-stone-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#997A45]" /> Payment Gateway
                    </h3>
                    <p className="text-xs text-stone-500">Stripe & Razorpay compatible secure checkout.</p>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                    <Lock className="w-3 h-3" /> End-to-End Encrypted
                  </span>
                </div>

                {/* Gateway Tab Selection */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2.5 text-xs font-bold rounded-lg border transition-all ${paymentMethod === 'card' ? 'bg-stone-900 text-white border-stone-900 shadow-sm' : 'bg-white text-stone-700 border-stone-200'}`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`py-2.5 text-xs font-bold rounded-lg border transition-all ${paymentMethod === 'razorpay' ? 'bg-stone-900 text-white border-stone-900 shadow-sm' : 'bg-white text-stone-700 border-stone-200'}`}
                  >
                    Razorpay / UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2.5 text-xs font-bold rounded-lg border transition-all ${paymentMethod === 'cod' ? 'bg-stone-900 text-white border-stone-900 shadow-sm' : 'bg-white text-stone-700 border-stone-200'}`}
                  >
                    Cash on Delivery
                  </button>
                </div>

                {/* Card Fields */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-stone-700 uppercase">Card Information</span>
                      <button
                        type="button"
                        onClick={handleFillDemoCard}
                        className="text-xs text-[#997A45] hover:text-black font-semibold underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> Fill Demo Test Card
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• 8892"
                        className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-stone-600 mb-1">Expiration (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="08/29"
                          className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-stone-600 mb-1">Security CVC</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Name on Card</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Julian Vance"
                        className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>
                )}

                {/* Razorpay UPI Fields */}
                {paymentMethod === 'razorpay' && (
                  <div className="space-y-3 pt-2">
                    <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                      <p className="font-semibold flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-amber-700" /> Razorpay Instant Gateway
                      </p>
                      <p className="text-[11px] text-stone-600">
                        Enter your UPI ID (Google Pay, PhonePe, Paytm) or proceed to simulate instant scan & pay verification.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Virtual Payment Address (VPA / UPI ID)</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okaxis or mobile@upi"
                        className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>
                )}

                {/* Cash on Delivery Details */}
                {paymentMethod === 'cod' && (
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                    <p className="font-semibold text-stone-900">Concierge Cash on Delivery</p>
                    <p className="text-[11px] text-stone-500">
                      Payment will be collected by our white-glove DHL courier upon physical handover. Exact cash or courier card terminal accepted.
                    </p>
                  </div>
                )}

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-stone-600 hover:text-black text-xs font-semibold"
                  >
                    Back to Delivery
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    className="px-8 py-3.5 bg-stone-900 hover:bg-black text-amber-300 hover:text-white text-xs uppercase tracking-[0.18em] font-bold rounded-lg shadow-xl disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {submitting ? 'Authorizing Payment...' : `Authorize & Pay $${(deliveryMethod === 'express' ? cartTotal + 20 : cartTotal).toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Order Summary & Items List */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
                Order Items ({cart.length})
              </h3>

              <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-16 object-cover rounded-lg bg-stone-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-900 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-stone-500">Size {item.size} • Qty {item.quantity}</p>
                      <p className="text-xs font-bold text-stone-900 mt-0.5">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">${cartSubtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-amber-800 font-semibold">
                    <span>Discount Concession ({appliedCoupon.code})</span>
                    <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery ({deliveryMethod === 'express' ? 'Priority Air' : 'Standard Express'})</span>
                  <span className="font-semibold text-stone-900">
                    {deliveryMethod === 'express' ? `$${(shippingFee + 20).toFixed(2)}` : (shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax (7%)</span>
                  <span className="font-semibold text-stone-900">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-stone-900 pt-3 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span>${(deliveryMethod === 'express' ? cartTotal + 20 : cartTotal).toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#997A45] flex-shrink-0" />
                <span>30-Day Bespoke Returns & Complimentary Exchanges Guaranteed.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
