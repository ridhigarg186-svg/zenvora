import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Package, 
  MapPin, 
  Heart, 
  LogOut, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  ArrowLeft,
  Truck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { Order, Address } from '../types';

export const UserAccountView: React.FC = () => {
  const { user, logout, updateProfile, addAddress, deleteAddress, loginAsDemo, isAdmin } = useAuth();
  const { setCurrentView, wishlist, products, openProductDetail, showToast } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'wishlist'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Address Form State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: user?.phone || ''
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');

      setLoadingOrders(true);
      fetch(`/api/orders?userId=${user.id}`)
        .then(r => r.json())
        .then(d => {
          if (d.orders) setOrders(d.orders);
        })
        .catch(() => {})
        .finally(() => setLoadingOrders(false));
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const success = await updateProfile({ name, phone });
    setSavingProfile(false);
    if (success) {
      showToast('Profile information updated.');
    } else {
      showToast('Failed to update profile', 'error');
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city) return;
    const success = await addAddress(newAddress);
    if (success) {
      showToast('New shipping address saved.');
      setIsAddingAddress(false);
      setNewAddress({
        fullName: user?.name || '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United States',
        phone: user?.phone || ''
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 max-w-md w-full text-center space-y-4 shadow-lg">
          <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-700">
            <UserIcon className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">Sign in to Zenvora</h2>
          <p className="text-xs text-stone-500">
            Access past acquisitions, real-time courier tracking, and your bespoke wishlists.
          </p>
          <div className="space-y-2 pt-2">
            <button
              onClick={() => loginAsDemo('customer')}
              className="w-full py-3 bg-stone-900 text-white font-bold rounded-lg text-xs uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
            >
              Log in as Demo Customer (Julian Vance)
            </button>
            <button
              onClick={() => loginAsDemo('admin')}
              className="w-full py-2.5 bg-amber-50 text-amber-900 border border-amber-300 font-semibold rounded-lg text-xs hover:bg-amber-100 transition-colors cursor-pointer"
            >
              Log in as Demo Admin (Victoria Zenvora)
            </button>
          </div>
          <button
            onClick={() => setCurrentView('home')}
            className="text-xs text-stone-500 hover:text-black pt-2 block mx-auto"
          >
            ← Return to storefront
          </button>
        </div>
      </div>
    );
  }

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <button
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-black cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Boutique
        </button>

        {/* User Profile Card Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-stone-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-stone-900">{user.name}</h1>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                    Administrator
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">{user.email} • {user.phone || 'No phone registered'}</p>
              <p className="text-[11px] text-stone-400 mt-0.5">VIP Zenvora Member</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => setCurrentView('admin')}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-700" /> Admin Dashboard
              </button>
            )}
            <button
              onClick={() => logout()}
              className="px-4 py-2 border border-stone-200 hover:border-red-300 hover:text-red-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'orders' ? 'bg-stone-900 text-white shadow' : 'bg-white text-stone-700 hover:bg-stone-100'}`}
          >
            <Package className="w-4 h-4 text-[#D4AF37]" /> Order History ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'profile' ? 'bg-stone-900 text-white shadow' : 'bg-white text-stone-700 hover:bg-stone-100'}`}
          >
            <UserIcon className="w-4 h-4 text-[#D4AF37]" /> Personal Info
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'addresses' ? 'bg-stone-900 text-white shadow' : 'bg-white text-stone-700 hover:bg-stone-100'}`}
          >
            <MapPin className="w-4 h-4 text-[#D4AF37]" /> Saved Addresses ({user.savedAddresses?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'wishlist' ? 'bg-stone-900 text-white shadow' : 'bg-white text-stone-700 hover:bg-stone-100'}`}
          >
            <Heart className="w-4 h-4 text-[#D4AF37]" /> Wishlist ({wishlist.length})
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
                <Package className="w-10 h-10 text-stone-400 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-stone-900">No orders placed yet</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Your acquisitions will appear here along with real-time DHL tracking and downloadable receipts.
                </p>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="px-6 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-900 text-sm">{ord.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ord.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' : ord.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                          {ord.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Placed on {ord.createdAt?.split('T')[0] || '2026-10-25'} • Total: <strong>${ord.total.toFixed(2)}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedOrderForTracking(selectedOrderForTracking?.id === ord.id ? null : ord)}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5 text-[#997A45]" />
                      {selectedOrderForTracking?.id === ord.id ? 'Hide Tracking' : 'Track Courier Timeline'}
                    </button>
                  </div>

                  {/* Tracking Timeline Drawer */}
                  {selectedOrderForTracking?.id === ord.id && (
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-stone-800">DHL Express Air Tracking: <strong>{ord.trackingNumber}</strong></span>
                        <span className="text-emerald-700 font-bold">Estimated Delivery in 3-5 days</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                        {ord.timeline.map((step, idx) => (
                          <div key={idx} className="flex sm:flex-col items-start gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step.completed ? 'bg-stone-900 text-amber-300' : 'bg-stone-200 text-stone-400'}`}>
                              {step.completed ? '✓' : idx + 1}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-stone-900">{step.title}</p>
                              <p className="text-[10px] text-stone-500">{step.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Order items */}
                  <div className="divide-y divide-stone-100">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.productName} className="w-12 h-14 object-cover rounded bg-stone-100" />
                          <div>
                            <h4 className="text-xs font-semibold text-stone-900">{item.productName}</h4>
                            <p className="text-[11px] text-stone-500">Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-stone-900">${item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Profile Info */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm max-w-xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900">Personal Information</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold uppercase text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full p-3 bg-stone-100 border border-stone-200 rounded-lg text-stone-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">Email is locked to your Zenvora profile ID.</span>
              </div>
              <div>
                <label className="block font-semibold uppercase text-stone-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 bg-stone-900 hover:bg-black text-white font-bold uppercase tracking-wider rounded-lg text-xs"
              >
                {savingProfile ? 'Saving...' : 'Update Profile'}
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-stone-900">Saved Addresses</h3>
              <button
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" /> Add New Address
              </button>
            </div>

            {isAddingAddress && (
              <form onSubmit={handleCreateAddress} className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-3 text-xs max-w-lg">
                <p className="font-bold text-stone-900">Add Destination Address</p>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">City</label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 text-white rounded-lg font-bold"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-4 py-2 border border-stone-200 rounded-lg text-stone-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.savedAddresses?.map((addr) => (
                <div key={addr.id} className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm relative group text-xs space-y-1">
                  <p className="font-bold text-stone-900 text-sm">{addr.fullName}</p>
                  <p className="text-stone-600">{addr.street}</p>
                  <p className="text-stone-500">{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p className="text-stone-500">{addr.country}</p>
                  {addr.phone && <p className="text-stone-400">Tel: {addr.phone}</p>}
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="absolute top-4 right-4 text-stone-400 hover:text-red-600 p-1 rounded"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-stone-900">Your Saved Wishlist Pieces</h3>
            {wishlistProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-2">
                <Heart className="w-10 h-10 text-stone-300 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-stone-900">Your wishlist is empty</h4>
                <p className="text-xs text-stone-500">Save items while browsing to consult later or ask our AI stylist.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistProducts.map((p) => (
                  <div key={p.id} onClick={() => openProductDetail(p)} className="cursor-pointer group bg-white rounded-xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-all">
                    <img src={p.images[0]} alt={p.name} className="aspect-[3/4] w-full object-cover" />
                    <div className="p-3">
                      <p className="font-serif font-bold text-stone-900 truncate">{p.name}</p>
                      <p className="text-xs font-bold text-stone-800 mt-1">${p.discountPrice || p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
