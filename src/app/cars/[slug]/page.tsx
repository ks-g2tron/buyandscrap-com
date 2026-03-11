import { notFound } from "next/navigation";
import { getListingBySlug, getApprovedListings, seedDemoListings } from "@/lib/data";
import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./ContactForm";
import MOTBadge from "./MOTBadge";

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
    case "solid-runner": return "bg-green-100 text-green-800 border-green-200";
    case "minor-issues": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "rough-but-drives": return "bg-orange-100 text-orange-800 border-orange-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function motMonthsRemaining(expiry: string): number {
  const now = new Date();
  const exp = new Date(expiry);
  return Math.max(0, (exp.getFullYear() - now.getFullYear()) * 12 + (exp.getMonth() - now.getMonth()));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  await seedDemoListings();
  const listing = await getListingBySlug(params.slug);
  if (!listing) return { title: "Car Not Found" };

  return {
    title: `${listing.make} ${listing.model} ${listing.year} — £${listing.price}`,
    description: `Buy this ${listing.year} ${listing.make} ${listing.model} for £${listing.price}. ${listing.mileage.toLocaleString()} miles, ${motMonthsRemaining(listing.mot_expiry)} months MOT remaining. ${listing.condition === "solid-runner" ? "Solid runner." : ""} ${listing.location}.`,
    openGraph: {
      title: `${listing.make} ${listing.model} ${listing.year} — £${listing.price} | BuyAndScrap`,
      description: `${listing.year} ${listing.make} ${listing.model}, ${listing.mileage.toLocaleString()} miles, ${motMonthsRemaining(listing.mot_expiry)} months MOT. ${listing.location}.`,
    },
  };
}

export default async function ListingPage({ params }: { params: { slug: string } }) {
  await seedDemoListings();
  const listing = await getListingBySlug(params.slug);
  if (!listing) notFound();

  const allListings = await getApprovedListings();
  const similar = allListings
    .filter((l) => l.id !== listing.id)
    .sort((a, b) => Math.abs(a.price - listing.price) - Math.abs(b.price - listing.price))
    .slice(0, 3);

  const motMonths = motMonthsRemaining(listing.mot_expiry);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#22c55e]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/cars" className="hover:text-[#22c55e]">Cars</Link>
        <span className="mx-2">/</span>
        <span className="text-[#374151]">{listing.make} {listing.model}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo / placeholder */}
          <div className="bg-gray-200 rounded-xl h-64 md:h-80 flex items-center justify-center text-gray-400">
            {listing.photos.length > 0 ? (
              <img src={listing.photos[0]} alt={`${listing.make} ${listing.model}`} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>No photos yet</span>
              </div>
            )}
          </div>

          {/* Title + price */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-3xl font-extrabold text-[#374151]">
              {listing.make} {listing.model}
            </h1>
            <span className="text-3xl font-extrabold text-[#22c55e]">
              &pound;{listing.price.toLocaleString()}
            </span>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Year", value: listing.year.toString() },
              { label: "Mileage", value: `${listing.mileage.toLocaleString()} mi` },
              { label: "Fuel", value: listing.fuel },
              { label: "Colour", value: listing.colour },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50 rounded-lg p-3 text-center">
                <span className="text-xs text-gray-500 block">{stat.label}</span>
                <span className="font-bold text-[#374151]">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* MOT info */}
          <div className={`rounded-lg p-4 border ${motMonths >= 6 ? "bg-green-50 border-green-200" : motMonths >= 3 ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200"}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#374151]">MOT Status</h3>
                <p className="text-sm text-gray-600">
                  Expires: {new Date(listing.mot_expiry).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-bold ${motMonths >= 6 ? "text-[#22c55e]" : motMonths >= 3 ? "text-yellow-600" : "text-red-600"}`}>
                  {motMonths}
                </span>
                <span className="text-sm text-gray-500 block">months left</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">MOT data from DVLA. Verify at gov.uk/check-mot-history</p>
          </div>

          {/* Live MOT status from DVSA */}
          {listing.reg && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-[#374151] mb-2">Live MOT Check (DVSA)</h3>
              <MOTBadge reg={listing.reg} />
            </div>
          )}

          {/* Condition */}
          <div>
            <h3 className="font-bold text-[#374151] mb-2">Condition</h3>
            <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full border ${conditionColor(listing.condition)}`}>
              {conditionLabel(listing.condition)}
            </span>
          </div>

          {/* Known faults */}
          <div>
            <h3 className="font-bold text-[#374151] mb-2">Known Faults</h3>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-gray-700 text-sm whitespace-pre-line">{listing.known_faults}</p>
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div>
              <h3 className="font-bold text-[#374151] mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{listing.description}</p>
            </div>
          )}

          {/* Ad slot */}
          <div className="adsense-slot h-[250px] rounded">Ad Space</div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-[#374151] mb-1">Seller</h3>
            <p className="text-gray-600">{listing.seller_name}</p>
            <p className="text-sm text-gray-500">{listing.location} &middot; {listing.postcode}</p>
          </div>

          {/* Contact form */}
          <ContactForm listingId={listing.id} sellerName={listing.seller_name} />

          {/* Ad slot */}
          <div className="adsense-slot h-[250px] rounded">Ad Space</div>
        </div>
      </div>

      {/* Similar listings */}
      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-[#374151] mb-6">Similar Cars</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {similar.map((car) => (
              <Link
                key={car.id}
                href={`/cars/${car.slug}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="h-36 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                  {car.make} {car.model}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-[#374151] text-sm group-hover:text-[#22c55e]">
                      {car.make} {car.model}
                    </h3>
                    <span className="font-bold text-[#22c55e]">&pound;{car.price.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {car.year} &middot; {car.mileage.toLocaleString()} mi &middot; {motMonthsRemaining(car.mot_expiry)} mo MOT
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
