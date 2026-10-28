import React from 'react';
import { Sparkles, MessageSquare, Compass, Shirt, CheckCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AiSectionCTA: React.FC = () => {
  const { openAiAssistant } = useShop();

  const handleStartConsultation = (presetPrompt?: string) => {
    openAiAssistant(presetPrompt || 'I would like a personalized outfit recommendation for my style and budget');
  };

  return (
    <section className="py-20 bg-stone-900 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4AF37]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-stone-950/80 rounded-3xl border border-stone-800 p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-amber-300 text-xs font-semibold tracking-[0.2em] uppercase">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Proprietary AI Fashion Concierge
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Meet Your Personal <br />
                <span className="italic font-normal text-[#E2C792]">Zenvora AI Stylist</span>
              </h2>

              <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                Experience bespoke virtual styling. Describe an occasion, mood, or desired budget, and our intelligent stylist synthesizes cohesive color harmonies, silhouettes, and fabric pairings tailored to your exact taste.
              </p>

              {/* Feature bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto lg:mx-0 text-left pt-2">
                <div className="flex items-center gap-2.5 text-xs text-stone-300">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span>Real-time outfit curation & pairings</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-stone-300">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span>Exact sizing & tailored fit guidance</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-stone-300">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span>Instant order status & tracking lookup</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-stone-300">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span>Silk & wool fabric care insights</span>
                </div>
              </div>

              {/* Main Action Button (Requirement 6) */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => handleStartConsultation()}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-[#D4AF37] to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-[0.18em] shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  Get Outfit Recommendations
                </button>

                <button
                  onClick={() => handleStartConsultation('I need a complete formal look for a black-tie evening gala')}
                  className="px-6 py-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
                >
                  Gala Lookbook
                </button>
              </div>
            </div>

            {/* Right Interactive Prompt Cards */}
            <div className="lg:col-span-5 space-y-3">
              <div 
                onClick={() => handleStartConsultation('Find me a smart-casual outfit for a summer weekend date')}
                className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-[#D4AF37]/50 cursor-pointer transition-all hover:bg-stone-800/80 group shadow-md"
              >
                <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                  <span className="flex items-center gap-1.5 text-[#E2C792] font-semibold">
                    <Compass className="w-3.5 h-3.5" /> Prompt Idea #1
                  </span>
                  <span className="text-[10px] uppercase">Click to ask</span>
                </div>
                <p className="text-sm text-stone-200 group-hover:text-white">
                  "Find me a smart-casual outfit for a summer weekend date with breathable French linen."
                </p>
              </div>

              <div 
                onClick={() => handleStartConsultation('Recommend a structured power suit or blazer look for a boardroom presentation')}
                className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-[#D4AF37]/50 cursor-pointer transition-all hover:bg-stone-800/80 group shadow-md"
              >
                <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                  <span className="flex items-center gap-1.5 text-[#E2C792] font-semibold">
                    <Shirt className="w-3.5 h-3.5" /> Prompt Idea #2
                  </span>
                  <span className="text-[10px] uppercase">Click to ask</span>
                </div>
                <p className="text-sm text-stone-200 group-hover:text-white">
                  "Recommend a structured Italian wool blazer look for a boardroom presentation."
                </p>
              </div>

              <div 
                onClick={() => handleStartConsultation('What royal ethnic ensemble do you recommend for a grand wedding celebration?')}
                className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-[#D4AF37]/50 cursor-pointer transition-all hover:bg-stone-800/80 group shadow-md"
              >
                <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                  <span className="flex items-center gap-1.5 text-[#E2C792] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" /> Prompt Idea #3
                  </span>
                  <span className="text-[10px] uppercase">Click to ask</span>
                </div>
                <p className="text-sm text-stone-200 group-hover:text-white">
                  "What royal ethnic ensemble do you recommend for a wedding celebration?"
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
