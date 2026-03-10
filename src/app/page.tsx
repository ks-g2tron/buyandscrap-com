import Link from "next/link";
import { getApprovedListings, seedDemoListings } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BuyAndScrap — Cheap Cars With MOT | Buy & Sell UK",
  description:
    "Find your next car. Drive it. Scrap it. Cheap, reliable cars with MOT from honest sellers. Free to list, no commission. UK-wide marketplace.",
};

function conditionLabel(c: string) {
  switch (c) {
    case "solid-runner": return "Solid Runner";
    case "minor-issues": return "Minor Issues";
    case "rough-but-drives": return "Rough But Drives";
    default: return c;
  }
}

function conditionColor(c: string) {
  switch (c) {
    case "solid-runner": return "bg-green-100 text-green-800";
    case "minor-issues": return "bg-yellow-100 text-yellow-800";
    case "rough-but-drives": return "bg-orange-100 text-orange-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

function motMonthsRemaining(expiry: string): number {
  const now = new Date();
  const exp = new Date(expiry);
  const months = (exp.getFullYear() - now.getFullYear()) * 12 + (exp.getMonth() - now.getMonth());
  return Math.max(0, months);
}

export default async function Home() {
  await seedDemoListings();
  const listings = await getApprovedListings();
  const featured = listings.filter((l) => l.featured).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 to-gray-50 py-14 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#374151] leading-tight">
            Find Your Next Car.<br />
            <span className="text-[#22c55e]">Drive It. Scrap It.</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Cheap, reliable cars with MOT from honest sellers. No commission, no middlemen.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-xl mx-auto">
            <form action="/cars" method="GET" className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="postcode"
                placeholder="Enter your postcode"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none uppercase"
              />
              <select
                name="mot_months"
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-600 focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none"
              >
                <option value="">Any MOT</option>
                <option value="3">3+ months MOT</option>
                <option value="6">6+ months MOT</option>
                <option value="9">9+ months MOT</option>
                <option value="12">12+ months MOT</option>
              </select>
              <button
                type="submit"
                className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 px-6 rounded-lg text-sm transition-colors"
              >
                Search Cars
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-10 text-sm text-gray-600">
          {[
            "Free to list",
            "No commission",
            "DVLA verified MOT",
            "Honest sellers",
          ].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* AdSense slot */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="adsense-slot h-[90px] rounded">Ad Space</div>
      </div>

      {/* How it works — Buyers */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#374151] mb-4">How It Works</h2>
          <p className="text-center text-gray-500 mb-12">Simple for buyers and sellers</p>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Buyers */}
            <div>
              <h3 className="text-lg font-bold text-[#374151] mb-6 text-center md:text-left">For Buyers</h3>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Search", desc: "Browse cars by location, price, or MOT remaining. Every car has verified MOT data from the DVLA." },
                  { step: "2", title: "Check", desc: "Read honest fault disclosures, check MOT history, and see the condition rating. No surprises." },
                  { step: "3", title: "Contact", desc: "Message the seller directly. Arrange a viewing. Buy with confidence." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 bg-[#22c55e] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#374151]">{item.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sellers */}
            <div>
              <h3 className="text-lg font-bold text-[#374151] mb-6 text-center md:text-left">For Sellers</h3>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Enter Your Reg", desc: "Type your registration and we auto-fill your car details from the DVLA. Takes 10 seconds." },
                  { step: "2", title: "Be Honest", desc: "Add photos, set your price, and list any known faults. Honesty builds trust and sells cars faster." },
                  { step: "3", title: "Get Offers", desc: "Buyers contact you directly. No fees, no commission. The money is yours." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 bg-[#374151] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#374151]">{item.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      {featured.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[#374151] mb-2">Featured Cars</h2>
            <p className="text-center text-gray-500 mb-10">Honest cars from honest sellers</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((car) => (
                <Link
                  key={car.id}
                  href={`/cars/${car.slug}`}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                    {car.photos.length > 0 ? (
                      <img src={car.photos[0]} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
                    ) : (
                      <span>{car.make} {car.model}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-[#374151] group-hover:text-[#22c55e] transition-colors">
                        {car.make} {car.model}
                      </h3>
                      <span className="text-lg font-bold text-[#22c55e]">
                        &pound;{car.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {car.year} &middot; {car.mileage.toLocaleString()} miles &middot; {car.fuel}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${conditionColor(car.condition)}`}>
                        {conditionLabel(car.condition)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {motMonthsRemaining(car.mot_expiry)} months MOT
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/cars"
                className="inline-block bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Browse All Cars
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* AdSense slot */}
      <div className="max-w-6xl mx-auto px-4 my-6">
        <div className="adsense-slot h-[250px] rounded">Ad Space</div>
      </div>

      {/* Founder Story */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#374151] mb-8">Our Story</h2>
          <div className="bg-green-50 rounded-2xl p-8 md:p-10 border border-green-100">
            <p className="text-gray-700 leading-relaxed text-lg">
              BuyAndScrap was born out of necessity. Our founder needed a reliable car with at least
              a year&apos;s MOT to get to work, take the kids to school, and do the weekly shop — but
              couldn&apos;t afford the prices on AutoTrader. Sound familiar?
            </p>
            <p className="text-gray-700 leading-relaxed text-lg mt-4">
              This site exists for people like that. Honest sellers. Fair prices. Cars that still have
              life in them.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#374151]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Got a car to sell?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            List it for free in under 5 minutes. No fees, no commission. Just honest selling.
          </p>
          <Link
            href="/sell"
            className="inline-block bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-4 px-10 rounded-lg text-lg transition-colors"
          >
            List Your Car Free
          </Link>
        </div>
      </section>

      {/* AdSense slot */}
      <div className="max-w-6xl mx-auto px-4 my-6">
        <div className="adsense-slot h-[90px] rounded">Ad Space</div>
      </div>
    </>
  );
}
