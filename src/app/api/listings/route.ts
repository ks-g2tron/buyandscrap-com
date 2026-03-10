import { NextRequest, NextResponse } from "next/server";
import { getApprovedListings, getListings, createListing } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";

  const listings = all ? await getListings() : await getApprovedListings();

  // Apply filters
  let filtered = [...listings];

  const make = searchParams.get("make");
  if (make) {
    filtered = filtered.filter((l) => l.make.toLowerCase() === make.toLowerCase());
  }

  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  if (minPrice) filtered = filtered.filter((l) => l.price >= Number(minPrice));
  if (maxPrice) filtered = filtered.filter((l) => l.price <= Number(maxPrice));

  const motMonths = searchParams.get("mot_months");
  if (motMonths) {
    const minDate = new Date();
    minDate.setMonth(minDate.getMonth() + Number(motMonths));
    filtered = filtered.filter((l) => new Date(l.mot_expiry) >= minDate);
  }

  const fuel = searchParams.get("fuel");
  if (fuel) {
    filtered = filtered.filter((l) => l.fuel.toLowerCase() === fuel.toLowerCase());
  }

  // Sort
  const sort = searchParams.get("sort") || "newest";
  switch (sort) {
    case "cheapest":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "most-mot":
      filtered.sort((a, b) => new Date(b.mot_expiry).getTime() - new Date(a.mot_expiry).getTime());
      break;
    case "newest":
    default:
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
  }

  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const required = ["reg", "make", "model", "year", "price", "condition", "known_faults", "seller_name", "seller_email", "postcode"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const listing = await createListing({
      reg: body.reg,
      make: body.make,
      model: body.model,
      year: Number(body.year),
      colour: body.colour || "",
      fuel: body.fuel || "Petrol",
      mileage: Number(body.mileage) || 0,
      mot_expiry: body.mot_expiry || "",
      price: Number(body.price),
      condition: body.condition,
      known_faults: body.known_faults,
      description: body.description || "",
      photos: body.photos || [],
      seller_id: body.seller_email,
      seller_name: body.seller_name,
      seller_email: body.seller_email,
      seller_phone: body.seller_phone || "",
      location: body.location || "",
      postcode: body.postcode,
    });

    return NextResponse.json({ success: true, listing });
  } catch {
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
