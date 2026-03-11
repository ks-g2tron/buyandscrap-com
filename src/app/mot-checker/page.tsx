"use client";

import { useState, useEffect, FormEvent, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { MOTHistoryResponse, MOTTest, MOTDefect } from "@/lib/types";

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function motMonthsRemaining(expiry: string): number {
  if (!expiry) return 0;
  const now = new Date();
  const exp = new Date(expiry);
  return Math.max(0, (exp.getFullYear() - now.getFullYear()) * 12 + (exp.getMonth() - now.getMonth()));
}

function latestExpiryDate(tests: MOTTest[]): string | null {
  for (const t of tests) {
    if (t.testResult === "PASSED" && t.expiryDate) return t.expiryDate;
  }
  return null;
}

function defectColor(type: MOTDefect["type"]): string {
  switch (type) {
    case "DANGEROUS": return "bg-red-100 text-red-800 border-red-200";
    case "MAJOR":
    case "FAIL": return "bg-red-50 text-red-700 border-red-200";
    case "ADVISORY":
    case "MINOR": return "bg-amber-50 text-amber-800 border-amber-200";
    case "PRS": return "bg-blue-50 text-blue-700 border-blue-200";
    default: return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function defectLabel(type: MOTDefect["type"]): string {
  switch (type) {
    case "DANGEROUS": return "Dangerous";
    case "MAJOR": return "Major";
    case "FAIL": return "Fail";
    case "ADVISORY": return "Advisory";
    case "MINOR": return "Minor";
    case "PRS": return "PRS";
    default: return type;
  }
}

export default function MOTCheckerPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-10"><p className="text-gray-400">Loading...</p></div>}>
      <MOTCheckerInner />
    </Suspense>
  );
}

function MOTCheckerInner() {
  const searchParams = useSearchParams();
  const [reg, setReg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<MOTHistoryResponse | null>(null);

  const doLookup = useCallback(async (regNum: string) => {
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(`/api/mot?reg=${encodeURIComponent(regNum)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Vehicle not found");
      }
      const result: MOTHistoryResponse = await res.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Vehicle not found. Please check the registration and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-lookup if ?reg= query param is present
  useEffect(() => {
    const qReg = searchParams.get("reg");
    if (qReg) {
      setReg(qReg.toUpperCase());
      doLookup(qReg);
    }
  }, [searchParams, doLookup]);

  const handleLookup = async (e: FormEvent) => {
    e.preventDefault();
    doLookup(reg);
  };

  const vehicle = data?.vehicle;
  const tests = data?.motTests || [];
  const expiry = vehicle ? latestExpiryDate(tests) : null;
  const motMonths = expiry ? motMonthsRemaining(expiry) : 0;
  const latestTest = tests[0];
  const passed = latestTest?.testResult === "PASSED";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#374151] mb-2">Free MOT History Checker</h1>
      <p className="text-gray-500 mb-8">
        Check the full MOT history of any UK vehicle instantly. Data from DVSA.
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
                { label: "Registration", value: vehicle.registration },
                { label: "Year", value: vehicle.manufactureYear || vehicle.firstUsedDate?.slice(0, 4) || "—" },
                { label: "Colour", value: vehicle.primaryColour || vehicle.colour },
                { label: "Fuel", value: vehicle.fuelType },
                { label: "First Used", value: formatDate(vehicle.firstUsedDate) },
                { label: "Registered", value: formatDate(vehicle.registrationDate) },
              ].map((item) => (
                <div key={item.label}>
                  <span className="text-xs text-gray-500 block">{item.label}</span>
                  <span className="font-medium text-[#374151]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MOT Status — big pass/fail banner */}
          <div className={`rounded-xl p-6 border ${
            passed
              ? motMonths >= 6 ? "bg-green-50 border-green-200" : motMonths >= 3 ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200"
              : "bg-red-50 border-red-200"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#374151]">MOT Status</h3>
                <p className={`text-3xl font-extrabold mt-1 ${
                  passed ? "text-[#22c55e]" : "text-red-600"
                }`}>
                  {passed ? "PASS" : "FAIL"}
                </p>
                {expiry && (
                  <p className="text-sm text-gray-600 mt-1">
                    Expires: {formatDate(expiry)}
                  </p>
                )}
                {latestTest && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last tested: {formatDate(latestTest.completedDate)}
                  </p>
                )}
              </div>
              {passed && expiry && (
                <div className="text-center">
                  <span className={`text-4xl font-bold ${
                    motMonths >= 6 ? "text-[#22c55e]" : motMonths >= 3 ? "text-yellow-600" : "text-red-600"
                  }`}>
                    {motMonths}
                  </span>
                  <span className="text-sm text-gray-500 block">months left</span>
                </div>
              )}
            </div>
          </div>

          {/* Mileage at last test */}
          {latestTest && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-[#374151] mb-2">Last Recorded Mileage</h3>
              <p className="text-2xl font-bold text-[#374151]">
                {parseInt(latestTest.odometerValue).toLocaleString()} {latestTest.odometerUnit}
              </p>
            </div>
          )}

          {/* Full MOT test history */}
          {tests.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-[#374151] mb-4">
                Full MOT History ({tests.length} {tests.length === 1 ? "test" : "tests"})
              </h3>
              <div className="space-y-4">
                {tests.map((test, i) => (
                  <div key={test.motTestNumber || i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    {/* Test header */}
                    <div className={`px-5 py-3 flex items-center justify-between ${
                      test.testResult === "PASSED" ? "bg-green-50 border-b border-green-200" : "bg-red-50 border-b border-red-200"
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white ${
                          test.testResult === "PASSED" ? "bg-[#22c55e]" : "bg-red-500"
                        }`}>
                          {test.testResult === "PASSED" ? "✓" : "✗"}
                        </span>
                        <div>
                          <span className={`font-bold ${
                            test.testResult === "PASSED" ? "text-[#22c55e]" : "text-red-600"
                          }`}>
                            {test.testResult}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            {formatDate(test.completedDate)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <span className="text-gray-600 font-medium">
                          {parseInt(test.odometerValue).toLocaleString()} {test.odometerUnit}
                        </span>
                        {test.expiryDate && (
                          <span className="text-gray-400 block text-xs">
                            Expires {formatDate(test.expiryDate)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Defects */}
                    {test.defects && test.defects.length > 0 && (
                      <div className="px-5 py-3 space-y-2">
                        {test.defects.map((defect, j) => (
                          <div key={j} className={`flex items-start gap-2 text-sm px-3 py-2 rounded border ${defectColor(defect.type)}`}>
                            <span className="font-semibold text-xs uppercase mt-0.5 shrink-0">
                              {defectLabel(defect.type)}
                            </span>
                            <span>{defect.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* No defects */}
                    {(!test.defects || test.defects.length === 0) && test.testResult === "PASSED" && (
                      <div className="px-5 py-3 text-sm text-gray-400">
                        No advisories or defects
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
            Data sourced from DVSA MOT History API. For official records, visit gov.uk/check-mot-history
          </p>
        </div>
      )}

      {!data && !error && (
        <div className="mt-8 space-y-6">
          <div className="adsense-slot h-[250px] rounded">Ad Space</div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-[#374151] mb-4">Why check the MOT history?</h2>
            <ul className="space-y-3 text-gray-600 text-sm">
              {[
                "Verify the MOT expiry date before buying a car",
                "Check for advisories that might become failures",
                "See mileage history to spot potential clocking",
                "View past failures and repairs",
                "It\u2019s completely free \u2014 data comes from the DVSA",
              ].map((text) => (
                <li key={text} className="flex gap-2">
                  <svg className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
