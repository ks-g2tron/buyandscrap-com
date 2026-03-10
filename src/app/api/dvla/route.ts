import { NextRequest, NextResponse } from "next/server";
import { lookupVehicle } from "@/lib/dvla";

export async function POST(request: NextRequest) {
  try {
    const { reg } = await request.json();

    if (!reg || typeof reg !== "string" || reg.trim().length < 4) {
      return NextResponse.json({ error: "Invalid registration number" }, { status: 400 });
    }

    const vehicle = await lookupVehicle(reg.trim());

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch {
    return NextResponse.json({ error: "Failed to look up vehicle" }, { status: 500 });
  }
}
