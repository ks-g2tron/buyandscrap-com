import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Your Car Free — No Commission",
  description:
    "List your car for free on BuyAndScrap. Enter your reg, we auto-fill from DVLA. Add photos, set your price, be honest about faults. No commission, ever.",
};

export default function SellPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-extrabold text-[#374151] mb-4">Sell Your Car</h1>
      <p className="text-gray-600 mb-8">The free listing form is launching very soon. It takes under 5 minutes.</p>
      <div className="bg-green-50 border border-green-100 rounded-xl p-8">
        <p className="text-gray-700">Enter your reg, we auto-fill from DVLA. Add photos, price, and known faults. That&apos;s it.</p>
      </div>
    </div>
  );
}
