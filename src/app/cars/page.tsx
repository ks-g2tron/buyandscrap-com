"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Listing } from "@/lib/types";

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
  return Math.max(0, (exp.getFullYear() - now.getFullYear()) * 12 + (exp.getMonth() - now.getMonth()));
}

export default function CarsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [make, setMake] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [motMonths, setMotMonths] = useState("");
  const [fuel, setFuel] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (sort) params.set("sort", sort);
    if (make) params.set("make", make);
    if (maxPrice) params.set("max_price", maxPrice);
    if (motMonths) params.set("mot_months", motMonths);
    if (fuel) params.set("fuel", fuel);

    setLoading(true);
    fetch(`/api/listings?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sort, make, maxPrice, motMonths, fuel]);

  const makes = Array.from(new Set(listings.map((l) => l.make))).sort();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#374151]">Browse Cars</h1>
          <p className="text-gray-500 text-sm mt-1">
            {listings.length} car{listings.length !== 1 ? "s" : ""} available
          </p>
        </div>
        <Link
          href="/sell"
          className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-2 px-5 rounded-lg text-sm transition-colors self-start"
        >
          + List Your Car Free
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#22c55e] outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="cheapest">Cheapest first</option>
            <option value="most-mot">Most MOT first</option>
          </select>

          <select
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#22c55e] outline-none"
          >
            <option value="">Any make</option>
            {makes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#22c55e] outline-none"
          >
            <option value="">Any price</option>
            <option value="500">Under &pound;500</option>
            <option value="1000">Under &pound;1,000</option>
            <option value="1500">Under &pound;1,500</option>
            <option value="2000">Under &pound;2,000</option>
            <option value="3000">Under &pound;3,000</option>
          </select>

          <select
            value={motMonths}
            onChange={(e) => setMotMonths(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#22c55e] outline-none"
          >
            <option value="">Any MOT</option>
            <option value="3">3+ months</option>
            <option value="6">6+ months</option>
            <option value="9">9+ months</option>
            <option value="12">12+ months</option>
          </select>

          <select
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#22c55e] outline-none"
          >
            <option value="">Any fuel</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
          </select>
        </div>
      </div>

      {/* Ad slot */}
      <div className="adsense-slot h-[90px] rounded mb-8">Ad Space</div>

      {/* Listings Grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading cars...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No cars match your filters.</p>
          <button
            onClick={() => { setMake(""); setMaxPrice(""); setMotMonths(""); setFuel(""); }}
            className="text-[#22c55e] font-medium hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((car) => (
            <Link
              key={car.id}
              href={`/cars/${car.slug}`}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="h-44 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                {car.photos.length > 0 ? (
                  <img src={car.photos[0]} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <svg className="w-10 h-10 mx-auto mb-1 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {car.make} {car.model}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-[#374151] group-hover:text-[#22c55e] transition-colors">
                    {car.make} {car.model}
                  </h3>
                  <span className="text-lg font-bold text-[#22c55e] whitespace-nowrap ml-2">
                    &pound;{car.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  {car.year} &middot; {car.mileage.toLocaleString()} miles &middot; {car.fuel} &middot; {car.location}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${conditionColor(car.condition)}`}>
                    {conditionLabel(car.condition)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {motMonthsRemaining(car.mot_expiry)} months MOT
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{car.known_faults}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Ad slot */}
      <div className="adsense-slot h-[250px] rounded mt-8">Ad Space</div>
    </div>
  );
}
