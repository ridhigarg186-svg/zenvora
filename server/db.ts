import fs from 'fs';
import path from 'path';

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
  password?: string;
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

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
}

const initialProducts: Product[] = [
  // --- WOMEN'S WEAR ---
  {
    id: 'zen-w-001',
    name: 'Aurelia Silk Bias Slip Gown',
    tagline: 'Flowing 100% Mulberry Silk with hand-finished hemline',
    gender: 'women',
    category: 'dresses',
    price: 260,
    discountPrice: 195,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Champagne Gold', hex: '#E6C687' },
      { name: 'Onyx Black', hex: '#1C1C1C' },
      { name: 'Emerald Twilight', hex: '#1E3A2F' }
    ],
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    reviewCount: 38,
    stock: 14,
    description: 'An ode to classic 90s minimalism reimagined with contemporary confidence. Crafted from heavy 22-momme pure mulberry silk that drapes cleanly along the silhouette.',
    details: {
      material: '100% Grade 6A Mulberry Silk (22 Momme)',
      fit: 'Bias-cut drape, falls gracefully to mid-calf',
      care: 'Dry clean only or cold gentle silk hand-wash',
      modelInfo: 'Model is 5’9” / 175cm wearing size S'
    },
    isTrending: true,
    isBestSeller: true,
    tags: ['evening', 'dress', 'silk', 'gala', 'date-night', 'luxury']
  },
  {
    id: 'zen-w-002',
    name: 'Sartorial Structured Wool Blazer',
    tagline: 'Sharp peak lapels with sculpted waist in Italian virgin wool',
    gender: 'women',
    category: 'jackets',
    price: 320,
    discountPrice: 275,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Midnight Charcoal', hex: '#26282B' },
      { name: 'Warm Camel', hex: '#B89778' },
      { name: 'Ivory Bone', hex: '#F3EFE6' }
    ],
    images: [
      'https://images.unsplash.com/photo-1548624149-f9b1859aa9d0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.8,
    reviewCount: 52,
    stock: 20,
    description: 'Command every room with effortless poise. Our Sartorial Structured Blazer features light shoulder architecture, horn-effect buttons, and cupro lining.',
    details: {
      material: '98% Italian Virgin Wool, 2% Elastane. Lining: 100% Cupro',
      fit: 'Tailored feminine fit with slight waist cinching',
      care: 'Specialist dry clean only',
      modelInfo: 'Model is 5’10” / 178cm wearing size S'
    },
    isNewArrival: true,
    isTrending: true,
    tags: ['blazer', 'outerwear', 'boardroom', 'office', 'wool', 'power-dressing']
  },
  {
    id: 'zen-w-003',
    name: 'Palazzo High-Waist Pleated Trousers',
    tagline: 'Architectural front pleats with a fluid wide-leg sweep',
    gender: 'women',
    category: 'trousers',
    price: 180,
    discountPrice: 145,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Alabaster Cream', hex: '#EBE6DD' },
      { name: 'Espresso Bronze', hex: '#3E2F28' },
      { name: 'Jet Black', hex: '#151515' }
    ],
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.7,
    reviewCount: 29,
    stock: 18,
    description: 'Effortlessly elongated lines cut from breathable premium twill. Designed to sit high on the waist with hidden clasp closure and functional deep slash pockets.',
    details: {
      material: '70% Eco-Vero Viscose, 26% Tencel, 4% Spandex',
      fit: 'High rise, fluid drape wide leg cut',
      care: 'Machine wash delicate cycle in cold water',
      modelInfo: 'Model is 5’9” wearing size S, inseam 33"'
    },
    isBestSeller: true,
    tags: ['trousers', 'palazzo', 'pants', 'wide-leg', 'minimal']
  },
  {
    id: 'zen-w-004',
    name: 'Nocturne Hand-Embroidered Anarkali Ensemble',
    tagline: 'Artisanal Zari embroidery with layered georgette and organza dupatta',
    gender: 'women',
    category: 'ethnic',
    price: 390,
    discountPrice: 310,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Royal Plum Gold', hex: '#4B283A' },
      { name: 'Midnight Azure', hex: '#1C274C' }
    ],
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 5.0,
    reviewCount: 19,
    stock: 8,
    description: 'Heritage craftsmanship tailored for festive grandeur. Rich micro-zari threadwork with sequin highlights, paired with silk churidar and sheer bordered dupatta.',
    details: {
      material: 'Pure Chanderi Silk & Viscose Georgette. Lining: Butter Crepe',
      fit: 'Fitted bodice opening into a 32-kali voluminous flair',
      care: 'Strictly dry clean only',
      modelInfo: 'Model is 5’8” wearing size M'
    },
    isSeasonal: true,
    tags: ['ethnic', 'anarkali', 'wedding', 'festive', 'luxury', 'embroidery']
  },
  {
    id: 'zen-w-005',
    name: 'Siena French Rib Knit Turtleneck',
    tagline: 'Ultra-soft extra-fine Merino wool with delicate rib texture',
    gender: 'women',
    category: 'tops',
    price: 130,
    discountPrice: 99,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Cashmere Oatmeal', hex: '#DED3C4' },
      { name: 'Deep Burgundy', hex: '#581825' },
      { name: 'Classic Black', hex: '#1A1A1A' }
    ],
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.8,
    reviewCount: 44,
    stock: 25,
    description: 'The foundation of sophisticated layering. Featherlight warmth that feels heavenly against the skin without piling.',
    details: {
      material: '100% Extra-Fine Australian Merino Wool (19.5 Micron)',
      fit: 'Close body skimming fit with fold-over rollneck',
      care: 'Hand wash cold with wool detergent, dry flat',
      modelInfo: 'Model is 5’9” wearing size S'
    },
    isNewArrival: true,
    tags: ['tops', 'knitwear', 'sweater', 'wool', 'winter']
  },
  {
    id: 'zen-w-006',
    name: 'Seraphina Sculpted Leather Crossbody',
    tagline: 'Italian full-grain calfskin with champagne brushed hardware',
    gender: 'women',
    category: 'accessories',
    price: 240,
    discountPrice: 195,
    sizes: ['One Size'],
    colors: [
      { name: 'Caramel Cognac', hex: '#9C5B28' },
      { name: 'Matte Obsidian', hex: '#181818' },
      { name: 'Chalk Beige', hex: '#EBE5D8' }
    ],
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    reviewCount: 67,
    stock: 12,
    description: 'Handcrafted in Florence using vegetable-tanned leather that develops a rich, personal patina over years of journeys.',
    details: {
      material: '100% Full-grain Tuscan Calf Leather, Gold tone zinc alloy hardware',
      fit: 'Dimensions: 22cm x 15cm x 7cm with adjustable 110cm strap',
      care: 'Wipe with soft damp cloth; use leather balm biannually',
      modelInfo: 'Comes with dust bag and authenticity card'
    },
    isBestSeller: true,
    tags: ['accessories', 'bag', 'leather', 'handbag', 'crossbody']
  },

  // --- MEN'S WEAR ---
  {
    id: 'zen-m-001',
    name: 'Atelier Milanese Wool-Cashmere Overcoat',
    tagline: 'Double-breasted tailoring in dense 650gsm Italian melt-wool',
    gender: 'men',
    category: 'jackets',
    price: 450,
    discountPrice: 360,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Tuscan Camel', hex: '#B38B6D' },
      { name: 'Dark Navy', hex: '#151E28' },
      { name: 'Charcoal Fleck', hex: '#333538' }
    ],
    images: [
      'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    reviewCount: 46,
    stock: 15,
    description: 'The pinnacle of masculine sophistication. Features broad peak lapels, horn buttons, back storm vent, and thermal-regulating satin lining.',
    details: {
      material: '85% Virgin Italian Wool, 15% Mongolian Cashmere',
      fit: 'Modern tailored overcoat fit; fits comfortably over suits',
      care: 'Professional dry clean only',
      modelInfo: 'Model is 6’1” / 185cm wearing size L'
    },
    isTrending: true,
    isBestSeller: true,
    tags: ['coat', 'overcoat', 'winter', 'men', 'wool', 'luxury']
  },
  {
    id: 'zen-m-002',
    name: 'Riviera Pure French Linen Overshirt',
    tagline: 'Pre-washed Normandy flax with mother-of-pearl buttons',
    gender: 'men',
    category: 'shirts',
    price: 145,
    discountPrice: 115,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sage Breeze', hex: '#8C9A86' },
      { name: 'Ecru Sand', hex: '#E7DFD3' },
      { name: 'Coastal Navy', hex: '#212A3E' }
    ],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.8,
    reviewCount: 33,
    stock: 22,
    description: 'Sun-drenched relaxed luxury. Garment-dyed and stone-washed for immediate softness and that nonchalant Riviera drape.',
    details: {
      material: '100% Certified French Normandy Linen',
      fit: 'Relaxed contemporary resort fit with chest patch pocket',
      care: 'Machine wash gentle cold, hang to dry, warm iron if desired',
      modelInfo: 'Model is 6’0” wearing size M'
    },
    isNewArrival: true,
    tags: ['shirt', 'linen', 'summer', 'resort', 'casual', 'men']
  },
  {
    id: 'zen-m-003',
    name: 'Sorrento Pleated Gurkha Chinos',
    tagline: 'Double front pleats with extended waistband buckle closure',
    gender: 'men',
    category: 'trousers',
    price: 170,
    discountPrice: 135,
    sizes: ['30', '32', '34', '36', '38'],
    colors: [
      { name: 'Olive Drab', hex: '#4A5340' },
      { name: 'Safari Khaki', hex: '#C2B299' },
      { name: 'Midnight Navy', hex: '#1B2430' }
    ],
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.7,
    reviewCount: 28,
    stock: 19,
    description: 'Old-money elegance with tactical sartorial precision. Built with side adjusters that eliminate the need for a belt while delivering a clean silhouette.',
    details: {
      material: '97% Long-staple Pima Cotton, 3% Stretch Lycra',
      fit: 'Tapered leg with comfortable thigh room and 2-inch turn-up cuffs',
      care: 'Machine wash cold inside out, medium iron',
      modelInfo: 'Model is 6’1” wearing size 32'
    },
    isTrending: true,
    tags: ['trousers', 'chinos', 'gurkha', 'pleated', 'smart-casual']
  },
  {
    id: 'zen-m-004',
    name: 'Vanguard Raw Selvedge Denim',
    tagline: '14.5oz Japanese Kurabo Mills shuttle-loom selvedge',
    gender: 'men',
    category: 'jeans',
    price: 190,
    discountPrice: 160,
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Deep Indigo Selvedge', hex: '#152238' },
      { name: 'Washed Charcoal', hex: '#2C3038' }
    ],
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    reviewCount: 57,
    stock: 17,
    description: 'Woven on vintage 1960s shuttle looms in Okayama, Japan. Distinct red-line ticker selvedge ID, custom copper hardware, and hidden back-pocket rivets.',
    details: {
      material: '100% Ringspun Cotton, 14.5oz Indigo Warp',
      fit: 'Slim-straight cut; break-in produces custom personal fades',
      care: 'Wash inside-out in cold water infrequently; hang dry',
      modelInfo: 'Model is 6’0” wearing 32x32'
    },
    isBestSeller: true,
    tags: ['jeans', 'denim', 'selvedge', 'japanese-denim', 'casual']
  },
  {
    id: 'zen-m-005',
    name: 'Viceroy Raw Silk Bandhgala Sherwani',
    tagline: 'Regal Mandarin collar with hand-carved enamel buttons',
    gender: 'men',
    category: 'ethnic',
    price: 480,
    discountPrice: 395,
    sizes: ['38', '40', '42', '44'],
    colors: [
      { name: 'Royal Ivory Brocade', hex: '#F4ECE1' },
      { name: 'Imperial Forest Green', hex: '#1C3127' }
    ],
    images: [
      'https://images.unsplash.com/photo-1583391733975-d85c88b20921?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 5.0,
    reviewCount: 22,
    stock: 7,
    description: 'Impeccable royal tailoring for wedding celebrations and black-tie cultural galas. Handwoven Banarasi raw silk with tonal jacquard motifs.',
    details: {
      material: 'Handcrafted Banarasi Silk with Pure Silk lining',
      fit: 'Structured structured shoulder, tapered waist silhouette',
      care: 'Specialist dry clean only',
      modelInfo: 'Model is 6’2” wearing size 40'
    },
    isSeasonal: true,
    tags: ['ethnic', 'sherwani', 'bandhgala', 'wedding', 'groom', 'luxury']
  },
  {
    id: 'zen-m-006',
    name: 'Monolith Heavyweight Supima Tee',
    tagline: '280gsm Californian Supima cotton with zero-torque drape',
    gender: 'men',
    category: 't-shirts',
    price: 65,
    discountPrice: 48,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Pristine White', hex: '#F9F9F9' },
      { name: 'Pitch Black', hex: '#121212' },
      { name: 'Warm Taupe', hex: '#A89F91' }
    ],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.8,
    reviewCount: 89,
    stock: 40,
    description: 'The heavyweight basic perfected. Engineered with interlocking knit construction that holds its neckline wash after wash.',
    details: {
      material: '100% Certified Extra-Long Staple Supima Cotton (280 GSM)',
      fit: 'Relaxed boxy silhouette with drop shoulder',
      care: 'Machine wash warm, tumble dry low or line dry',
      modelInfo: 'Model is 6’1” wearing size L'
    },
    isBestSeller: true,
    tags: ['t-shirt', 'tee', 'basics', 'minimal', 'cotton']
  },
  {
    id: 'zen-u-001',
    name: 'Vesper Cashmere-Modal Scarf',
    tagline: 'Featherweight warmth woven with eyelash fringe edges',
    gender: 'unisex',
    category: 'accessories',
    price: 95,
    discountPrice: 75,
    sizes: ['One Size'],
    colors: [
      { name: 'Oatmeal Heather', hex: '#D6CFC4' },
      { name: 'Charcoal Shadow', hex: '#373A3E' },
      { name: 'Gilded Ochre', hex: '#C29845' }
    ],
    images: [
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    reviewCount: 41,
    stock: 30,
    description: 'An all-season unisex staple. Blends buttery inner-Mongolian cashmere with breathable modal to shield you from chills in airplanes and winter evenings.',
    details: {
      material: '50% Cashmere, 50% Modal',
      fit: 'Generous 200cm x 75cm proportion for versatile wrapping',
      care: 'Hand wash cool with wool bath, dry flat',
      modelInfo: 'Unisex styling'
    },
    isNewArrival: true,
    tags: ['accessories', 'scarf', 'cashmere', 'unisex', 'winter']
  },
  {
    id: 'zen-u-002',
    name: 'Aviator Minimalist Gold Chronograph',
    tagline: 'Sapphire crystal glass with Swiss quartz movement',
    gender: 'unisex',
    category: 'accessories',
    price: 295,
    discountPrice: 245,
    sizes: ['One Size (40mm)'],
    colors: [
      { name: 'Brushed Gold & Black', hex: '#D4AF37' },
      { name: 'Silver & Alabaster', hex: '#E2E2E2' }
    ],
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 5.0,
    reviewCount: 36,
    stock: 14,
    description: 'Clean architectural dial without clutter. Finished in 18k champagne gold PVD plating with a surgical 316L stainless steel case and genuine leather strap.',
    details: {
      material: '316L Stainless Steel, 18K Gold PVD, Italian Leather Strap',
      fit: '40mm case diameter, 7.5mm ultra-slim profile, 5ATM water resistant',
      care: 'Avoid prolonged water submersion',
      modelInfo: '2-Year International Warranty Included'
    },
    isBestSeller: true,
    tags: ['accessories', 'watch', 'gold', 'minimal', 'unisex']
  }
];

const initialUsers: User[] = [
  {
    id: 'usr-admin-01',
    email: 'admin@zenvora.com',
    name: 'Victoria Zenvora',
    password: 'admin123',
    role: 'admin',
    phone: '+1 555-0199',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    savedAddresses: [
      {
        id: 'addr-01',
        fullName: 'Victoria Zenvora',
        street: '742 Evergreen Terrace, Penthouse B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States',
        phone: '+1 555-0199',
        isDefault: true
      }
    ],
    createdAt: '2025-01-15T08:00:00.000Z'
  },
  {
    id: 'usr-cust-02',
    email: 'customer@zenvora.com',
    name: 'Julian Vance',
    password: 'customer123',
    role: 'customer',
    phone: '+1 555-0144',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    savedAddresses: [
      {
        id: 'addr-02',
        fullName: 'Julian Vance',
        street: '450 Sunset Boulevard, Suite 12',
        city: 'Beverly Hills',
        state: 'CA',
        postalCode: '90210',
        country: 'United States',
        phone: '+1 555-0144',
        isDefault: true
      }
    ],
    createdAt: '2025-02-10T14:30:00.000Z'
  }
];

const initialOrders: Order[] = [
  {
    id: 'ORD-2026-9810',
    userId: 'usr-cust-02',
    customerName: 'Julian Vance',
    customerEmail: 'customer@zenvora.com',
    customerPhone: '+1 555-0144',
    items: [
      {
        productId: 'zen-m-001',
        productName: 'Atelier Milanese Wool-Cashmere Overcoat',
        image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=500&q=80',
        size: 'L',
        color: 'Tuscan Camel',
        price: 360,
        quantity: 1
      },
      {
        productId: 'zen-u-001',
        productName: 'Vesper Cashmere-Modal Scarf',
        image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=500&q=80',
        size: 'One Size',
        color: 'Gilded Ochre',
        price: 75,
        quantity: 1
      }
    ],
    subtotal: 435,
    discount: 40,
    shipping: 0,
    tax: 31.6,
    total: 426.6,
    couponCode: 'ZENLUXE40',
    shippingAddress: {
      id: 'addr-02',
      fullName: 'Julian Vance',
      street: '450 Sunset Boulevard, Suite 12',
      city: 'Beverly Hills',
      state: 'CA',
      postalCode: '90210',
      country: 'United States',
      phone: '+1 555-0144'
    },
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    trackingNumber: 'ZV-EXP-88902194',
    timeline: [
      { title: 'Order Placed', date: '2026-10-25 10:14 AM', description: 'Order successfully confirmed & charged.', completed: true },
      { title: 'Tailoring & QC Verification', date: '2026-10-25 03:30 PM', description: 'Hand inspection passed all luxury quality checks.', completed: true },
      { title: 'Dispatched via DHL Express', date: '2026-10-26 09:00 AM', description: 'Package in transit from Florence Distribution Hub.', completed: true },
      { title: 'Out for Delivery', date: 'Estimated Oct 28', description: 'Courier will deliver between 10 AM - 2 PM.', completed: false },
      { title: 'Delivered', date: 'Pending', description: 'Signed signature upon arrival.', completed: false }
    ],
    createdAt: '2026-10-25T10:14:00.000Z'
  },
  {
    id: 'ORD-2026-9742',
    userId: 'usr-cust-02',
    customerName: 'Julian Vance',
    customerEmail: 'customer@zenvora.com',
    customerPhone: '+1 555-0144',
    items: [
      {
        productId: 'zen-m-004',
        productName: 'Vanguard Raw Selvedge Denim',
        image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=500&q=80',
        size: '32',
        color: 'Deep Indigo Selvedge',
        price: 160,
        quantity: 1
      }
    ],
    subtotal: 160,
    discount: 16,
    shipping: 0,
    tax: 11.52,
    total: 155.52,
    couponCode: 'WELCOME10',
    shippingAddress: {
      id: 'addr-02',
      fullName: 'Julian Vance',
      street: '450 Sunset Boulevard, Suite 12',
      city: 'Beverly Hills',
      state: 'CA',
      postalCode: '90210',
      country: 'United States',
      phone: '+1 555-0144'
    },
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    trackingNumber: 'ZV-DEL-77381203',
    timeline: [
      { title: 'Order Placed', date: '2026-10-18 02:40 PM', description: 'Order confirmed.', completed: true },
      { title: 'Dispatched', date: '2026-10-19 11:00 AM', description: 'Handed to courier.', completed: true },
      { title: 'Delivered', date: '2026-10-21 04:15 PM', description: 'Package safely received by concierge.', completed: true }
    ],
    createdAt: '2026-10-18T14:40:00.000Z'
  }
];

const initialCoupons: Coupon[] = [
  {
    code: 'ZENLUXE40',
    discountPercent: 40,
    maxDiscount: 100,
    minSpend: 150,
    expiryDate: '2026-12-31',
    description: 'Special 40% VIP Luxury seasonal concession on orders over $150',
    isActive: true
  },
  {
    code: 'WELCOME10',
    discountPercent: 10,
    minSpend: 50,
    expiryDate: '2026-12-31',
    description: '10% off your initial bespoke purchase',
    isActive: true
  },
  {
    code: 'GOLD25',
    discountPercent: 25,
    minSpend: 200,
    expiryDate: '2026-11-30',
    description: '25% celebration savings on premium collections',
    isActive: true
  }
];

const initialReviews: Review[] = [
  {
    id: 'rev-01',
    productId: 'zen-w-001',
    productName: 'Aurelia Silk Bias Slip Gown',
    userName: 'Elena Rostova',
    rating: 5,
    title: 'Breathtaking drape & unparalleled quality',
    comment: 'Wore this to an anniversary banquet in Milan. The heavy silk glides without clinging, and the champagne tone has the softest golden luster under evening lights.',
    verifiedBuyer: true,
    createdAt: '2026-10-20'
  },
  {
    id: 'rev-02',
    productId: 'zen-m-001',
    productName: 'Atelier Milanese Wool-Cashmere Overcoat',
    userName: 'Marcus Thorne',
    rating: 5,
    title: 'Savile Row caliber at an honest price',
    comment: 'The shoulders fit like a glove, and the weight of the wool-cashmere blend is substantial. Truly feels like wearing confidence.',
    verifiedBuyer: true,
    createdAt: '2026-10-15'
  },
  {
    id: 'rev-03',
    productId: 'zen-w-006',
    productName: 'Seraphina Sculpted Leather Crossbody',
    userName: 'Sophia L.',
    rating: 5,
    title: 'Pure Italian craftsmanship',
    comment: 'The leather smells intoxicating and the champagne gold hardware is understated rather than loud. Gets compliments every single day.',
    verifiedBuyer: true,
    createdAt: '2026-10-22'
  }
];

// Persistent state class
class ZenvoraDB {
  public products: Product[] = [...initialProducts];
  public users: User[] = [...initialUsers];
  public orders: Order[] = [...initialOrders];
  public coupons: Coupon[] = [...initialCoupons];
  public reviews: Review[] = [...initialReviews];
  public contactMessages: ContactMessage[] = [];

  constructor() {
    this.loadFromFile();
  }

  private getFilePath(): string {
    return path.resolve(process.cwd(), '.zenvora-db.json');
  }

  public saveToFile() {
    try {
      const data = {
        products: this.products,
        users: this.users,
        orders: this.orders,
        coupons: this.coupons,
        reviews: this.reviews,
        contactMessages: this.contactMessages
      };
      fs.writeFileSync(this.getFilePath(), JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not persist to file, continuing in-memory:', e);
    }
  }

  public loadFromFile() {
    try {
      const p = this.getFilePath();
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.products && Array.isArray(parsed.products)) this.products = parsed.products;
        if (parsed.users && Array.isArray(parsed.users)) this.users = parsed.users;
        if (parsed.orders && Array.isArray(parsed.orders)) this.orders = parsed.orders;
        if (parsed.coupons && Array.isArray(parsed.coupons)) this.coupons = parsed.coupons;
        if (parsed.reviews && Array.isArray(parsed.reviews)) this.reviews = parsed.reviews;
        if (parsed.contactMessages && Array.isArray(parsed.contactMessages)) this.contactMessages = parsed.contactMessages;
      }
    } catch (e) {
      console.warn('Error reading stored DB, using seeds:', e);
    }
  }
}

export const db = new ZenvoraDB();
