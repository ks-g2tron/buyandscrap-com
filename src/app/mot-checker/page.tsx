"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { VehicleData } from "@/lib/types";

function motMonthsRemaining(expiry: string): number {
  const now = new Date();
  const exp = new Date(expiry);
  return Math.max(0, (exp.getFullYear() - now.getFullYear()) * 12 + (exp.getMonth() - now.getMonth()));
}

export default function MOTCheckerPage() {
  const [reg, setReg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vehicle, setVehicle] = useState<VehicleData | null>(null);

  const handleLookup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVehicle(null);
    try {
      const res = await fetch("/api/dvla", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reg }),
      });
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setVehicle(data);
    } catch {
      setError("Vehicle not found. Please check the registration and try again.");
    } finally {
      setLoading(false);
    }
  };

  const motMonths = vehicle ? motMonthsRemaining(vehicle.motExpiryDate) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#374151] mb-2">Free MOT Checker</h1>
      <p className="text-gray-500 mb-8">
        Check the MOT status of any UK vehicle instantly. DVLA verified data.
      </p>

      <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={reg}
          onChange={(e) => setReg(e.target.value.toUpperCase())}
          placeholder="Enter registration e.g. AB12 CDE"
          required
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg uppercase font-mono focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check MOT"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {vehicle && (
        <div className="space-y-6">
          {/* Vehicle info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-[#374151] mb-4">
              {vehicle.make} {vehicle.model}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Registration", value: vehicle.registrationNumber },
                { label: "Year", value: vehicle.yearOfManufacture.toString() },
                { label: "Colour", value: vehicle.colour },
                { label: "Fuel", value: vehicle.fuelType },
                { label: "Engine", value: `${vehicle.engineCapacity}cc` },
                { label: "CO2", value: `${vehicle.co2Emissions} g/km` },
              ].map((item) => (
                <div key={item.label}>
                  <span className="text-xs text-gray-500 block">{item.label}</span>
                  <span className="font-medium text-[#374151]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MOT Status */}
          <div className={`rounded-xl p-6 border ${
            motMonths >= 6 ? "bg-green-50 border-green-200" : motMonths >= 3 ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#374151]">MOT Status</h3>
                <p className={`text-2xl font-bold mt-1 ${
                  motMonths >= 6 ? "text-[#22c55e]" : motMonths >= 3 ? "text-yellow-600" : "text-red-600"
                }`}>
                  {vehicle.motStatus}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Expires: {new Date(vehicle.motExpiryDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <div className="text-center">
                <span className={`text-4xl font-bold ${
                  motMonths >= 6 ? "text-[#22c55e]" : motMonths >= 3 ? "text-yellow-600" : "text-red-600"
                }`}>
                  {motMonths}
                </span>
                <span className="text-sm text-gray-500 block">months left</span>
              </div>
            </div>
          </div>

          {/* Tax status */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-bold text-[#374151] mb-2">Tax Status</h3>
            <p className="text-gray-600">
              <strong>{vehicle.taxStatus}</strong> — due {new Date(vehicle.taxDueDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          {vehicle.mileage && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-[#374151] mb-2">Last Recorded Mileage</h3>
              <p className="text-2xl font-bold text-[#374151]">{vehicle.mileage.toLocaleString()} miles</p>
            </div>
          )}

          {/* CTA */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <h3 className="font-bold text-[#374151] mb-2">Buying this car?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Check if it&apos;s listed on BuyAndScrap for the best price.
            </p>
            <Link
              href="/cars"
              className="inline-block bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Search BuyAndScrap
            </Link>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Data sourced from DVLA. For official records, visit gov.uk/check-mot-history
          </p>
        </div>
      )}

      {!vehicle && !error && (
        <div className="mt-8 space-y-6">
          <div className="adsense-slot h-[250px] rounded">Ad Space</div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-[#374151] mb-4">Why check the MOT?</h2>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Verify the MOT expiry date before buying a car</span>
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Check for advisories that might become failures</span>
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>See mileage history to spot potential clocking</span>
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>It&apos;s completely free — data comes from the DVLA</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
