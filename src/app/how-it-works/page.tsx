import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works — Buy or Sell Cheap Cars",
  description:
    "How to buy or sell a cheap car on BuyAndScrap. Simple 3-step process for buyers and sellers. Free to list, no commission.",
};

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-[#374151] text-center mb-12">How It Works</h1>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-[#22c55e] mb-6">Buying a Car</h2>
          <div className="space-y-8">
            {[
              { step: "1", title: "Search", desc: "Use our search to find cars near you. Filter by price, MOT remaining, make, or fuel type. Every listing shows verified MOT data from the DVLA." },
              { step: "2", title: "Check Everything", desc: "Read the honest fault disclosure (every seller must list known issues). Check the MOT history. Look at the condition rating. No hidden surprises." },
              { step: "3", title: "Contact the Seller", desc: "Send a message through our contact form. Arrange a viewing. The seller gets your message by email. Deal directly — no middlemen." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-10 h-10 bg-[#22c55e] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{item.step}</div>
                <div>
                  <h3 className="font-bold text-[#374151] text-lg">{item.title}</h3>
                  <p className="text-gray-600 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/cars" className="inline-block mt-8 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Browse Cars
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#374151] mb-6">Selling a Car</h2>
          <div className="space-y-8">
            {[
              { step: "1", title: "Enter Your Reg", desc: "Type your registration number and we auto-fill your car details from the DVLA — make, model, year, colour, and MOT expiry. Takes seconds." },
              { step: "2", title: "Add Details", desc: "Upload photos, set your price, and honestly list any known faults. Add a description. The more honest you are, the faster it sells." },
              { step: "3", title: "Get Contacted", desc: "Interested buyers message you through our form. You get their details by email. Arrange viewings and sell on your terms." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-10 h-10 bg-[#374151] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{item.step}</div>
                <div>
                  <h3 className="font-bold text-[#374151] text-lg">{item.title}</h3>
                  <p className="text-gray-600 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/sell" className="inline-block mt-8 bg-[#374151] hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            List Your Car Free
          </Link>
        </div>
      </div>
    </div>
  );
}
