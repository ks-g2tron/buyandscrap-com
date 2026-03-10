import { MetadataRoute } from "next";
import { getApprovedListings } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getApprovedListings();

  const staticPages = [
    { url: "https://buyandscrap.com", lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: "https://buyandscrap.com/cars", lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: "https://buyandscrap.com/sell", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: "https://buyandscrap.com/mot-checker", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: "https://buyandscrap.com/guides", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: "https://buyandscrap.com/about", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: "https://buyandscrap.com/how-it-works", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: "https://buyandscrap.com/privacy", lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: "https://buyandscrap.com/cookies", lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: "https://buyandscrap.com/terms", lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const listingPages = listings.map((listing) => ({
    url: `https://buyandscrap.com/cars/${listing.slug}`,
    lastModified: new Date(listing.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...listingPages];
}
