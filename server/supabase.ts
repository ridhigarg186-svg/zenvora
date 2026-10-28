import { createClient } from '@supabase/supabase-js';
import { Order } from './db';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://kvzlznatxrstgjorhnor.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_Rs7Jy4NuWq_UvrputX_YeQ_T_gIh159';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
  },
});

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('orders').select('*').limit(1);
    if (error) {
      return { connected: true, tableFound: false, message: error.message };
    }
    return { connected: true, tableFound: true, count: data?.length ?? 0 };
  } catch (err: any) {
    return { connected: false, message: err.message };
  }
}

export async function saveOrderToSupabase(order: Order): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // 1. Primary insertion format matching standard Supabase columns
    const record = {
      id: order.id,
      user_id: order.userId,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone || '',
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      coupon_code: order.couponCode || null,
      shipping_address: order.shippingAddress,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      order_status: order.orderStatus,
      tracking_number: order.trackingNumber,
      timeline: order.timeline,
      created_at: order.createdAt || new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([record])
      .select();

    if (error) {
      console.warn('[Supabase] Standard insert error:', error.message);
      
      // Fallback attempt: if user created table with camelCase columns
      const camelRecord = {
        id: order.id,
        userId: order.userId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone || '',
        items: JSON.stringify(order.items),
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        couponCode: order.couponCode || null,
        shippingAddress: JSON.stringify(order.shippingAddress),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        trackingNumber: order.trackingNumber,
        timeline: JSON.stringify(order.timeline),
        createdAt: order.createdAt || new Date().toISOString(),
      };

      const fallbackRes = await supabase.from('orders').insert([camelRecord]).select();
      if (fallbackRes.error) {
        console.error('[Supabase] Both snake_case and camelCase inserts encountered error:', fallbackRes.error.message);
        return { success: false, error: fallbackRes.error.message };
      }

      console.log('[Supabase] Successfully saved order via camelCase format:', order.id);
      return { success: true, data: fallbackRes.data };
    }

    console.log('[Supabase] Successfully saved order to Supabase "orders" table:', order.id);
    return { success: true, data };
  } catch (err: any) {
    console.error('[Supabase] Exception saving order:', err.message);
    return { success: false, error: err.message };
  }
}

export async function fetchSupabaseOrders(): Promise<Order[] | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return null;
    }

    return data.map((row: any) => ({
      id: row.id,
      userId: row.user_id || row.userId || 'guest',
      customerName: row.customer_name || row.customerName || 'Customer',
      customerEmail: row.customer_email || row.customerEmail || '',
      customerPhone: row.customer_phone || row.customerPhone || '',
      items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items || [],
      subtotal: Number(row.subtotal) || 0,
      discount: Number(row.discount) || 0,
      shipping: Number(row.shipping) || 0,
      tax: Number(row.tax) || 0,
      total: Number(row.total) || 0,
      couponCode: row.coupon_code || row.couponCode,
      shippingAddress: typeof row.shipping_address === 'string' ? JSON.parse(row.shipping_address) : (row.shipping_address || row.shippingAddress),
      paymentMethod: row.payment_method || row.paymentMethod || 'card',
      paymentStatus: row.payment_status || row.paymentStatus || 'paid',
      orderStatus: row.order_status || row.orderStatus || 'confirmed',
      trackingNumber: row.tracking_number || row.trackingNumber || '',
      timeline: typeof row.timeline === 'string' ? JSON.parse(row.timeline) : (row.timeline || []),
      createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    }));
  } catch (err) {
    console.warn('[Supabase] Fetch orders error:', err);
    return null;
  }
}
