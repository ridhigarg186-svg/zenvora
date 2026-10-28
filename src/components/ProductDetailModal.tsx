import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Sparkles, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Ruler, 
  ChevronRight,
  ArrowLeft,
  Check,
  MessageCircle
} from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setCurrentView, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    openAiAssistant,
    products,
    showToast
  } = useShop();

  if (!selectedProduct) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(selectedProduct.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(selectedProduct.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping' | 'reviews'>('details');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Reviews state for this product
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const inWishlist = isInWishlist(selectedProduct.id);
  const hasDiscount = Boolean(selectedProduct.discountPrice && selectedProduct.discountPrice < selectedProduct.price);

  useEffect(() => {
    setActiveImageIdx(0);
    setSelectedSize(selectedProduct.sizes[0] || 'M');
    setSelectedColor(selectedProduct.colors[0]?.name || 'Standard');
    setQuantity(1);

    // Fetch reviews for this product
    fetch(`/api/reviews?productId=${selectedProduct.id}`)
      .then(r => r.json())
      .then(d => {
        if (d.reviews) setProductReviews(d.reviews);
      })
      .catch(() => {});
  }, [selectedProduct]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          userName: newReviewAuthor.trim() || 'Valued Client',
          rating: newReviewRating,
          comment: newReviewComment.trim(),
          title: 'Client Experience'
        })
      });
      const data = await res.json();
      if (data.review) {
        setProductReviews(prev => [data.review, ...prev]);
        setNewReviewComment('');
        setNewReviewAuthor('');
        showToast('Thank you! Your verified review has been published.');
      }
    } catch {
      showToast('Could not submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const relatedProducts = products
    .filter(p => p.id !== selectedProduct.id && (p.category === selectedProduct.category || p.gender === selectedProduct.gender))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* Top Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 border-b border-stone-200">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <button 
            onClick={() => setCurrentView('home')}
            className="hover:text-black transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button 
            onClick={() => setCurrentView('shop')}
            className="hover:text-black transition-colors capitalize"
          >
            {selectedProduct.gender}'s Collection
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-medium truncate">{selectedProduct.name}</span>
        </div>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => setCurrentView('shop')}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-black mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Gallery Images (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
              <img
                src={selectedProduct.images[activeImageIdx] || selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="w-full h-full object-cover object-center transition-all duration-500"
              />

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                className="absolute top-4 right-4 p-3 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-red-600 shadow-md transition-all z-10"
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-600 text-red-600' : ''}`} />
              </button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {selectedProduct.isTrending && (
                  <span className="px-3 py-1 rounded bg-[#1A1A1A]/90 text-amber-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm border border-[#D4AF37]/30">
                    Trending
                  </span>
                )}
                {hasDiscount && (
                  <span className="px-3 py-1 rounded bg-[#B33A3A] text-white text-xs font-bold tracking-wider uppercase">
                    Sale
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail switcher */}
            {selectedProduct.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {selectedProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${activeImageIdx === idx ? 'border-stone-900 shadow-md ring-1 ring-stone-900' : 'border-stone-200 opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Buy Box (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#997A45] font-semibold">
                <span>{selectedProduct.gender} • {selectedProduct.category}</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  {selectedProduct.stock > 0 ? 'In Stock (Atelier Ready)' : 'Pre-Order'}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
                {selectedProduct.name}
              </h1>

              <p className="text-stone-600 text-sm mt-1 leading-relaxed">
                {selectedProduct.tagline}
              </p>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-stone-800">{selectedProduct.rating.toFixed(1)}</span>
                <span className="text-xs text-stone-500">({selectedProduct.reviewCount} verified reviews)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-stone-100/70 border border-stone-200 flex items-baseline gap-3">
              <span className="text-3xl font-serif font-bold text-stone-900">
                ${selectedProduct.discountPrice || selectedProduct.price}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-stone-500 line-through">
                    ${selectedProduct.price}
                  </span>
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                    Save ${selectedProduct.price - (selectedProduct.discountPrice || 0)}
                  </span>
                </>
              )}
            </div>

            {/* Color Swatch Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-800 mb-2">
                Selected Color: <span className="text-stone-900 font-normal">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-3">
                {selectedProduct.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c.name)}
                    className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${selectedColor === c.name ? 'border-stone-900 bg-stone-900 text-white shadow-sm' : 'border-stone-200 hover:border-stone-400 text-stone-700 bg-white'}`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-stone-300" style={{ backgroundColor: c.hex }} />
                    <span className="font-medium">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector & Size Guide */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                  Select Size
                </label>
                <button
                  onClick={() => setIsSizeGuideOpen(!isSizeGuideOpen)}
                  className="text-xs text-[#997A45] hover:text-black font-semibold flex items-center gap-1 underline"
                >
                  <Ruler className="w-3.5 h-3.5" /> Size & Fit Guide
                </button>
              </div>

              {/* Size Buttons */}
              <div className="grid grid-cols-5 gap-2">
                {selectedProduct.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2.5 text-xs font-bold tracking-wider rounded-lg border transition-all ${selectedSize === s ? 'bg-stone-900 text-white border-stone-900 shadow-sm' : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Size Guide Modal / Drawer */}
              {isSizeGuideOpen && (
                <div className="mt-3 p-4 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 space-y-2 animate-fadeIn">
                  <p className="font-semibold text-stone-900">Standard European Fit Measurements (Inches)</p>
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-500">
                        <th className="py-1">Size</th>
                        <th>Chest / Bust</th>
                        <th>Waist</th>
                        <th>Hips</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      <tr><td className="py-1 font-semibold">XS</td><td>32-34"</td><td>25-27"</td><td>35-37"</td></tr>
                      <tr><td className="py-1 font-semibold">S</td><td>35-37"</td><td>28-30"</td><td>38-40"</td></tr>
                      <tr><td className="py-1 font-semibold">M</td><td>38-40"</td><td>31-33"</td><td>41-43"</td></tr>
                      <tr><td className="py-1 font-semibold">L</td><td>41-43"</td><td>34-36"</td><td>44-46"</td></tr>
                      <tr><td className="py-1 font-semibold">XL</td><td>44-46"</td><td>37-39"</td><td>47-49"</td></tr>
                    </tbody>
                  </table>
                  <p className="text-[10px] text-stone-500 italic mt-1">
                    Complimentary size exchanges on all orders within 30 days.
                  </p>
                </div>
              )}
            </div>

            {/* Quantity Selector & Add to Bag CTA */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2.5 text-stone-600 hover:bg-stone-100 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2.5 text-stone-600 hover:bg-stone-100 font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Bag Button */}
                <button
                  onClick={() => addToCart(selectedProduct, selectedSize, selectedColor, quantity)}
                  className="flex-1 py-3.5 px-6 rounded-lg bg-stone-900 hover:bg-black text-[#FAF9F6] font-bold text-xs uppercase tracking-[0.18em] shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" /> Add to Shopping Bag
                </button>
              </div>

              {/* Consult AI Stylist on this Look (Feature 5) */}
              <button
                onClick={() => openAiAssistant(`What styling combinations and occasions do you recommend for the ${selectedProduct.name}?`, selectedProduct)}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-50 to-stone-50 hover:from-amber-100 hover:to-stone-100 text-stone-900 border border-[#D4AF37]/50 text-xs font-semibold tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                Ask AI Stylist: "How to style this piece?"
              </button>
            </div>

            {/* Accordion Tabs */}
            <div className="pt-6 border-t border-stone-200">
              <div className="flex border-b border-stone-200 text-xs font-semibold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2.5 px-3 border-b-2 transition-all ${activeTab === 'details' ? 'border-stone-900 text-stone-900 font-bold' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
                >
                  Details & Fit
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`pb-2.5 px-3 border-b-2 transition-all ${activeTab === 'care' ? 'border-stone-900 text-stone-900 font-bold' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
                >
                  Material & Care
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-2.5 px-3 border-b-2 transition-all ${activeTab === 'shipping' ? 'border-stone-900 text-stone-900 font-bold' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
                >
                  Shipping & Returns
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2.5 px-3 border-b-2 transition-all ${activeTab === 'reviews' ? 'border-stone-900 text-stone-900 font-bold' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
                >
                  Reviews ({productReviews.length})
                </button>
              </div>

              <div className="py-4 text-xs text-stone-600 leading-relaxed">
                {activeTab === 'details' && (
                  <div className="space-y-2">
                    <p>{selectedProduct.description}</p>
                    <p><strong>Fit:</strong> {selectedProduct.details.fit}</p>
                    <p><strong>Model:</strong> {selectedProduct.details.modelInfo}</p>
                  </div>
                )}

                {activeTab === 'care' && (
                  <div className="space-y-2">
                    <p><strong>Composition:</strong> {selectedProduct.details.material}</p>
                    <p><strong>Care Instructions:</strong> {selectedProduct.details.care}</p>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2">
                      <Truck className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>Complimentary DHL Express on orders over $100. Dispatched within 24 hours.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <RotateCcw className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>30-Day hassle-free returns with prepaid return postage included in box.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>Signature security verification and luxury dust-bag packaging.</span>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {/* Write Review Form */}
                    <form onSubmit={handleAddReview} className="p-3 bg-stone-100 rounded-xl space-y-2.5">
                      <p className="font-semibold text-stone-900">Add a Verified Review</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-stone-600">Your Rating:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              type="button"
                              key={s}
                              onClick={() => setNewReviewRating(s)}
                              className="focus:outline-none"
                            >
                              <Star className={`w-4 h-4 ${s <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        placeholder="Your name or initials"
                        className="w-full text-xs p-2 bg-white rounded-lg border border-stone-200"
                      />
                      <textarea
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Share your thoughts on the fit, fabric, and styling..."
                        rows={2}
                        className="w-full text-xs p-2 bg-white rounded-lg border border-stone-200"
                        required
                      />
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-4 py-1.5 rounded-lg bg-stone-900 text-white text-[11px] font-semibold hover:bg-black transition-colors"
                      >
                        Submit Review
                      </button>
                    </form>

                    {/* Reviews List */}
                    <div className="space-y-3">
                      {productReviews.length === 0 ? (
                        <p className="text-stone-500 italic">Be the first to review this atelier piece.</p>
                      ) : (
                        productReviews.map((r) => (
                          <div key={r.id} className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-stone-900">{r.userName}</span>
                              <div className="flex items-center text-amber-400">
                                {[...Array(r.rating || 5)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                                ))}
                              </div>
                            </div>
                            <p className="text-[11px] text-stone-700">{r.comment}</p>
                            <span className="text-[10px] text-stone-400">{r.createdAt}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-stone-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#997A45] font-semibold">
                  Complete The Aesthetic
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  Stylist Pairs & Related Pieces
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
