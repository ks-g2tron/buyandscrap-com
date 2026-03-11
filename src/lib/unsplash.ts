import fs from "fs";
import path from "path";

const CACHE_PATH = path.join(process.cwd(), ".unsplash-cache.json");

interface UnsplashImage {
  url: string;
  photographer: string;
  profileLink: string;
  attributionLink: string;
}

type Cache = Record<string, UnsplashImage>;

function readCache(): Cache {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      return JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
    }
  } catch {
    // ignore corrupt cache
  }
  return {};
}

function writeCache(cache: Cache) {
  try {
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
  } catch {
    // ignore write errors (e.g. read-only filesystem in CI)
  }
}

export async function getUnsplashImage(query: string): Promise<UnsplashImage> {
  const cacheKey = query.toLowerCase().trim();
  const cache = readCache();

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    // Fallback when no API key is available (build-time, CI, etc.)
    return {
      url: `https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=600&fit=crop&q=80`,
      photographer: "Unsplash",
      profileLink: "https://unsplash.com",
      attributionLink: "https://unsplash.com",
    };
  }

  try {
    const params = new URLSearchParams({
      query: cacheKey,
      orientation: "landscape",
      per_page: "1",
    });

    const res = await fetch(
      `https://api.unsplash.com/search/photos?${params}`,
      {
        headers: { Authorization: `Client-ID ${accessKey}` },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      throw new Error(`Unsplash API error: ${res.status}`);
    }

    const data = await res.json();
    const photo = data.results?.[0];

    if (!photo) {
      throw new Error("No results");
    }

    const image: UnsplashImage = {
      url: `${photo.urls.raw}&w=1200&h=600&fit=crop&q=80`,
      photographer: photo.user.name,
      profileLink: `${photo.user.links.html}?utm_source=buyandscrap&utm_medium=referral`,
      attributionLink: `${photo.links.html}?utm_source=buyandscrap&utm_medium=referral`,
    };

    cache[cacheKey] = image;
    writeCache(cache);

    return image;
  } catch {
    return {
      url: `https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=600&fit=crop&q=80`,
      photographer: "Unsplash",
      profileLink: "https://unsplash.com",
      attributionLink: "https://unsplash.com",
    };
  }
}
