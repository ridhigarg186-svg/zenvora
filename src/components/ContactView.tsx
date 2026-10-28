import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ContactView: React.FC = () => {
  const { setCurrentView, showToast } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      if (res.ok) {
        setSubmitted(true);
        showToast('Your message has been received by our concierge.');
      }
    } catch {
      showToast('Error transmitting message. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <button
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-black cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Boutique
        </button>

        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#997A45] font-semibold">
            Client Concierge & Care
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Connect With Zenvora
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
            Our private styling advisory and customer support team are at your service for sizing inquiries, order updates, or bespoke consultations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Contact Details (Col 5) */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-xs">
              <h3 className="font-serif text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
                Atelier Headquarters
              </h3>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#997A45] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Zenvora Atelier & Flagship</p>
                  <p className="text-stone-500">740 Fifth Avenue, Floor 14</p>
                  <p className="text-stone-500">New York, NY 10019</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#997A45] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Email Concierge</p>
                  <p className="text-stone-500">concierge@zenvora.com</p>
                  <p className="text-[10px] text-stone-400">Response within 4 business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#997A45] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Client Advisory Telephone</p>
                  <p className="text-stone-500">+1 (800) 555-ZENVORA</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#997A45] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Concierge Service Hours</p>
                  <p className="text-stone-500">Monday – Saturday: 8:00 AM – 9:00 PM EST</p>
                  <p className="text-stone-500">Sunday: 10:00 AM – 6:00 PM EST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form (Col 7) */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900">Send an Inquiry</h3>

            {submitted ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-stone-900">Message Delivered</h4>
                <p className="text-xs text-stone-600">
                  Thank you, <strong>{name}</strong>. A dedicated Zenvora client advisor will review your note and respond to <strong>{email}</strong> promptly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setSubject('');
                    setMessage('');
                  }}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Julian Vance"
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Sizing Advice, Order Inquiry, or Custom Request"
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="How may our concierge assist you today?"
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-stone-900 hover:bg-black text-white font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#D4AF37]" />
                  {submitting ? 'Transmitting...' : 'Dispatch Message'}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
