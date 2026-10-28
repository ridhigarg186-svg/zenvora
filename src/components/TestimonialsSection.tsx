import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Elena Rostova',
      location: 'Milan, Italy',
      quote: 'The Aurelia Silk Slip Gown is pure poetry. The 22-momme silk drapes with such substantial weight and liquid grace. Wore it to an opera premiere and felt unmatched confidence.',
      rating: 5,
      piece: 'Aurelia Silk Bias Slip Gown'
    },
    {
      name: 'Marcus Thorne',
      location: 'London, UK',
      quote: 'Savile Row caliber at an honest price. The Milanese Wool-Cashmere Overcoat has an architectural shoulder fit that transforms everyday knitwear into an executive statement.',
      rating: 5,
      piece: 'Atelier Milanese Wool Overcoat'
    },
    {
      name: 'Julian Vance',
      location: 'Beverly Hills, USA',
      quote: 'The AI Stylist recommended pairing the Japanese Selvedge Denim with the Normandy French Linen Shirt. Delivery arrived in 48 hours in luxury velvet boxes. Zenvora is on another level.',
      rating: 5,
      piece: 'Riviera French Linen & Selvedge'
    }
  ];

  return (
    <section className="py-20 bg-stone-100/70 border-t border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#997A45]">
            Verified Client Acclaim
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Voices of Confidence
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light">
            Read candid thoughts from patrons around the globe who wear Zenvora to life's most meaningful moments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-8 border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <Quote className="w-8 h-8 text-[#D4AF37]/30 absolute top-6 right-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-sm">{t.name}</h4>
                  <p className="text-[11px] text-stone-400">{t.location}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Patron
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
