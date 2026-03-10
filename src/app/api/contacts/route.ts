import { NextRequest, NextResponse } from "next/server";
import { createContact, getContacts } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.listing_id || !body.buyer_email || !body.buyer_name || !body.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const contact = await createContact({
      listing_id: body.listing_id,
      buyer_email: body.buyer_email,
      buyer_name: body.buyer_name,
      buyer_phone: body.buyer_phone || "",
      message: body.message,
    });

    return NextResponse.json({ success: true, contact });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function GET() {
  const contacts = await getContacts();
  return NextResponse.json(contacts);
}
