import { GoogleGenAI } from '@google/genai';
import { db, Product } from './db';

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  recommendedProductIds?: string[];
}

export async function generateFashionAdvice(
  userMessage: string,
  history: { role: string; content: string }[],
  currentProductContext?: Product | null
): Promise<{ reply: string; recommendedProducts: Product[] }> {
  const products = db.products;
  const productCatalogSummary = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    gender: p.gender,
    price: p.discountPrice || p.price,
    tags: p.tags,
    colors: p.colors.map(c => c.name),
    tagline: p.tagline
  }));

  const systemInstruction = `
You are the elite AI Fashion Stylist & Personal Shopper for "Zenvora" (Tagline: "Fashion Meets Confidence.").
Brand Aesthetic: Luxury, elegant, modern minimalism, warm tones, quiet luxury, tailored sophistication.

Store Policies:
- Free express shipping worldwide on orders above $100 (standard delivery 3-5 business days).
- 30-day effortless returns and exchanges in original luxury packaging.
- Available currencies: USD ($).
- All items are crafted from premium materials (Mulberry Silk, Italian Virgin Wool, French Linen, Japanese Selvedge Denim, Supima Cotton).

Available Products in Zenvora Catalog:
${JSON.stringify(productCatalogSummary, null, 2)}

Instructions:
1. Speak with warmth, refined taste, and authoritative fashion acumen. Be encouraging and styling-focused.
2. Recommend outfits according to occasion, budget, season, and body proportions.
3. When matching or recommending items, always suggest real items from the Zenvora catalog with their exact product ID.
4. Answer questions about size fitting, fabric care, order tracking, and store policies clearly.
5. In your response, if you recommend any items from the catalog, list their IDs at the very bottom in a single line formatted as:
[RECOMMENDED_PRODUCTS: id1, id2]
(e.g., [RECOMMENDED_PRODUCTS: zen-w-001, zen-w-006]).
${currentProductContext ? `The customer is currently viewing the item: "${currentProductContext.name}" (${currentProductContext.category}, $${currentProductContext.discountPrice || currentProductContext.price}). Offer styling combinations to pair with this piece.` : ''}
Keep your tone elevated yet accessible and keep paragraphs concise.
`;

  const ai = getAI();
  if (ai) {
    try {
      // Build conversation contents
      const conversationContents = [
        ...history.slice(-8).map((h) => `${h.role === 'user' ? 'Customer' : 'Stylist'}: ${h.content}`),
        `Customer: ${userMessage}`
      ].join('\n\n');

      const apiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: conversationContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('AI request timeout')), 6000)
      );

      const response: any = await Promise.race([apiPromise, timeoutPromise]);

      const fullText = response.text || "I'd be thrilled to assist you with finding your perfect ensemble. How would you like to elevate your style today?";
      
      // Extract recommended product IDs
      const match = fullText.match(/\[RECOMMENDED_PRODUCTS:\s*([^\]]+)\]/i);
      let recommendedProducts: Product[] = [];
      let cleanedReply = fullText;

      if (match && match[1]) {
        const ids = match[1].split(',').map((s: string) => s.trim());
        recommendedProducts = products.filter(p => ids.includes(p.id));
        cleanedReply = fullText.replace(/\[RECOMMENDED_PRODUCTS:\s*[^\]]+\]/gi, '').trim();
      }

      // If no explicit tags were extracted but words match specific product keywords, find top matches
      if (recommendedProducts.length === 0) {
        recommendedProducts = findRelevantProducts(userMessage, products).slice(0, 3);
      }

      return {
        reply: cleanedReply,
        recommendedProducts,
      };
    } catch (err) {
      console.error('Gemini API call failed, falling back to local styling engine:', err);
    }
  }

  // Intelligent fallback engine when offline or no API key
  return fallbackStylist(userMessage, products, currentProductContext);
}

function findRelevantProducts(query: string, products: Product[]): Product[] {
  const q = query.toLowerCase();
  return products.filter((p) => {
    return (
      q.includes(p.name.toLowerCase()) ||
      q.includes(p.category.toLowerCase()) ||
      q.includes(p.gender) ||
      p.tags.some(t => q.includes(t)) ||
      (q.includes('dress') && p.category === 'dresses') ||
      (q.includes('blazer') && p.category === 'jackets') ||
      (q.includes('suit') && (p.category === 'jackets' || p.category === 'trousers')) ||
      (q.includes('wedding') && (p.category === 'ethnic' || p.category === 'dresses')) ||
      (q.includes('coat') && p.id === 'zen-m-001') ||
      (q.includes('bag') && p.id === 'zen-w-006') ||
      (q.includes('watch') && p.id === 'zen-u-002')
    );
  });
}

function fallbackStylist(
  message: string,
  products: Product[],
  currentProduct?: Product | null
): { reply: string; recommendedProducts: Product[] } {
  const lower = message.toLowerCase();

  if (currentProduct) {
    // Recommend complements
    const complements = products.filter(p => p.id !== currentProduct.id && (p.gender === currentProduct.gender || p.gender === 'unisex')).slice(0, 3);
    return {
      reply: `For pairing with your **${currentProduct.name}**, I recommend balancing the silhouette with understated luxury staples. Consider these complementary pieces curated specifically for this look:`,
      recommendedProducts: complements
    };
  }

  if (lower.includes('wedding') || lower.includes('party') || lower.includes('festive') || lower.includes('ethnic') || lower.includes('reception')) {
    const picks = products.filter(p => p.category === 'ethnic' || p.category === 'dresses').slice(0, 3);
    return {
      reply: "For celebrations and gala events, confidence shines in rich fabrics and regal cuts. Here are our top curated evening and festive ensembles featuring pure silk and hand-finished craftsmanship:",
      recommendedProducts: picks
    };
  }

  if (lower.includes('work') || lower.includes('office') || lower.includes('formal') || lower.includes('interview') || lower.includes('meeting')) {
    const picks = products.filter(p => p.category === 'jackets' || p.category === 'trousers').slice(0, 3);
    return {
      reply: "Boardroom elegance demands crisp tailoring with breathable Italian fabrics. I recommend our structured blazers paired with high-waisted pleated trousers for an authoritative yet effortless look:",
      recommendedProducts: picks
    };
  }

  if (lower.includes('track') || lower.includes('order') || lower.includes('delivery') || lower.includes('status')) {
    return {
      reply: "You can track your order at any time through your Zenvora Account under **Order History**, or click the 'Track Order' button on your confirmation receipt. Standard delivery takes 3-5 business days via DHL Express with signature confirmation.",
      recommendedProducts: []
    };
  }

  if (lower.includes('size') || /\bfit\b/i.test(lower) || lower.includes('measurement')) {
    return {
      reply: "All Zenvora garments follow precise European sizing. Our tailored blazers feature a true-to-size sculpted fit, while our linen shirts and Supima tees boast an effortless contemporary drape. You can also view exact measurements on any product detail page by clicking 'Size & Fit Guide'.",
      recommendedProducts: []
    };
  }

  if (lower.includes('men') || lower.includes('man') || lower.includes('gentleman')) {
    const picks = products.filter(p => p.gender === 'men').slice(0, 3);
    return {
      reply: "Here are the cornerstone pieces from our latest Men's Sartorial Collection—from the Milanese Wool-Cashmere Overcoat to our Japanese Selvedge Denim:",
      recommendedProducts: picks
    };
  }

  if (lower.includes('women') || lower.includes('lady') || lower.includes('dress')) {
    const picks = products.filter(p => p.gender === 'women').slice(0, 3);
    return {
      reply: "Discover our Women's Collection highlights—crafted with pure mulberry silk, sculptural tailoring, and fluid drape:",
      recommendedProducts: picks
    };
  }

  // Default recommendation
  const trending = products.filter(p => p.isTrending || p.isBestSeller).slice(0, 3);
  return {
    reply: "Welcome to Zenvora. 'Fashion Meets Confidence.' Tell me about the occasion or vibe you are dressing for—whether it's an evening gala, boardroom elegance, a weekend retreat, or building a timeless capsule wardrobe. Here are our current coveted bestsellers:",
    recommendedProducts: trending
  };
}
