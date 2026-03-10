import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free MOT Checker — Check Any Car",
  description:
    "Free MOT checker. Enter any UK registration to see MOT expiry, test history, mileage, and advisories. DVLA verified data.",
};

export default function MOTCheckerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-extrabold text-[#374151] mb-4">Free MOT Checker</h1>
      <p className="text-gray-600 mb-8">Check the MOT status of any UK vehicle. DVLA verified data.</p>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
        <p className="text-gray-700">MOT checker launching soon. Enter any reg to see full MOT history.</p>
      </div>
    </div>
  );
}
