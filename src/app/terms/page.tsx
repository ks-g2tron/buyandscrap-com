import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "BuyAndScrap terms of use. Rules for using our marketplace for buying and selling cars.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-[#374151] mb-8">Terms of Use</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: 10 March 2025</p>

      <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
        <h2 className="text-xl font-bold text-[#374151]">1. About BuyAndScrap</h2>
        <p>BuyAndScrap.com is an online marketplace that connects buyers and sellers of used vehicles. We are not a dealer and do not buy or sell vehicles ourselves. We provide the platform; all transactions are between the buyer and seller directly.</p>

        <h2 className="text-xl font-bold text-[#374151]">2. Marketplace liability</h2>
        <p>BuyAndScrap acts solely as an intermediary platform. We do not:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Inspect, verify, or guarantee any vehicle listed</li>
          <li>Handle payments between buyers and sellers</li>
          <li>Provide warranties or guarantees of any kind</li>
          <li>Take responsibility for the accuracy of listings</li>
        </ul>
        <p>Buyers are responsible for conducting their own checks before purchasing any vehicle. We strongly recommend viewing a vehicle in person and checking its MOT history on the DVLA website before buying.</p>

        <h2 className="text-xl font-bold text-[#374151]">3. Seller obligations</h2>
        <p>By listing a vehicle, you agree to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Provide accurate information about the vehicle</li>
          <li>Disclose all known faults honestly</li>
          <li>Only list vehicles you own or are authorised to sell</li>
          <li>Not misrepresent the condition of the vehicle</li>
          <li>Comply with all applicable UK laws regarding vehicle sales</li>
        </ul>

        <h2 className="text-xl font-bold text-[#374151]">4. Prohibited content</h2>
        <p>You must not list:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Stolen vehicles</li>
          <li>Vehicles with outstanding finance (without disclosure)</li>
          <li>Fraudulent or misleading listings</li>
          <li>Non-vehicle items</li>
        </ul>

        <h2 className="text-xl font-bold text-[#374151]">5. Account termination</h2>
        <p>We reserve the right to remove any listing or suspend any account that violates these terms, without notice.</p>

        <h2 className="text-xl font-bold text-[#374151]">6. Limitation of liability</h2>
        <p>To the maximum extent permitted by law, BuyAndScrap shall not be liable for any loss or damage arising from use of the platform, including but not limited to financial loss from vehicle purchases made through the site.</p>

        <h2 className="text-xl font-bold text-[#374151]">7. Changes to terms</h2>
        <p>We may update these terms from time to time. Continued use of the site constitutes acceptance of any changes.</p>

        <h2 className="text-xl font-bold text-[#374151]">8. Contact</h2>
        <p>For questions about these terms, contact us at legal@buyandscrap.com.</p>
      </div>
    </div>
  );
}
