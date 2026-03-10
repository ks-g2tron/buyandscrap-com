"use client";

import { useEffect, useState } from "react";
import { Listing, Contact } from "@/lib/types";

type Tab = "listings" | "contacts" | "stats";

function conditionLabel(c: string) {
  switch (c) {
    case "solid-runner": return "Solid Runner";
    case "minor-issues": return "Minor Issues";
    case "rough-but-drives": return "Rough But Drives";
    default: return c;
  }
}

function statusColor(s: string) {
  switch (s) {
    case "approved": return "bg-green-100 text-green-800";
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "rejected": return "bg-red-100 text-red-800";
    case "sold": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("listings");
  const [listings, setListings] = useState<Listing[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/listings?all=true").then((r) => r.json()),
      fetch("/api/contacts").then((r) => r.json()),
    ]).then(([l, c]) => {
      setListings(l);
      setContacts(c);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: status as Listing["status"] } : l));
    }
  };

  const approved = listings.filter((l) => l.status === "approved").length;
  const pending = listings.filter((l) => l.status === "pending").length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#374151]">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Manage listings, contacts, and site activity</p>
        </div>
        <a href="/" className="text-sm text-[#22c55e] hover:underline">View site</a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Listings", value: listings.length, color: "text-[#374151]" },
          { label: "Approved", value: approved, color: "text-[#22c55e]" },
          { label: "Pending Review", value: pending, color: "text-yellow-600" },
          { label: "Contact Requests", value: contacts.length, color: "text-blue-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <span className="text-xs text-gray-500 block">{stat.label}</span>
            <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {(["listings", "contacts", "stats"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t ? "bg-white shadow text-[#374151]" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : tab === "listings" ? (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
          {listings.length === 0 ? (
            <p className="p-8 text-center text-gray-500">No listings yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Vehicle</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Condition</th>
                  <th className="px-4 py-3 font-semibold">Seller</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                      {new Date(l.created_at).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{l.make} {l.model} {l.year}</div>
                      <div className="text-xs text-gray-400 font-mono">{l.reg}</div>
                    </td>
                    <td className="px-4 py-3 font-medium">&pound;{l.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs">{conditionLabel(l.condition)}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs">{l.seller_name}</div>
                      <div className="text-xs text-gray-400">{l.seller_email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(l.status)}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {l.status !== "approved" && (
                          <button
                            onClick={() => updateStatus(l.id, "approved")}
                            className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100"
                          >
                            Approve
                          </button>
                        )}
                        {l.status !== "rejected" && (
                          <button
                            onClick={() => updateStatus(l.id, "rejected")}
                            className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : tab === "contacts" ? (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
          {contacts.length === 0 ? (
            <p className="p-8 text-center text-gray-500">No contact requests yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Buyer</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contacts.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                      {new Date(c.created_at).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-3 font-medium">{c.buyer_name}</td>
                    <td className="px-4 py-3 text-xs">{c.buyer_email}</td>
                    <td className="px-4 py-3 text-xs">{c.buyer_phone || "—"}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-xs truncate">{c.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">
          <p>Detailed analytics will be available once Google Analytics is connected.</p>
          <p className="text-sm mt-2">Current stats are shown in the cards above.</p>
        </div>
      )}
    </div>
  );
}
