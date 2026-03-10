import { NextRequest, NextResponse } from "next/server";
import { updateListingStatus } from "@/lib/data";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json();

    if (!["approved", "rejected", "pending", "sold"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await updateListingStatus(params.id, status);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 });
  }
}
