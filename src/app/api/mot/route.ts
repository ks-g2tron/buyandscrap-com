import { NextRequest, NextResponse } from "next/server";
import { getVehicleHistory, MotNotFoundError } from "@/lib/mot-api";

export async function GET(request: NextRequest) {
  const reg = request.nextUrl.searchParams.get("reg");

  if (!reg || reg.replace(/\s/g, "").length < 2) {
    return NextResponse.json(
      { error: "Please provide a valid registration number" },
      { status: 400 }
    );
  }

  // Basic UK reg format validation
  const cleanReg = reg.toUpperCase().replace(/\s/g, "");
  if (!/^[A-Z0-9]{2,7}$/.test(cleanReg)) {
    return NextResponse.json(
      { error: "Invalid registration format" },
      { status: 400 }
    );
  }

  try {
    const result = await getVehicleHistory(cleanReg);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof MotNotFoundError) {
      return NextResponse.json(
        { error: "Vehicle not found. Please check the registration and try again." },
        { status: 404 }
      );
    }

    console.error("MOT API error:", err);
    return NextResponse.json(
      { error: "Unable to fetch MOT history. Please try again later." },
      { status: 502 }
    );
  }
}
