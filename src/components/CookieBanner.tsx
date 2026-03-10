"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type CookieConsent = "accepted" | "declined" | "custom" | null;

interface Preferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieBanner() {
  const [consent, setConsent] = useState<CookieConsent>(null);
  const [showManage, setShowManage] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie_consent");
    if (stored) {
      setConsent(stored as CookieConsent);
      if (stored === "custom") {
        try {
          const savedPrefs = JSON.parse(localStorage.getItem("cookie_prefs") || "{}");
          setPrefs({ necessary: true, ...savedPrefs });
        } catch {}
      }
    }
    setLoaded(true);
  }, []);

  const handleAccept = () => {
    setConsent("accepted");
    localStorage.setItem("cookie_consent", "accepted");
    localStorage.setItem("cookie_prefs", JSON.stringify({ necessary: true, analytics: true, marketing: true }));
  };

  const handleDecline = () => {
    setConsent("declined");
    localStorage.setItem("cookie_consent", "declined");
    localStorage.setItem("cookie_prefs", JSON.stringify({ necessary: true, analytics: false, marketing: false }));
  };

  const handleSavePrefs = () => {
    setConsent("custom");
    localStorage.setItem("cookie_consent", "custom");
    localStorage.setItem("cookie_prefs", JSON.stringify(prefs));
    setShowManage(false);
  };

  if (!loaded || consent) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-5">
        {showManage ? (
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Cookie Preferences</h3>
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-3">
                <input type="checkbox" checked disabled className="w-4 h-4 accent-[#22c55e]" />
                <div>
                  <span className="text-sm font-medium text-gray-800">Necessary</span>
                  <p className="text-xs text-gray-500">Required for the site to function. Cannot be disabled.</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                  className="w-4 h-4 accent-[#22c55e]"
                />
                <div>
                  <span className="text-sm font-medium text-gray-800">Analytics</span>
                  <p className="text-xs text-gray-500">Help us understand how visitors use the site (Google Analytics).</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefs.marketing}
                  onChange={(e) => setPrefs({ ...prefs, marketing: e.target.checked })}
                  className="w-4 h-4 accent-[#22c55e]"
                />
                <div>
                  <span className="text-sm font-medium text-gray-800">Marketing</span>
                  <p className="text-xs text-gray-500">Used for ad personalisation (Google AdSense).</p>
                </div>
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSavePrefs}
                className="px-4 py-2 bg-[#22c55e] text-white text-sm font-medium rounded-lg hover:bg-[#16a34a] transition-colors"
              >
                Save Preferences
              </button>
              <button
                onClick={() => setShowManage(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              We use cookies to improve your experience. Analytics cookies are only loaded with your consent.
              Read our <Link href="/cookies" className="text-[#22c55e] underline">cookie policy</Link> and{" "}
              <Link href="/privacy" className="text-[#22c55e] underline">privacy policy</Link> for details.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-[#22c55e] text-white text-sm font-medium rounded-lg hover:bg-[#16a34a] transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={handleDecline}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => setShowManage(true)}
                className="px-4 py-2 text-sm text-gray-500 underline hover:text-gray-700 transition-colors"
              >
                Manage Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
