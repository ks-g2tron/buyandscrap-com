export interface Listing {
  id: string;
  reg: string;
  make: string;
  model: string;
  year: number;
  colour: string;
  fuel: string;
  mileage: number;
  mot_expiry: string;
  price: number;
  condition: "solid-runner" | "minor-issues" | "rough-but-drives";
  known_faults: string;
  description: string;
  photos: string[];
  seller_id: string;
  seller_name: string;
  seller_email: string;
  seller_phone: string;
  location: string;
  postcode: string;
  status: "pending" | "approved" | "rejected" | "sold";
  featured: boolean;
  created_at: string;
  slug: string;
}

export interface Contact {
  id: string;
  listing_id: string;
  buyer_email: string;
  buyer_name: string;
  buyer_phone: string;
  message: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  published: boolean;
  created_at: string;
}

export interface VehicleData {
  registrationNumber: string;
  make: string;
  model: string;
  colour: string;
  yearOfManufacture: number;
  fuelType: string;
  motExpiryDate: string;
  motStatus: string;
  mileage?: number;
  taxStatus: string;
  taxDueDate: string;
  engineCapacity: number;
  co2Emissions: number;
}
