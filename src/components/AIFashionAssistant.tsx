import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  RotateCcw, 
  ShoppingBag, 
  ExternalLink, 
  MessageSquare,
  Bot,
  User as UserIcon,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendedProducts?: Product[];
  timestamp: string;
}

export const AIFashionAssistant: React.FC = () => {
  const { 
    isAiOpen, 
    setIsAiOpen, 
    aiInitialPrompt, 
    aiContextProduct, 
    openProductDetail, 
    addToCart 
  } = useShop();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-01',
      role: 'assistant',
      content: "Hello! I am your Zenvora AI Fashion Stylist & Personal Shopper. Whether you're dressing for an evening gala, boardroom meeting, casual weekend, or looking for matching pieces, I'm here to curate your look.",
      timestamp: 'Just now'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isAiOpen, messages, loading]);

  // Handle triggered prompts from other entry points
  useEffect(() => {
    if (aiInitialPrompt && isAiOpen) {
      sendMessage(aiInitialPrompt);
    }
  }, [aiInitialPrompt, isAiOpen]);

  const quickReplies = [
    { label: 'Recommend for Me', query: 'Recommend a versatile wardrobe outfit for this season.' },
    { label: 'Find an Outfit', query: 'I need an elegant outfit for an evening gala or special dinner.' },
    { label: 'Track My Order', query: 'How do I track my order delivery status and what is the shipping time?' },
    { label: 'Size & Fit Guide', query: 'How do Zenvora sizes fit and how do I select the right measurement?' },
    { label: 'Bespoke Fabrics', query: 'Tell me about the Mulberry silk and Merino wool used in Zenvora garments.' },
  ];

  const sendMessage = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          currentProduct: aiContextProduct
        })
      });

      const data = await res.json();
      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply || "I'd be glad to help you choose the right pieces. Tell me more about what you're looking for!",
        recommendedProducts: data.recommendedProducts || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: "I'm experiencing a momentary connection pause. However, our signature Mulberry Silk dresses, Milanese Wool Overcoat, and Italian Chinos are stellar recommendations for any occasion!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: "Chat cleared. What sartorial inspiration can I help you discover today?",
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <>
      {/* Floating Bottom-Right Button (Entry Point 2) */}
      {!isAiOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsAiOpen(true)}
            className="group relative flex items-center gap-3 px-4 py-3.5 rounded-full bg-[#121212] text-white shadow-2xl hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] border border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all transform hover:-translate-y-1 active:translate-y-0"
            aria-label="Open AI Fashion Stylist"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold tracking-wider text-amber-200">AI Stylist</p>
              <p className="text-[10px] text-stone-400 -mt-0.5">Online • Ready to Assist</p>
            </div>
          </button>
        </div>
      )}

      {/* Floating AI Chat Window */}
      {isAiOpen && (
        <div 
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[620px] max-h-[85vh]'}`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 px-4 py-3.5 text-white flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-stone-800 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-sm font-bold text-white tracking-wide">Zenvora AI Stylist</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
                <p className="text-[10px] text-stone-400">Personal Shopper & Outfit Curator</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-stone-400">
              <button 
                onClick={clearChat}
                className="p-1.5 hover:text-white hover:bg-stone-800 rounded transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:text-white hover:bg-stone-800 rounded transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={() => setIsAiOpen(false)}
                className="p-1.5 hover:text-white hover:bg-stone-800 rounded transition-colors"
                title="Close Stylist"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Product Context Banner if viewing specific piece */}
              {aiContextProduct && (
                <div className="bg-amber-50/80 border-b border-amber-200/60 px-3.5 py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/60 px-1.5 py-0.5 rounded">
                      Styling Item
                    </span>
                    <span className="text-stone-800 font-medium truncate">{aiContextProduct.name}</span>
                  </div>
                  <button 
                    onClick={() => sendMessage(`Suggest complementary pieces to pair with ${aiContextProduct.name}`)}
                    className="text-[11px] font-semibold text-amber-800 hover:text-black underline ml-2 whitespace-nowrap"
                  >
                    Find Pairs
                  </button>
                </div>
              )}

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/60">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-stone-900 text-amber-300 flex-shrink-0 flex items-center justify-center text-xs shadow-sm mt-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className={`max-w-[85%] space-y-2`}>
                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-stone-900 text-white rounded-tr-none'
                            : 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-none shadow-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>

                      {/* Render Recommended Product Cards in chat */}
                      {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Recommended Pieces
                          </p>
                          <div className="grid grid-cols-1 gap-2">
                            {msg.recommendedProducts.map((p) => (
                              <div
                                key={p.id}
                                className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-stone-200 hover:border-stone-400 transition-all shadow-sm"
                              >
                                <img
                                  src={p.images[0]}
                                  alt={p.name}
                                  className="w-12 h-14 object-cover rounded-lg bg-stone-100 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-semibold text-stone-900 truncate">{p.name}</h4>
                                  <p className="text-[11px] text-stone-700 capitalize">{p.gender} • {p.category}</p>
                                  <p className="text-xs font-bold text-stone-900 mt-0.5">
                                    ${p.discountPrice || p.price}
                                  </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <button
                                    onClick={() => openProductDetail(p)}
                                    className="p-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 text-[10px] font-medium flex items-center gap-1"
                                    title="View Product"
                                  >
                                    <ExternalLink className="w-3 h-3" /> View
                                  </button>
                                  <button
                                    onClick={() => {
                                      addToCart(p, p.sizes[0] || 'M', p.colors[0]?.name || 'Standard');
                                    }}
                                    className="p-1.5 rounded-md bg-stone-900 hover:bg-black text-amber-300 text-[10px] font-semibold flex items-center gap-1"
                                    title="Add to Bag"
                                  >
                                    <ShoppingBag className="w-3 h-3" /> Add
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <span className="block text-[10px] text-stone-700 px-1">
                        {msg.timestamp}
                      </span>
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-stone-300 text-stone-700 flex-shrink-0 flex items-center justify-center text-xs mt-0.5">
                        <UserIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading state indicator */}
                {loading && (
                  <div className="flex items-center gap-2.5 text-stone-700 text-xs py-2">
                    <div className="w-7 h-7 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <div className="bg-white border border-stone-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.4s]"></span>
                      <span className="text-xs text-stone-700 ml-1">Curating recommendations...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Chips */}
              <div className="p-2 bg-stone-100/90 border-t border-stone-200/80 overflow-x-auto flex gap-1.5 no-scrollbar">
                {quickReplies.map((qr, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(qr.query)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-stone-200 text-stone-800 text-[11px] font-medium border border-stone-200 transition-colors shadow-2xs"
                  >
                    {qr.label}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for an outfit, fabric info, size guide..."
                  className="flex-1 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2.5 rounded-xl bg-stone-900 text-amber-300 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
