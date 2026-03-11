import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const MIGRATION_SQL = `
-- Listings table
CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  reg TEXT NOT NULL,
  make TEXT,
  model TEXT,
  year INTEGER,
  colour TEXT,
  fuel TEXT,
  transmission TEXT,
  mileage INTEGER,
  mot_expiry DATE,
  price INTEGER NOT NULL,
  condition TEXT CHECK (condition IN ('solid-runner', 'minor-issues', 'rough-but-drives')),
  known_faults TEXT NOT NULL,
  description TEXT,
  photos TEXT[] DEFAULT '{}',
  seller_id TEXT,
  seller_name TEXT,
  seller_email TEXT,
  seller_phone TEXT,
  postcode TEXT,
  location TEXT,
  lat DECIMAL,
  lng DECIMAL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'sold', 'expired', 'rejected')),
  featured BOOLEAN DEFAULT false,
  slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  listing_id TEXT REFERENCES listings(id),
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  target_keyword TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS listings_status_idx ON listings(status);
CREATE INDEX IF NOT EXISTS listings_postcode_idx ON listings(postcode);
CREATE INDEX IF NOT EXISTS listings_make_idx ON listings(make);
CREATE INDEX IF NOT EXISTS listings_mot_expiry_idx ON listings(mot_expiry);
CREATE INDEX IF NOT EXISTS listings_created_at_idx ON listings(created_at DESC);

-- RLS Policies
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe re-run)
DROP POLICY IF EXISTS "Public listings are viewable by everyone" ON listings;
DROP POLICY IF EXISTS "Anyone can create a listing" ON listings;
DROP POLICY IF EXISTS "Anyone can submit contact" ON contacts;
DROP POLICY IF EXISTS "Public blog posts viewable" ON blog_posts;
DROP POLICY IF EXISTS "Service role full access listings" ON listings;
DROP POLICY IF EXISTS "Service role full access contacts" ON contacts;
DROP POLICY IF EXISTS "Service role full access blog_posts" ON blog_posts;

-- Anyone can read active/approved listings
CREATE POLICY "Public listings are viewable by everyone" ON listings
  FOR SELECT USING (status = 'approved' OR status = 'active');

-- Anyone can insert a listing (pending approval)
CREATE POLICY "Anyone can create a listing" ON listings
  FOR INSERT WITH CHECK (true);

-- Service role has full access to listings
CREATE POLICY "Service role full access listings" ON listings
  FOR ALL USING (auth.role() = 'service_role');

-- Anyone can submit a contact
CREATE POLICY "Anyone can submit contact" ON contacts
  FOR INSERT WITH CHECK (true);

-- Service role has full access to contacts
CREATE POLICY "Service role full access contacts" ON contacts
  FOR ALL USING (auth.role() = 'service_role');

-- Public can read published blog posts
CREATE POLICY "Public blog posts viewable" ON blog_posts
  FOR SELECT USING (published = true);

-- Service role has full access to blog_posts
CREATE POLICY "Service role full access blog_posts" ON blog_posts
  FOR ALL USING (auth.role() = 'service_role');
`;

export async function POST(request: NextRequest) {
  // Simple auth check — require a secret key
  const authHeader = request.headers.get("authorization");
  const setupKey = process.env.SUPABASE_SERVICE_KEY;
  if (!authHeader || authHeader !== `Bearer ${setupKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if tables already exist
    const { error: checkError } = await supabaseAdmin
      .from("listings")
      .select("id", { count: "exact", head: true });

    if (!checkError) {
      return NextResponse.json({
        message: "Tables already exist",
        migration_sql: "Not needed — tables are set up",
      });
    }

    // Tables don't exist — return the SQL to run in the Supabase SQL Editor
    return NextResponse.json({
      message:
        "Tables do not exist yet. Run the migration SQL in the Supabase SQL Editor at: https://supabase.com/dashboard/project/jyaorzbrpgvpdqqhiobv/sql/new",
      migration_sql: MIGRATION_SQL,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Setup check failed", details: String(err) },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Health check — see if tables exist
  const { error } = await supabaseAdmin
    .from("listings")
    .select("id", { count: "exact", head: true });

  return NextResponse.json({
    tables_exist: !error,
    error: error?.message || null,
  });
}
