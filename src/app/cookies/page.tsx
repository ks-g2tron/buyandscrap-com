import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "BuyAndScrap cookie policy. What cookies we use, why, and how to manage your preferences.",
};

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-[#374151] mb-8">Cookie Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: 10 March 2025</p>

      <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
        <h2 className="text-xl font-bold text-[#374151]">What are cookies?</h2>
        <p>Cookies are small text files stored on your device when you visit a website. They help the site work properly and can provide information to the site owners.</p>

        <h2 className="text-xl font-bold text-[#374151]">Cookies we use</h2>

        <h3 className="text-lg font-semibold text-[#374151]">Necessary cookies</h3>
        <p>These are essential for the site to function. They cannot be disabled.</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>cookie_consent</strong> — remembers your cookie preference</li>
          <li><strong>cookie_prefs</strong> — stores your cookie category preferences</li>
        </ul>

        <h3 className="text-lg font-semibold text-[#374151]">Analytics cookies (optional)</h3>
        <p>These help us understand how visitors use the site. Only loaded with your consent.</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Google Analytics (_ga, _gid)</strong> — anonymous usage data</li>
        </ul>

        <h3 className="text-lg font-semibold text-[#374151]">Marketing cookies (optional)</h3>
        <p>Used for ad personalisation. Only loaded with your consent.</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Google AdSense</strong> — personalised advertising</li>
        </ul>

        <h2 className="text-xl font-bold text-[#374151]">Managing your preferences</h2>
        <p>You can change your cookie preferences at any time using the cookie banner that appears on the site, or by clearing your browser cookies and revisiting the site.</p>

        <h2 className="text-xl font-bold text-[#374151]">Contact</h2>
        <p>If you have questions about our use of cookies, contact us at privacy@buyandscrap.com.</p>
      </div>
    </div>
  );
}
