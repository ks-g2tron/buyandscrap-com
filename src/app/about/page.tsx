import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About BuyAndScrap — Our Story",
  description:
    "BuyAndScrap was born out of necessity. We exist for people who need cheap, reliable cars with MOT. Honest sellers, fair prices, cars that still have life in them.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-[#374151] mb-8">About BuyAndScrap</h1>

      <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
        <p>
          BuyAndScrap was born out of necessity. Our founder needed a reliable car with at least
          a year&apos;s MOT to get to work, take the kids to school, and do the weekly shop — but
          couldn&apos;t afford the prices on AutoTrader. Sound familiar?
        </p>
        <p>
          This site exists for people like that. Honest sellers. Fair prices. Cars that still have
          life in them.
        </p>

        <h2 className="text-2xl font-bold text-[#374151] mt-10">What we believe</h2>
        <ul className="space-y-3">
          <li><strong>Honesty first.</strong> Every seller must disclose known faults. No surprises.</li>
          <li><strong>Free for everyone.</strong> Listing your car is free. Buying is free. No commission, ever.</li>
          <li><strong>Real data.</strong> MOT dates come straight from the DVLA. You can verify everything.</li>
          <li><strong>Built for real people.</strong> Not dealers. Not traders. People who need a car that works.</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#374151] mt-10">Who we&apos;re for</h2>
        <p>
          If you&apos;re looking for a cheap car to get you through the next year or two — you&apos;re
          in the right place. If you&apos;ve got a car that still runs but you&apos;re done with it —
          list it here and help someone out.
        </p>
        <p>
          No flashy showrooms. No inflated prices. Just honest cars for honest people.
        </p>
      </div>
    </div>
  );
}
