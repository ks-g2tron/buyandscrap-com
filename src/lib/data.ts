import { promises as fs } from "fs";
import path from "path";
import { Listing, Contact, BlogPost } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

async function readJSON<T>(file: string): Promise<T[]> {
  await ensureDir();
  try {
    const data = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeJSON<T>(file: string, data: T[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function slugify(make: string, model: string, reg: string): string {
  return `${make}-${model}-${reg}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

// Listings
export async function getListings(): Promise<Listing[]> {
  return readJSON<Listing>("listings.json");
}

export async function getApprovedListings(): Promise<Listing[]> {
  const listings = await getListings();
  return listings.filter((l) => l.status === "approved");
}

export async function getListingBySlug(slug: string): Promise<Listing | undefined> {
  const listings = await getListings();
  return listings.find((l) => l.slug === slug);
}

export async function createListing(data: Omit<Listing, "id" | "slug" | "created_at" | "status" | "featured">): Promise<Listing> {
  const listings = await getListings();
  const listing: Listing = {
    ...data,
    id: generateId(),
    slug: slugify(data.make, data.model, data.reg),
    status: "pending",
    featured: false,
    created_at: new Date().toISOString(),
  };
  listings.push(listing);
  await writeJSON("listings.json", listings);
  return listing;
}

export async function updateListingStatus(id: string, status: Listing["status"]): Promise<void> {
  const listings = await getListings();
  const idx = listings.findIndex((l) => l.id === id);
  if (idx !== -1) {
    listings[idx].status = status;
    await writeJSON("listings.json", listings);
  }
}

// Contacts
export async function getContacts(): Promise<Contact[]> {
  return readJSON<Contact>("contacts.json");
}

export async function createContact(data: Omit<Contact, "id" | "created_at">): Promise<Contact> {
  const contacts = await getContacts();
  const contact: Contact = {
    ...data,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  contacts.push(contact);
  await writeJSON("contacts.json", contacts);
  return contact;
}

// Blog posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  return readJSON<BlogPost>("blog_posts.json");
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug);
}

// Seed data for demo
export async function seedDemoListings(): Promise<void> {
  const existing = await getListings();
  if (existing.length > 0) return;

  const demoListings: Listing[] = [
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
      known_faults: "Small scratch on rear bumper. Tyres will need replacing within 6 months.",
      description: "Reliable daily driver. Used for school runs and commuting. Starts every time, good on fuel.",
      photos: [],
      seller_id: "demo1",
      seller_name: "Dave M",
      seller_email: "demo@example.com",
      seller_phone: "07700900000",
      location: "Manchester",
      postcode: "M1 1AA",
      status: "approved",
      featured: true,
      created_at: new Date().toISOString(),
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
      known_faults: "Engine management light on intermittently — likely O2 sensor. Paint fade on bonnet.",
      description: "Great little runaround. Cheap insurance and tax. Perfect first car or second vehicle.",
      photos: [],
      seller_id: "demo2",
      seller_name: "Sarah K",
      seller_email: "demo2@example.com",
      seller_phone: "07700900001",
      location: "Leeds",
      postcode: "LS1 1BA",
      status: "approved",
      featured: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
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
      known_faults: "Clutch is getting heavy — maybe 10k miles left. Rear wiper doesn't work.",
      description: "High miles but drives mint. Diesel so very economical. Full service history up to 120k.",
      photos: [],
      seller_id: "demo3",
      seller_name: "Mike R",
      seller_email: "demo3@example.com",
      seller_phone: "07700900002",
      location: "Birmingham",
      postcode: "B1 1BB",
      status: "approved",
      featured: false,
      created_at: new Date(Date.now() - 172800000).toISOString(),
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
      known_faults: "Dent on passenger door. AC doesn't blow cold. Otherwise solid.",
      description: "Nice looking car, economical. MOT until March 2027 so loads of life left.",
      photos: [],
      seller_id: "demo4",
      seller_name: "Jenny P",
      seller_email: "demo4@example.com",
      seller_phone: "07700900003",
      location: "Liverpool",
      postcode: "L1 1JD",
      status: "approved",
      featured: true,
      created_at: new Date(Date.now() - 259200000).toISOString(),
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
      known_faults: "Rust on wheel arches. Exhaust is noisy. Passenger window slow to open. Needs new brake pads soon.",
      description: "It's rough around the edges but it'll get you from A to B. Toyota reliability. Still starts first time every time.",
      photos: [],
      seller_id: "demo5",
      seller_name: "Chris T",
      seller_email: "demo5@example.com",
      seller_phone: "07700900004",
      location: "Sheffield",
      postcode: "S1 2BJ",
      status: "approved",
      featured: false,
      created_at: new Date(Date.now() - 345600000).toISOString(),
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
      description: "Low mileage, one lady owner. Perfect for someone who needs a reliable cheap car.",
      photos: [],
      seller_id: "demo6",
      seller_name: "Pat W",
      seller_email: "demo6@example.com",
      seller_phone: "07700900005",
      location: "Newcastle",
      postcode: "NE1 4ST",
      status: "approved",
      featured: true,
      created_at: new Date(Date.now() - 432000000).toISOString(),
      slug: "nissan-micra-hj13nbv",
    },
  ];

  await writeJSON("listings.json", demoListings);
}
