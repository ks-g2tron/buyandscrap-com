import { VehicleData } from "./types";

// Mock DVLA data - replace with real API when key is available
// Real API: https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles

const MOCK_VEHICLES: Record<string, VehicleData> = {
  "YB14KMF": {
    registrationNumber: "YB14 KMF",
    make: "FORD",
    model: "FOCUS",
    colour: "SILVER",
    yearOfManufacture: 2014,
    fuelType: "PETROL",
    motExpiryDate: "2027-01-15",
    motStatus: "Valid",
    mileage: 89000,
    taxStatus: "Taxed",
    taxDueDate: "2026-12-01",
    engineCapacity: 1596,
    co2Emissions: 139,
  },
  "WF62HJN": {
    registrationNumber: "WF62 HJN",
    make: "VAUXHALL",
    model: "CORSA",
    colour: "BLUE",
    yearOfManufacture: 2012,
    fuelType: "PETROL",
    motExpiryDate: "2026-11-20",
    motStatus: "Valid",
    mileage: 74000,
    taxStatus: "Taxed",
    taxDueDate: "2026-09-15",
    engineCapacity: 1229,
    co2Emissions: 129,
  },
};

function generateMockVehicle(reg: string): VehicleData {
  const makes = ["FORD", "VAUXHALL", "VOLKSWAGEN", "PEUGEOT", "TOYOTA", "NISSAN", "BMW", "HONDA"];
  const models: Record<string, string[]> = {
    FORD: ["FOCUS", "FIESTA", "MONDEO", "KA"],
    VAUXHALL: ["CORSA", "ASTRA", "INSIGNIA"],
    VOLKSWAGEN: ["GOLF", "POLO", "PASSAT"],
    PEUGEOT: ["208", "308", "3008"],
    TOYOTA: ["YARIS", "COROLLA", "AYGO"],
    NISSAN: ["MICRA", "QASHQAI", "JUKE"],
    BMW: ["1 SERIES", "3 SERIES"],
    HONDA: ["CIVIC", "JAZZ"],
  };
  const colours = ["BLACK", "SILVER", "BLUE", "WHITE", "RED", "GREY"];
  const fuels = ["PETROL", "DIESEL"];

  const make = makes[Math.floor(Math.random() * makes.length)];
  const model = models[make][Math.floor(Math.random() * models[make].length)];
  const year = 2008 + Math.floor(Math.random() * 10);
  const futureMonths = 3 + Math.floor(Math.random() * 12);
  const motExpiry = new Date();
  motExpiry.setMonth(motExpiry.getMonth() + futureMonths);

  return {
    registrationNumber: reg.toUpperCase().replace(/\s/g, "").replace(/(.{2})(.{2})(.{3})/, "$1$2 $3"),
    make,
    model,
    colour: colours[Math.floor(Math.random() * colours.length)],
    yearOfManufacture: year,
    fuelType: fuels[Math.floor(Math.random() * fuels.length)],
    motExpiryDate: motExpiry.toISOString().split("T")[0],
    motStatus: "Valid",
    mileage: 40000 + Math.floor(Math.random() * 120000),
    taxStatus: "Taxed",
    taxDueDate: "2026-12-01",
    engineCapacity: 1200 + Math.floor(Math.random() * 800),
    co2Emissions: 100 + Math.floor(Math.random() * 80),
  };
}

export async function lookupVehicle(reg: string): Promise<VehicleData | null> {
  const cleanReg = reg.toUpperCase().replace(/\s/g, "");

  // Check if DVLA API key is available
  const apiKey = process.env.DVLA_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch("https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ registrationNumber: cleanReg }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fall through to mock
    }
  }

  // Mock fallback
  if (MOCK_VEHICLES[cleanReg]) {
    return MOCK_VEHICLES[cleanReg];
  }

  // Generate plausible mock data for any reg
  if (cleanReg.length >= 4) {
    return generateMockVehicle(cleanReg);
  }

  return null;
}
