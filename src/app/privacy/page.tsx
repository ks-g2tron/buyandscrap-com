import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "BuyAndScrap privacy policy. How we collect, use, and protect your personal data under UK GDPR.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-[#374151] mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: 10 March 2025</p>

      <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
        <h2 className="text-xl font-bold text-[#374151]">1. Who we are</h2>
        <p>BuyAndScrap.com (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates an online marketplace for buying and selling used vehicles in the United Kingdom. This privacy policy explains how we collect, use, and protect your personal data in compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>

        <h2 className="text-xl font-bold text-[#374151]">2. What data we collect</h2>
        <p>We may collect the following personal data:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Account information:</strong> name, email address, phone number</li>
          <li><strong>Listing information:</strong> vehicle details, photos, postcode, location</li>
          <li><strong>Contact form data:</strong> name, email, phone, message content</li>
          <li><strong>Technical data:</strong> IP address, browser type, device information, pages visited</li>
          <li><strong>Cookie data:</strong> as described in our Cookie Policy</li>
        </ul>

        <h2 className="text-xl font-bold text-[#374151]">3. How we use your data</h2>
        <p>We use your data to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Provide and maintain the marketplace service</li>
          <li>Facilitate communication between buyers and sellers</li>
          <li>Send you relevant notifications about your listings or enquiries</li>
          <li>Improve our website and user experience (with your consent for analytics)</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="text-xl font-bold text-[#374151]">4. Legal basis for processing</h2>
        <p>We process your data on the following legal bases:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Contract:</strong> to provide the marketplace service you requested</li>
          <li><strong>Consent:</strong> for analytics cookies and marketing communications</li>
          <li><strong>Legitimate interest:</strong> to improve our service and prevent fraud</li>
          <li><strong>Legal obligation:</strong> where required by law</li>
        </ul>

        <h2 className="text-xl font-bold text-[#374151]">5. Data sharing</h2>
        <p>We do not sell your personal data. We may share data with:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Other users (e.g. your name and message when you contact a seller)</li>
          <li>Service providers who help us operate the site (hosting, email delivery)</li>
          <li>Law enforcement if required by law</li>
        </ul>

        <h2 className="text-xl font-bold text-[#374151]">6. Data retention</h2>
        <p>We retain your data for as long as your account is active or as needed to provide services. Listing data is retained for 12 months after the listing expires. You can request deletion at any time.</p>

        <h2 className="text-xl font-bold text-[#374151]">7. Your rights</h2>
        <p>Under UK GDPR, you have the right to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Access your personal data</li>
          <li>Rectify inaccurate data</li>
          <li>Request erasure of your data</li>
          <li>Restrict or object to processing</li>
          <li>Data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p>To exercise these rights, contact us at privacy@buyandscrap.com.</p>

        <h2 className="text-xl font-bold text-[#374151]">8. Contact</h2>
        <p>If you have questions about this policy or wish to make a complaint, contact us at privacy@buyandscrap.com. You also have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO) at ico.org.uk.</p>
      </div>
    </div>
  );
}
