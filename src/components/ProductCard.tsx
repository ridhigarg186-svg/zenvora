import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProductDetail, addToCart, toggleWishlist, isInWishlist } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  const inWishlist = isInWishlist(product.id);
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - (product.discountPrice || product.price)) / product.price) * 100) 
    : 0;

  const currentImage = product.images[isHovered && product.images.length > 1 ? 1 : 0] || product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[selectedColorIdx]?.name || product.colors[0]?.name || 'Default';
    addToCart(product, defaultSize, defaultColor, 1);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div 
      onClick={() => openProductDetail(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer flex flex-col bg-white rounded-xl overflow-hidden border border-stone-200/70 hover:border-stone-400/80 transition-all duration-300 hover:shadow-xl"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isTrending && (
            <span className="px-2.5 py-1 rounded bg-[#1A1A1A]/90 text-amber-300 text-[10px] font-semibold tracking-wider uppercase backdrop-blur-sm shadow-sm border border-[#D4AF37]/30">
              Trending
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-1 rounded bg-stone-900/85 text-white text-[10px] font-semibold tracking-wider uppercase backdrop-blur-sm shadow-sm">
              New Arrival
            </span>
          )}
          {hasDiscount && (
            <span className="px-2.5 py-1 rounded bg-[#B33A3A] text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="px-2.5 py-1 rounded bg-amber-600/90 text-white text-[10px] font-medium backdrop-blur-sm">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-red-600 shadow-md transition-all duration-200 hover:scale-110 z-10"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${inWishlist ? 'fill-red-600 text-red-600' : 'text-stone-700'}`} 
          />
        </button>

        {/* Quick Action Overlay on Desktop Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2 px-3 bg-[#FAF9F6] hover:bg-white text-stone-900 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95 tracking-wide"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProductDetail(product);
            }}
            className="p-2 bg-stone-900/80 hover:bg-stone-900 text-white rounded-lg shadow-md transition-all"
            title="Inspect Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-stone-700 mb-1">
            <span className="font-medium text-stone-700">{product.gender} • {product.category}</span>
            <div className="flex items-center gap-1 text-stone-700">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-stone-800">{product.rating.toFixed(1)}</span>
              <span className="text-[10px] text-stone-700">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-base sm:text-lg font-semibold text-stone-900 group-hover:text-[#997A45] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-stone-700 line-clamp-1 mt-0.5">
            {product.tagline}
          </p>
        </div>

        {/* Price & Color Swatches */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-stone-900">
              ${product.discountPrice || product.price}
            </span>
            {hasDiscount && (
              <span className="text-xs text-stone-700 line-through">
                ${product.price}
              </span>
            )}
          </div>

          {/* Color Dots */}
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 3).map((col, idx) => (
              <span
                key={idx}
                title={col.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorIdx(idx);
                }}
                className={`w-3.5 h-3.5 rounded-full border border-stone-300 transition-transform ${selectedColorIdx === idx ? 'scale-125 ring-1 ring-stone-900' : 'hover:scale-110'}`}
                style={{ backgroundColor: col.hex }}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[10px] text-stone-700 ml-0.5">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
