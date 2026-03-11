import type { MOTVehicle, MOTTest, MOTDefect, MOTHistoryResponse } from "./types";

// Cached token
let cachedToken: { accessToken: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.accessToken;
  }

  const tokenUrl = process.env.MOT_TOKEN_URL;
  const clientId = process.env.MOT_CLIENT_ID;
  const clientSecret = process.env.MOT_CLIENT_SECRET;
  const scope = process.env.MOT_SCOPE_URL;

  if (!tokenUrl || !clientId || !clientSecret || !scope) {
    throw new Error("MOT API credentials not configured");
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: scope,
  });

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token request failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.accessToken;
}

export async function getVehicleHistory(reg: string): Promise<MOTHistoryResponse> {
  const cleanReg = reg.toUpperCase().replace(/\s/g, "");
  const apiKey = process.env.MOT_API_KEY;

  if (!apiKey) {
    throw new Error("MOT_API_KEY not configured");
  }

  const accessToken = await getAccessToken();

  const res = await fetch(
    `https://history.mot.api.gov.uk/v1/trade/vehicles/registration/${encodeURIComponent(cleanReg)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-API-Key": apiKey,
        Accept: "application/json",
      },
    }
  );

  if (res.status === 404) {
    throw new MotNotFoundError("Vehicle not found");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MOT API error (${res.status}): ${text}`);
  }

  const data = await res.json();

  // The API returns the vehicle object directly with motTests embedded
  const vehicle: MOTVehicle = {
    registration: data.registration || cleanReg,
    make: data.make || "",
    model: data.model || "",
    colour: data.colour || data.primaryColour || "",
    fuelType: data.fuelType || "",
    firstUsedDate: data.firstUsedDate || "",
    manufactureYear: data.manufactureYear || "",
    primaryColour: data.primaryColour || data.colour || "",
    registrationDate: data.registrationDate || "",
    motTests: (data.motTests || []).map(mapMotTest),
  };

  return {
    vehicle,
    motTests: vehicle.motTests,
  };
}

function mapMotTest(raw: Record<string, unknown>): MOTTest {
  return {
    completedDate: (raw.completedDate as string) || "",
    testResult: (raw.testResult as "PASSED" | "FAILED") || "FAILED",
    expiryDate: raw.expiryDate as string | undefined,
    odometerValue: String(raw.odometerValue || "0"),
    odometerUnit: (raw.odometerUnit as string) || "mi",
    odometerResultType: (raw.odometerResultType as string) || "READ",
    motTestNumber: String(raw.motTestNumber || ""),
    defects: Array.isArray(raw.defects)
      ? raw.defects.map(
          (d: Record<string, unknown>): MOTDefect => ({
            text: (d.text as string) || "",
            type: (d.type as MOTDefect["type"]) || "ADVISORY",
            dangerous: Boolean(d.dangerous),
          })
        )
      : undefined,
  };
}

export class MotNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MotNotFoundError";
  }
}
