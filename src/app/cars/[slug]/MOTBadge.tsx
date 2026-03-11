"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MOTBadgeProps {
  reg: string;
}

export default function MOTBadge({ reg }: MOTBadgeProps) {
  const [status, setStatus] = useState<"loading" | "pass" | "fail" | "error">("loading");
  const [expiry, setExpiry] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMOT() {
      try {
        const res = await fetch(`/api/mot?reg=${encodeURIComponent(reg)}`);
        if (!res.ok) {
          if (!cancelled) setStatus("error");
          return;
        }
        const data = await res.json();
        if (cancelled) return;

        const tests = data.motTests || [];
        const latest = tests[0];
        if (latest?.testResult === "PASSED") {
          setStatus("pass");
          setExpiry(latest.expiryDate || null);
        } else {
          setStatus("fail");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    fetchMOT();
    return () => { cancelled = true; };
  }, [reg]);

  if (status === "loading") {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-gray-400 animate-pulse">
        <span className="w-2 h-2 bg-gray-300 rounded-full" />
        Checking live MOT...
      </div>
    );
  }

  if (status === "error") return null;

  const months = expiry ? motMonthsFrom(expiry) : 0;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full border ${
        status === "pass"
          ? months >= 6 ? "bg-green-100 text-green-800 border-green-200" : months >= 3 ? "bg-yellow-100 text-yellow-800 border-yellow-200" : "bg-red-100 text-red-800 border-red-200"
          : "bg-red-100 text-red-800 border-red-200"
      }`}>
        <span className={`w-2 h-2 rounded-full ${
          status === "pass"
            ? months >= 6 ? "bg-green-500" : months >= 3 ? "bg-yellow-500" : "bg-red-500"
            : "bg-red-500"
        }`} />
        {status === "pass" ? `MOT: ${months}mo left` : "MOT: FAILED"}
      </span>
      <Link
        href={`/mot-checker?reg=${encodeURIComponent(reg)}`}
        className="text-sm text-[#22c55e] hover:text-[#16a34a] font-medium underline underline-offset-2"
      >
        View full MOT history
      </Link>
    </div>
  );
}

function motMonthsFrom(expiry: string): number {
  const now = new Date();
  const exp = new Date(expiry);
  return Math.max(0, (exp.getFullYear() - now.getFullYear()) * 12 + (exp.getMonth() - now.getMonth()));
}
