import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db, Product, Order, User, Coupon, Review, ContactMessage } from './server/db';
import { generateFashionAdvice } from './server/ai';
import { saveOrderToSupabase, testSupabaseConnection, fetchSupabaseOrders } from './server/supabase';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API Routes

// 1. Products
app.get('/api/products', (req, res) => {
  let list = [...db.products];
  const { gender, category, search, sort, minPrice, maxPrice, collection } = req.query;

  if (gender && gender !== 'all') {
    list = list.filter((p) => p.gender === gender || p.gender === 'unisex');
  }

  if (category && category !== 'all') {
    list = list.filter((p) => p.category === category);
  }

  if (collection) {
    if (collection === 'trending') list = list.filter((p) => p.isTrending);
    if (collection === 'new') list = list.filter((p) => p.isNewArrival);
    if (collection === 'bestseller') list = list.filter((p) => p.isBestSeller);
    if (collection === 'seasonal') list = list.filter((p) => p.isSeasonal);
  }

  if (minPrice) {
    list = list.filter((p) => (p.discountPrice || p.price) >= Number(minPrice));
  }

  if (maxPrice) {
    list = list.filter((p) => (p.discountPrice || p.price) <= Number(maxPrice));
  }

  if (search) {
    const s = String(search).toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.tagline.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        p.tags.some((t) => t.toLowerCase().includes(s))
    );
  }

  // Sorting
  if (sort === 'price-low') {
    list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (sort === 'price-high') {
    list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'newest') {
    list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
  }

  res.json({ products: list, total: list.length });
});

app.get('/api/products/:id', (req, res) => {
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  // Also find related products in the same category or gender
  const related = db.products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
    .slice(0, 4);

  res.json({ product, related });
});

// Admin product mutation
app.post('/api/products', (req, res) => {
  const newProduct: Product = {
    ...req.body,
    id: req.body.id || `zen-p-${Date.now()}`,
    rating: req.body.rating || 5.0,
    reviewCount: req.body.reviewCount || 1,
  };
  db.products.unshift(newProduct);
  db.saveToFile();
  res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  db.products[index] = { ...db.products[index], ...req.body };
  db.saveToFile();
  res.json({ success: true, product: db.products[index] });
});

app.delete('/api/products/:id', (req, res) => {
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  db.products.splice(index, 1);
  db.saveToFile();
  res.json({ success: true });
});

// 2. Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    res.status(401).json({ error: 'Invalid email or password. Try customer@zenvora.com or admin@zenvora.com' });
    return;
  }

  // Return user without password
  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser, token: `token_${user.id}_${Date.now()}` });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name, phone } = req.body;
  if (!email || !password || !name) {
    res.status(400).json({ error: 'Name, email, and password are required.' });
    return;
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(400).json({ error: 'Account with this email already exists.' });
    return;
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    email,
    password,
    name,
    phone: phone || '',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    savedAddresses: [],
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  db.saveToFile();

  const { password: _, ...safeUser } = newUser;
  res.status(201).json({ success: true, user: safeUser, token: `token_${newUser.id}_${Date.now()}` });
});

app.put('/api/auth/profile', (req, res) => {
  const { id, name, phone, savedAddresses } = req.body;
  const user = db.users.find((u) => u.id === id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (savedAddresses) user.savedAddresses = savedAddresses;

  db.saveToFile();
  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

app.get('/api/users', (req, res) => {
  // Admin only
  const safeUsers = db.users.map(({ password, ...u }) => u);
  res.json({ users: safeUsers });
});

// 3. Orders
app.get('/api/orders', (req, res) => {
  const { userId, role } = req.query;
  if (role === 'admin') {
    res.json({ orders: db.orders });
    return;
  }

  if (userId) {
    const userOrders = db.orders.filter((o) => o.userId === userId);
    res.json({ orders: userOrders });
    return;
  }

  res.json({ orders: db.orders });
});

app.post('/api/orders', async (req, res) => {
  const { userId, customerName, customerEmail, customerPhone, items, subtotal, discount, shipping, tax, total, couponCode, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400).json({ error: 'Order must contain items' });
    return;
  }

  const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const trackingNumber = `ZV-${paymentMethod === 'card' ? 'EXP' : 'STD'}-${Math.floor(10000000 + Math.random() * 90000000)}`;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newOrder: Order = {
    id: orderId,
    userId: userId || 'guest',
    customerName: customerName || 'Valued Guest',
    customerEmail: customerEmail || 'guest@zenvora.com',
    customerPhone: customerPhone || '',
    items,
    subtotal: Number(subtotal),
    discount: Number(discount || 0),
    shipping: Number(shipping || 0),
    tax: Number(tax || 0),
    total: Number(total),
    couponCode: couponCode || undefined,
    shippingAddress,
    paymentMethod: paymentMethod || 'card',
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    orderStatus: 'confirmed',
    trackingNumber,
    timeline: [
      { title: 'Order Placed', date: dateStr, description: 'Order successfully authorized & recorded.', completed: true },
      { title: 'Order Confirmed', date: dateStr, description: 'Sent to Zenvora Atelier for bespoke packing.', completed: true },
      { title: 'Dispatched via Courier', date: 'Expected within 24h', description: 'Will be sealed with tamper-proof security stamp.', completed: false },
      { title: 'Out for Delivery', date: 'Expected in 3-5 days', description: 'Delivered in luxury signature box.', completed: false },
      { title: 'Delivered', date: 'Pending arrival', description: 'Delivered with signature proof.', completed: false }
    ],
    createdAt: now.toISOString()
  };

  // Decrement stock for ordered items
  items.forEach((item: { productId: string; quantity: number }) => {
    const prod = db.products.find(p => p.id === item.productId);
    if (prod && prod.stock > 0) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  });

  db.orders.unshift(newOrder);
  db.saveToFile();

  // Persist order in Supabase backend table
  const supabaseSync = await saveOrderToSupabase(newOrder);

  res.status(201).json({ 
    success: true, 
    order: newOrder,
    supabaseSync: {
      projectId: 'kvzlznatxrstgjorhnor',
      synced: supabaseSync.success,
      details: supabaseSync.data || supabaseSync.error || null
    }
  });
});

// Supabase Status Endpoint
app.get('/api/supabase/status', async (req, res) => {
  const status = await testSupabaseConnection();
  res.json({
    projectId: 'kvzlznatxrstgjorhnor',
    url: 'https://kvzlznatxrstgjorhnor.supabase.co',
    ...status
  });
});

app.put('/api/orders/:id/status', (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  if (orderStatus) {
    order.orderStatus = orderStatus;
    // Update timeline steps
    if (orderStatus === 'shipped') {
      order.timeline.forEach((step, idx) => {
        if (idx <= 2) step.completed = true;
      });
    } else if (orderStatus === 'delivered') {
      order.timeline.forEach((step) => (step.completed = true));
    }
  }

  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }

  db.saveToFile();
  res.json({ success: true, order });
});

// 4. Coupons
app.get('/api/coupons', (req, res) => {
  res.json({ coupons: db.coupons });
});

app.post('/api/coupons/verify', (req, res) => {
  const { code, cartTotal } = req.body;
  const coupon = db.coupons.find(
    (c) => c.code.toUpperCase() === String(code).trim().toUpperCase() && c.isActive
  );

  if (!coupon) {
    res.status(400).json({ error: 'Invalid or expired promotional code.' });
    return;
  }

  if (cartTotal < coupon.minSpend) {
    res.status(400).json({
      error: `This code requires a minimum spend of $${coupon.minSpend}. Current subtotal: $${cartTotal}.`
    });
    return;
  }

  let discount = (cartTotal * coupon.discountPercent) / 100;
  if (coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }

  res.json({
    success: true,
    code: coupon.code,
    discountPercent: coupon.discountPercent,
    discountAmount: Math.round(discount * 100) / 100,
    description: coupon.description
  });
});

app.post('/api/coupons', (req, res) => {
  const { code, discountPercent, minSpend, maxDiscount, description, expiryDate } = req.body;
  const existing = db.coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
  if (existing) {
    res.status(400).json({ error: 'Coupon code already exists.' });
    return;
  }

  const newCoupon: Coupon = {
    code: code.toUpperCase().trim(),
    discountPercent: Number(discountPercent),
    minSpend: Number(minSpend || 0),
    maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
    description: description || `${discountPercent}% off`,
    expiryDate: expiryDate || '2026-12-31',
    isActive: true
  };

  db.coupons.push(newCoupon);
  db.saveToFile();
  res.status(201).json({ success: true, coupon: newCoupon });
});

app.delete('/api/coupons/:code', (req, res) => {
  const index = db.coupons.findIndex(c => c.code.toUpperCase() === req.params.code.toUpperCase());
  if (index === -1) {
    res.status(404).json({ error: 'Coupon not found' });
    return;
  }
  db.coupons.splice(index, 1);
  db.saveToFile();
  res.json({ success: true });
});

// 5. Reviews
app.get('/api/reviews', (req, res) => {
  const { productId } = req.query;
  if (productId) {
    const list = db.reviews.filter(r => r.productId === productId);
    res.json({ reviews: list });
    return;
  }
  res.json({ reviews: db.reviews });
});

app.post('/api/reviews', (req, res) => {
  const { productId, productName, userName, rating, title, comment } = req.body;
  const newRev: Review = {
    id: `rev-${Date.now()}`,
    productId,
    productName,
    userName: userName || 'Verified Client',
    rating: Number(rating) || 5,
    title: title || 'Exceptional Quality',
    comment,
    verifiedBuyer: true,
    createdAt: new Date().toISOString().split('T')[0]
  };

  db.reviews.unshift(newRev);

  // Recalculate product rating if associated with a product
  if (productId) {
    const p = db.products.find(prod => prod.id === productId);
    if (p) {
      const prodRevs = db.reviews.filter(r => r.productId === productId);
      const avg = prodRevs.reduce((acc, r) => acc + r.rating, 0) / prodRevs.length;
      p.rating = Math.round(avg * 10) / 10;
      p.reviewCount = prodRevs.length;
    }
  }

  db.saveToFile();
  res.status(201).json({ success: true, review: newRev });
});

app.delete('/api/reviews/:id', (req, res) => {
  const idx = db.reviews.findIndex(r => r.id === req.params.id);
  if (idx !== -1) {
    db.reviews.splice(idx, 1);
    db.saveToFile();
  }
  res.json({ success: true });
});

// 6. Contact Inquiries
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  const inquiry: ContactMessage = {
    id: `msg-${Date.now()}`,
    name,
    email,
    subject: subject || 'General Concierge Inquiry',
    message,
    createdAt: new Date().toISOString(),
    status: 'unread'
  };

  db.contactMessages.unshift(inquiry);
  db.saveToFile();
  res.status(201).json({ success: true, message: 'Your message has been received by the Zenvora concierge team.' });
});

app.get('/api/contact', (req, res) => {
  res.json({ messages: db.contactMessages });
});

// 7. Admin Analytics
app.get('/api/admin/analytics', (req, res) => {
  const totalRevenue = db.orders.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalOrders = db.orders.length;
  const totalCustomers = db.users.filter(u => u.role === 'customer').length;
  const totalProducts = db.products.length;
  const lowStockProducts = db.products.filter(p => p.stock <= 10);

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  db.products.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  // Recent 5 orders
  const recentOrders = db.orders.slice(0, 5);

  res.json({
    metrics: {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      totalCustomers: totalCustomers + 14, // seed baseline
      totalProducts,
      averageOrderValue: totalOrders ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0,
      lowStockCount: lowStockProducts.length
    },
    categoryDistribution: categoryCounts,
    lowStockProducts,
    recentOrders
  });
});

// 8. AI Fashion Assistant
app.post('/api/ai/chat', async (req, res) => {
  const { message, history, currentProduct } = req.body;
  if (!message) {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  try {
    const result = await generateFashionAdvice(message, history || [], currentProduct);
    res.json(result);
  } catch (err: any) {
    console.error('Error generating fashion advice:', err);
    res.status(500).json({
      reply: "Our stylist service is momentarily refreshing. What look can I assist you in crafting today?",
      recommendedProducts: db.products.slice(0, 3)
    });
  }
});

// Serve Frontend
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Zenvora] Full-Stack luxury fashion server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
