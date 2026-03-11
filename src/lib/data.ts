import { supabaseAdmin } from "./supabase";
import { Listing, Contact, BlogPost } from "./types";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function slugify(make: string, model: string, reg: string): string {
  return `${make}-${model}-${reg}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Listings
export async function getListings(): Promise<Listing[]> {
  const { data, error } = await supabaseAdmin
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching listings:", error.message);
    return [];
  }
  return (data || []).map(mapListingRow);
}

export async function getApprovedListings(): Promise<Listing[]> {
  const { data, error } = await supabaseAdmin
    .from("listings")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching approved listings:", error.message);
    return [];
  }
  return (data || []).map(mapListingRow);
}

export async function getListingBySlug(
  slug: string
): Promise<Listing | undefined> {
  const { data, error } = await supabaseAdmin
    .from("listings")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return undefined;
  return mapListingRow(data);
}

export async function createListing(
  data: Omit<Listing, "id" | "slug" | "created_at" | "status" | "featured">
): Promise<Listing> {
  const id = generateId();
  const slug = slugify(data.make, data.model, data.reg);

  const row = {
    id,
    slug,
    status: "pending",
    featured: false,
    reg: data.reg,
    make: data.make,
    model: data.model,
    year: data.year,
    colour: data.colour,
    fuel: data.fuel,
    mileage: data.mileage,
    mot_expiry: data.mot_expiry || null,
    price: data.price,
    condition: data.condition,
    known_faults: data.known_faults,
    description: data.description,
    photos: data.photos || [],
    seller_id: data.seller_id,
    seller_name: data.seller_name,
    seller_email: data.seller_email,
    seller_phone: data.seller_phone,
    location: data.location,
    postcode: data.postcode,
  };

  const { data: inserted, error } = await supabaseAdmin
    .from("listings")
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error("Error creating listing:", error.message);
    throw new Error("Failed to create listing");
  }

  return mapListingRow(inserted);
}

export async function updateListingStatus(
  id: string,
  status: Listing["status"]
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("listings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error updating listing status:", error.message);
  }
}

// Contacts
export async function getContacts(): Promise<Contact[]> {
  const { data, error } = await supabaseAdmin
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contacts:", error.message);
    return [];
  }
  return (data || []).map(mapContactRow);
}

export async function createContact(
  data: Omit<Contact, "id" | "created_at">
): Promise<Contact> {
  const id = generateId();

  const { data: inserted, error } = await supabaseAdmin
    .from("contacts")
    .insert({
      id,
      listing_id: data.listing_id,
      buyer_name: data.buyer_name,
      buyer_email: data.buyer_email,
      buyer_phone: data.buyer_phone,
      message: data.message,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating contact:", error.message);
    throw new Error("Failed to create contact");
  }

  return mapContactRow(inserted);
}

// Blog posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error.message);
    return [];
  }
  return data || [];
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return undefined;
  return data;
}

// Row mappers — Supabase returns slightly different shapes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapListingRow(row: any): Listing {
  return {
    id: row.id,
    reg: row.reg,
    make: row.make || "",
    model: row.model || "",
    year: row.year || 0,
    colour: row.colour || "",
    fuel: row.fuel || "",
    mileage: row.mileage || 0,
    mot_expiry: row.mot_expiry || "",
    price: row.price,
    condition: row.condition,
    known_faults: row.known_faults,
    description: row.description || "",
    photos: row.photos || [],
    seller_id: row.seller_id || "",
    seller_name: row.seller_name || "",
    seller_email: row.seller_email || "",
    seller_phone: row.seller_phone || "",
    location: row.location || "",
    postcode: row.postcode || "",
    status: row.status,
    featured: row.featured || false,
    created_at: row.created_at,
    slug: row.slug,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapContactRow(row: any): Contact {
  return {
    id: row.id,
    listing_id: row.listing_id,
    buyer_email: row.buyer_email,
    buyer_name: row.buyer_name,
    buyer_phone: row.buyer_phone || "",
    message: row.message,
    created_at: row.created_at,
  };
}

// Seed data for demo — inserts if listings table is empty
export async function seedDemoListings(): Promise<void> {
  const { count, error } = await supabaseAdmin
    .from("listings")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("Error checking listings count:", error.message);
    return;
  }
  if ((count || 0) > 0) return;

  const demoListings = [
    {
      id: generateId(),
      reg: "YB14 KMF",
      make: "Ford",
      model: "Focus",
      year: 2014,
      colour: "Silver",
      fuel: "Petrol",
      mileage: 89000,
      mot_expiry: "2027-01-15",
      price: 1200,
      condition: "solid-runner",
      known_faults:
        "Small scratch on rear bumper. Tyres will need replacing within 6 months.",
      description:
        "Reliable daily driver. Used for school runs and commuting. Starts every time, good on fuel.",
      photos: [],
      seller_id: "demo1",
      seller_name: "Dave M",
      seller_email: "demo@example.com",
      seller_phone: "07700900000",
      location: "Manchester",
      postcode: "M1 1AA",
      status: "approved",
      featured: true,
      slug: "ford-focus-yb14kmf",
    },
    {
      id: generateId(),
      reg: "WF62 HJN",
      make: "Vauxhall",
      model: "Corsa",
      year: 2012,
      colour: "Blue",
      fuel: "Petrol",
      mileage: 74000,
      mot_expiry: "2026-11-20",
      price: 850,
      condition: "minor-issues",
      known_faults:
        "Engine management light on intermittently — likely O2 sensor. Paint fade on bonnet.",
      description:
        "Great little runaround. Cheap insurance and tax. Perfect first car or second vehicle.",
      photos: [],
      seller_id: "demo2",
      seller_name: "Sarah K",
      seller_email: "demo2@example.com",
      seller_phone: "07700900001",
      location: "Leeds",
      postcode: "LS1 1BA",
      status: "approved",
      featured: true,
      slug: "vauxhall-corsa-wf62hjn",
    },
    {
      id: generateId(),
      reg: "KN59 LPR",
      make: "Volkswagen",
      model: "Golf",
      year: 2009,
      colour: "Black",
      fuel: "Diesel",
      mileage: 142000,
      mot_expiry: "2026-08-05",
      price: 1500,
      condition: "solid-runner",
      known_faults:
        "Clutch is getting heavy — maybe 10k miles left. Rear wiper doesn't work.",
      description:
        "High miles but drives mint. Diesel so very economical. Full service history up to 120k.",
      photos: [],
      seller_id: "demo3",
      seller_name: "Mike R",
      seller_email: "demo3@example.com",
      seller_phone: "07700900002",
      location: "Birmingham",
      postcode: "B1 1BB",
      status: "approved",
      featured: false,
      slug: "volkswagen-golf-kn59lpr",
    },
    {
      id: generateId(),
      reg: "EY11 WVM",
      make: "Peugeot",
      model: "208",
      year: 2011,
      colour: "White",
      fuel: "Petrol",
      mileage: 68000,
      mot_expiry: "2027-03-22",
      price: 950,
      condition: "minor-issues",
      known_faults:
        "Dent on passenger door. AC doesn't blow cold. Otherwise solid.",
      description:
        "Nice looking car, economical. MOT until March 2027 so loads of life left.",
      photos: [],
      seller_id: "demo4",
      seller_name: "Jenny P",
      seller_email: "demo4@example.com",
      seller_phone: "07700900003",
      location: "Liverpool",
      postcode: "L1 1JD",
      status: "approved",
      featured: true,
      slug: "peugeot-208-ey11wvm",
    },
    {
      id: generateId(),
      reg: "BF58 TYK",
      make: "Toyota",
      model: "Yaris",
      year: 2008,
      colour: "Red",
      fuel: "Petrol",
      mileage: 95000,
      mot_expiry: "2026-09-10",
      price: 700,
      condition: "rough-but-drives",
      known_faults:
        "Rust on wheel arches. Exhaust is noisy. Passenger window slow to open. Needs new brake pads soon.",
      description:
        "It's rough around the edges but it'll get you from A to B. Toyota reliability. Still starts first time every time.",
      photos: [],
      seller_id: "demo5",
      seller_name: "Chris T",
      seller_email: "demo5@example.com",
      seller_phone: "07700900004",
      location: "Sheffield",
      postcode: "S1 2BJ",
      status: "approved",
      featured: false,
      slug: "toyota-yaris-bf58tyk",
    },
    {
      id: generateId(),
      reg: "HJ13 NBV",
      make: "Nissan",
      model: "Micra",
      year: 2013,
      colour: "Grey",
      fuel: "Petrol",
      mileage: 52000,
      mot_expiry: "2027-02-28",
      price: 1100,
      condition: "solid-runner",
      known_faults: "Minor stone chips on bonnet. Otherwise clean.",
      description:
        "Low mileage, one lady owner. Perfect for someone who needs a reliable cheap car.",
      photos: [],
      seller_id: "demo6",
      seller_name: "Pat W",
      seller_email: "demo6@example.com",
      seller_phone: "07700900005",
      location: "Newcastle",
      postcode: "NE1 4ST",
      status: "approved",
      featured: true,
      slug: "nissan-micra-hj13nbv",
    },
  ];

  const { error: insertError } = await supabaseAdmin
    .from("listings")
    .insert(demoListings);

  if (insertError) {
    console.error("Error seeding demo listings:", insertError.message);
  }
}
