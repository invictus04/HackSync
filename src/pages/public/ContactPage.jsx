// src/pages/public/ContactPage.jsx
import React, { useState } from 'react';
import Container from "../../components/common/Container";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log(formData);
    alert('Message sent!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-pale-mint min-h-screen pt-24 pb-24">
      <Container>
        <div className="max-w-6xl mx-auto bg-white border border-muted-slate/20 rounded-[2.5rem] shadow-[0_10px_30px_rgba(56,48,46,0.03)] overflow-hidden flex flex-col md:flex-row">

          {/* Form Section */}
          <div className="flex-1 p-12 md:p-16 flex flex-col justify-center">
            <span className="inline-block py-1.5 px-4 rounded-full bg-pale-mint/30 text-deep-espresso text-xs font-bold tracking-widest uppercase mb-6 border border-muted-slate/20 w-fit">
              Get in touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-deep-espresso mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Let's build something great together.
            </h1>
            <p className="text-warm-stone mb-10 text-lg leading-relaxed">
              Have questions about HackSync, or want to explore a collaboration? Fill out the form below and we'll get back to you shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-deep-espresso mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F8FAF9] border border-muted-slate/20 rounded-xl px-5 py-4 text-deep-espresso focus:outline-none focus:border-soft-celadon focus:ring-1 focus:ring-soft-celadon transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-deep-espresso mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#F8FAF9] border border-muted-slate/20 rounded-xl px-5 py-4 text-deep-espresso focus:outline-none focus:border-soft-celadon focus:ring-1 focus:ring-soft-celadon transition-colors"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-deep-espresso mb-2">Message</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="4"
                  className="w-full bg-[#F8FAF9] border border-muted-slate/20 rounded-xl px-5 py-4 text-deep-espresso focus:outline-none focus:border-soft-celadon focus:ring-1 focus:ring-soft-celadon transition-colors resize-none"
                  placeholder="How can we help you?"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-deep-espresso text-white font-bold text-lg hover:-translate-y-[1px] cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Image Section */}
          <div className="flex-1 relative min-h-[400px] md:min-h-full p-4 pr-6 pb-6">
            <img
              src="/raj_avtar.jpeg"
              alt="Get in touch"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </Container>
    </div>
  );
}
