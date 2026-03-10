import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Car Buying & Selling Guides",
  description:
    "Free guides on buying cheap cars, checking MOT history, what to look for in a banger, and UK scrapping rules. Honest advice from BuyAndScrap.",
};

const guides = [
  {
    title: "How to Buy a Cheap Car Safely in the UK",
    slug: "how-to-buy-a-cheap-car-safely-uk",
    excerpt: "Everything you need to know before buying a budget car. From MOT checks to test drives, we cover the essentials.",
    date: "10 March 2025",
  },
  {
    title: "What to Check Before Buying a Banger",
    slug: "what-to-check-before-buying-a-banger",
    excerpt: "A step-by-step checklist for inspecting a cheap car. Don't get caught out by hidden problems.",
    date: "10 March 2025",
  },
  {
    title: "UK Scrapping Rules Explained",
    slug: "uk-scrapping-rules-explained",
    excerpt: "When your car reaches the end of its life, here's what the law says about scrapping it properly in the UK.",
    date: "10 March 2025",
  },
  {
    title: "How Long Should a £500 Car Last?",
    slug: "how-long-should-a-500-car-last",
    excerpt: "Setting realistic expectations for budget cars. What you can expect from a cheap buy, and how to get the most out of it.",
    date: "10 March 2025",
  },
];

export default function GuidesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-[#374151] mb-4">Guides</h1>
      <p className="text-gray-600 mb-10">Honest advice for buying and selling cheap cars in the UK.</p>

      <div className="space-y-6">
        {guides.map((guide) => (
          <article
            key={guide.slug}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <span className="text-xs text-gray-400">{guide.date}</span>
            <h2 className="text-xl font-bold text-[#374151] mt-1 mb-2">
              <Link href={`/guides/${guide.slug}`} className="hover:text-[#22c55e] transition-colors">
                {guide.title}
              </Link>
            </h2>
            <p className="text-gray-600 text-sm">{guide.excerpt}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 p-6 bg-green-50 rounded-xl border border-green-100 text-center">
        <p className="text-gray-700">New guides published weekly. Bookmark this page or check back soon.</p>
      </div>
    </div>
  );
}
