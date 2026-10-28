export interface Product {
  id: string;
  name: string;
  tagline: string;
  gender: 'men' | 'women' | 'unisex';
  category: 't-shirts' | 'shirts' | 'jeans' | 'trousers' | 'dresses' | 'tops' | 'jackets' | 'ethnic' | 'accessories';
  price: number;
  discountPrice?: number;
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  description: string;
  details: {
    material: string;
    fit: string;
    care: string;
    modelInfo: string;
  };
  isNewArrival?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isSeasonal?: boolean;
  tags: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  phone?: string;
  avatar?: string;
  savedAddresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface CartItem {
  id: string; // unique item id (productId + size + color)
  product: Product;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  shippingAddress: Address;
  paymentMethod: 'card' | 'razorpay' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  orderStatus: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber: string;
  timeline: { title: string; date: string; description: string; completed: boolean }[];
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minSpend: number;
  expiryDate: string;
  description: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId?: string;
  productName?: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  createdAt: string;
}

export interface FilterState {
  gender: 'all' | 'men' | 'women';
  category: string;
  search: string;
  sort: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  minPrice: number;
  maxPrice: number;
  collection?: 'all' | 'trending' | 'new' | 'bestseller' | 'seasonal';
}
