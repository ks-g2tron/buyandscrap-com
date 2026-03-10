"use client";

import { useEffect, useState } from "react";

interface Lead {
  id: string;
  fullName: string;
  phone: string;
  registration: string;
  postcode: string;
  make: string;
  model: string;
  year: string;
  createdAt: string;
}

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        setLeads(data.reverse());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xl font-bold text-secondary">
              Buy<span className="text-primary">&amp;</span>Scrap
            </a>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
              Admin
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {leads.length} lead{leads.length !== 1 ? "s" : ""}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-secondary mb-6">
          Lead Submissions
        </h1>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No leads yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Reg</th>
                  <th className="px-4 py-3 font-semibold">Postcode</th>
                  <th className="px-4 py-3 font-semibold">Make</th>
                  <th className="px-4 py-3 font-semibold">Model</th>
                  <th className="px-4 py-3 font-semibold">Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleString("en-GB")}
                    </td>
                    <td className="px-4 py-3 font-medium">{lead.fullName}</td>
                    <td className="px-4 py-3">{lead.phone}</td>
                    <td className="px-4 py-3 font-mono uppercase">
                      {lead.registration}
                    </td>
                    <td className="px-4 py-3 uppercase">{lead.postcode}</td>
                    <td className="px-4 py-3">{lead.make || "—"}</td>
                    <td className="px-4 py-3">{lead.model || "—"}</td>
                    <td className="px-4 py-3">{lead.year || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
