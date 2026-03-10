"use client";

import { useState, FormEvent } from "react";
import { VehicleData } from "@/lib/types";

type Step = 1 | 2 | 3;

export default function SellPage() {
  const [step, setStep] = useState<Step>(1);
  const [reg, setReg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Step 2 fields
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<string>("solid-runner");
  const [knownFaults, setKnownFaults] = useState("");
  const [description, setDescription] = useState("");
  const [mileage, setMileage] = useState("");

  // Step 3 fields
  const [sellerName, setSellerName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [postcode, setPostcode] = useState("");

  const lookupReg = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dvla", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reg }),
      });
      if (!res.ok) throw new Error("Vehicle not found");
      const data = await res.json();
      setVehicle(data);
      if (data.mileage) setMileage(data.mileage.toString());
      setStep(2);
    } catch {
      setError("Could not find that vehicle. Please check the registration and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reg: vehicle?.registrationNumber || reg,
          make: vehicle?.make || "",
          model: vehicle?.model || "",
          year: vehicle?.yearOfManufacture || 0,
          colour: vehicle?.colour || "",
          fuel: vehicle?.fuelType || "Petrol",
          mileage: Number(mileage) || 0,
          mot_expiry: vehicle?.motExpiryDate || "",
          price: Number(price),
          condition,
          known_faults: knownFaults,
          description,
          photos: [],
          seller_name: sellerName,
          seller_email: sellerEmail,
          seller_phone: sellerPhone,
          postcode,
          location: postcode.split(" ")[0],
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-[#374151] mb-4">Listing Submitted!</h1>
        <p className="text-gray-600 mb-2">Your car has been submitted for review.</p>
        <p className="text-gray-500 text-sm mb-8">We&apos;ll review it shortly and it will appear on the site once approved.</p>
        <a href="/cars" className="inline-block bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 px-6 rounded-lg transition-colors">
          Browse Cars
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#374151] mb-2">Sell Your Car</h1>
      <p className="text-gray-500 mb-8">Free to list. No commission. Takes under 5 minutes.</p>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= s ? "bg-[#22c55e] text-white" : "bg-gray-200 text-gray-500"
            }`}>
              {s}
            </div>
            <span className={`text-xs hidden sm:block ${step >= s ? "text-[#374151] font-medium" : "text-gray-400"}`}>
              {s === 1 ? "Your Reg" : s === 2 ? "Car Details" : "Your Details"}
            </span>
            {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? "bg-[#22c55e]" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Enter Reg */}
      {step === 1 && (
        <form onSubmit={lookupReg} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Enter your registration number
            </label>
            <input
              type="text"
              value={reg}
              onChange={(e) => setReg(e.target.value.toUpperCase())}
              placeholder="e.g. AB12 CDE"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg uppercase font-mono focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-400 mt-2">We&apos;ll auto-fill your car details from the DVLA</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Looking up..." : "Look Up My Car"}
          </button>
        </form>
      )}

      {/* Step 2: Car Details */}
      {step === 2 && vehicle && (
        <div className="space-y-6">
          {/* Auto-filled vehicle info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-bold text-[#374151] mb-2">Vehicle Found</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-500">Reg:</span> <strong>{vehicle.registrationNumber}</strong></div>
              <div><span className="text-gray-500">Make:</span> <strong>{vehicle.make}</strong></div>
              <div><span className="text-gray-500">Model:</span> <strong>{vehicle.model}</strong></div>
              <div><span className="text-gray-500">Year:</span> <strong>{vehicle.yearOfManufacture}</strong></div>
              <div><span className="text-gray-500">Colour:</span> <strong>{vehicle.colour}</strong></div>
              <div><span className="text-gray-500">Fuel:</span> <strong>{vehicle.fuelType}</strong></div>
              <div><span className="text-gray-500">MOT Expires:</span> <strong>{vehicle.motExpiryDate}</strong></div>
              <div><span className="text-gray-500">MOT Status:</span> <strong className="text-[#22c55e]">{vehicle.motStatus}</strong></div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Current Mileage</label>
            <input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder="e.g. 85000"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Asking Price (&pound;) *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 800"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Condition *</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none"
            >
              <option value="solid-runner">Solid Runner — drives well, no major issues</option>
              <option value="minor-issues">Minor Issues — runs fine, some things to note</option>
              <option value="rough-but-drives">Rough But Drives — gets you A to B, needs TLC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Known Faults *</label>
            <textarea
              value={knownFaults}
              onChange={(e) => setKnownFaults(e.target.value)}
              placeholder="Be honest — list any known faults, issues, or things the buyer should know. This builds trust and sells cars faster."
              required
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Honest disclosures are required. Buyers trust transparent sellers.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Anything else you'd like buyers to know about the car?"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (!price || !knownFaults) {
                  setError("Please fill in the required fields (price and known faults).");
                  return;
                }
                setError("");
                setStep(3);
              }}
              className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 rounded-lg transition-colors"
            >
              Next: Your Details
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Seller Details */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Your Name *</label>
            <input
              type="text"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              placeholder="e.g. Dave M"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Email *</label>
            <input
              type="email"
              value={sellerEmail}
              onChange={(e) => setSellerEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Phone</label>
            <input
              type="tel"
              value={sellerPhone}
              onChange={(e) => setSellerPhone(e.target.value)}
              placeholder="07xxx xxxxxx"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Postcode *</label>
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.toUpperCase())}
              placeholder="e.g. M1 1AA"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 uppercase focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Submitting..." : "List My Car Free"}
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Your listing will be reviewed before going live. Your email and phone are only shared when a buyer contacts you.
          </p>
        </form>
      )}
    </div>
  );
}
