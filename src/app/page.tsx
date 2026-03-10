"use client";

import { useState, FormEvent } from "react";

export default function Home() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    registration: "",
    postcode: "",
    make: "",
    model: "",
    year: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-secondary">
              Buy<span className="text-primary">&amp;</span>Scrap
            </span>
          </div>
          <a
            href="tel:08001234567"
            className="text-primary font-semibold hover:underline hidden sm:block"
          >
            0800 123 4567
          </a>
        </div>
      </header>

      {/* Top Ad Slot */}
      <div className="max-w-6xl mx-auto px-4 mt-4 w-full">
        <div className="adsense-slot h-[90px] rounded">Ad Space</div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-gray-50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-secondary leading-tight">
              Get Cash For Your{" "}
              <span className="text-primary">Scrap Car</span> Today
            </h1>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              We buy any scrap or unwanted vehicle across the UK. Free
              collection, instant quotes, and same-day payment. Fully licensed
              and environmentally responsible.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free Collection
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Best Prices Guaranteed
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Same-Day Payment
              </span>
            </div>
          </div>

          {/* Lead Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-secondary">
                  Quote Request Received!
                </h3>
                <p className="text-gray-600 mt-2">
                  We&apos;ll be in touch within 30 minutes with your free
                  quote. Check your phone for our call.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-secondary mb-1">
                  Get Your Free Quote
                </h2>
                <p className="text-gray-500 text-sm mb-5">
                  Fill in your details and we&apos;ll call you back with a
                  price
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    required
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Car Registration *"
                      required
                      value={form.registration}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          registration: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none uppercase"
                    />
                    <input
                      type="text"
                      placeholder="Postcode *"
                      required
                      value={form.postcode}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          postcode: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none uppercase"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Make"
                      value={form.make}
                      onChange={(e) =>
                        setForm({ ...form, make: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Model"
                      value={form.model}
                      onChange={(e) =>
                        setForm({ ...form, model: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Year"
                      value={form.year}
                      onChange={(e) =>
                        setForm({ ...form, year: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg text-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Get My Free Quote"}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    No obligation. We&apos;ll call you within 30 minutes.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-secondary mb-12">
            Why Choose Buy &amp; Scrap?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Fast Collection",
                desc: "Same-day or next-day collection available across the UK. We work around your schedule.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Best Prices",
                desc: "We guarantee the best price for your scrap car. Instant payment on collection.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ),
                title: "Free Collection",
                desc: "Completely free vehicle collection anywhere in the UK. No hidden fees or charges.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Fully Licensed",
                desc: "We are a fully licensed ATF (Authorised Treatment Facility). DVLA notified automatically.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  {item.icon}
                </div>
                <h3 className="font-bold text-secondary text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Slot */}
      <div className="max-w-6xl mx-auto px-4 my-4 w-full">
        <div className="adsense-slot h-[90px] rounded">Ad Space</div>
      </div>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-secondary mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Fill In The Form",
                desc: "Enter your car details and contact information using our quick form above.",
              },
              {
                step: "2",
                title: "Get Your Quote",
                desc: "We'll call you back within 30 minutes with our best price for your vehicle.",
              },
              {
                step: "3",
                title: "We Collect & Pay",
                desc: "We collect your car for free and pay you on the spot. It's that simple.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center bg-white rounded-xl p-8 shadow-sm"
              >
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-bold text-secondary text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* After Content Ad Slot */}
      <div className="max-w-6xl mx-auto px-4 my-4 w-full">
        <div className="adsense-slot h-[250px] rounded">Ad Space</div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary text-white py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-3">
                Buy<span className="text-primary">&amp;</span>Scrap
              </h3>
              <p className="text-gray-400 text-sm">
                The UK&apos;s trusted car scrapping service. We buy any scrap
                or unwanted vehicle with free collection nationwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>Phone: 0800 123 4567</li>
                <li>Email: info@buyandscrap.com</li>
                <li>Hours: Mon-Sat 8am-6pm</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-8 pt-6 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Buy &amp; Scrap. All rights
            reserved. Authorised Treatment Facility.
          </div>
        </div>
      </footer>
    </div>
  );
}
