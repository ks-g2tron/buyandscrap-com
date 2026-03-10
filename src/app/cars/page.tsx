import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Browse Cheap Cars With MOT",
  description:
    "Browse cheap cars for sale with MOT across the UK. Filter by price, MOT remaining, make, and location. Honest sellers, no commission.",
};

export default function CarsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-extrabold text-[#374151] mb-4">Browse Cars</h1>
      <p className="text-gray-600 mb-8">Car listings are coming soon. Check back shortly!</p>
      <Link href="/sell" className="inline-block bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 px-6 rounded-lg transition-colors">
        Be the first to list your car
      </Link>
    </div>
  );
}
