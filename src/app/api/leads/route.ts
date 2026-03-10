import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const LEADS_FILE = path.join(process.cwd(), "leads.json");

interface Lead {
  id: string;
  fullName: string;
  phone: string;
  registration: string;
  postcode: string;
  make?: string;
  model?: string;
  year?: string;
  createdAt: string;
}

async function getLeads(): Promise<Lead[]> {
  try {
    const data = await fs.readFile(LEADS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { fullName, phone, registration, postcode, make, model, year } = body;

  if (!fullName || !phone || !registration || !postcode) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const lead: Lead = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    fullName,
    phone,
    registration,
    postcode,
    make: make || "",
    model: model || "",
    year: year || "",
    createdAt: new Date().toISOString(),
  };

  const leads = await getLeads();
  leads.push(lead);
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));

  return NextResponse.json({ success: true, id: lead.id });
}

export async function GET() {
  const leads = await getLeads();
  return NextResponse.json(leads);
}
