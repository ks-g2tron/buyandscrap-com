import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { getUnsplashImage } from "@/lib/unsplash";
import { marked } from "marked";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PillarContent {
  slug: string;
  title: string;
  metaDescription: string;
  targetKeyword: string;
  intent?: string;
  pillar?: string;
  internalLinks: string[];
  content: string;
  cta: string;
  ctaLink: string;
  wordCount?: number;
}

/* ------------------------------------------------------------------ */
/*  Content helpers                                                    */
/* ------------------------------------------------------------------ */

function getAllPillars(): PillarContent[] {
  const pillars: PillarContent[] = [];
  const pillarsDir = path.join(process.cwd(), "content", "pillars");

  if (!fs.existsSync(pillarsDir)) return pillars;

  const files = fs.readdirSync(pillarsDir).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    try {
      const raw = JSON.parse(
        fs.readFileSync(path.join(pillarsDir, file), "utf-8")
      );
      pillars.push({
        slug: raw.slug || "",
        title: raw.title || "",
        metaDescription: raw.metaDescription || "",
        targetKeyword: raw.targetKeyword || "",
        intent: raw.intent || "",
        pillar: raw.pillar || "",
        internalLinks: raw.internalLinks || [],
        content: raw.content || "",
        cta: raw.cta || "Browse Cheap Cars",
        ctaLink: raw.ctaLink || "/cars",
        wordCount: raw.wordCount || 0,
      });
    } catch {
      // skip bad files
    }
  }

  return pillars;
}

function getPillarBySlug(slug: string): PillarContent | undefined {
  return getAllPillars().find((p) => p.slug === slug);
}

/* ------------------------------------------------------------------ */
/*  Reading time                                                       */
/* ------------------------------------------------------------------ */

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 230));
}

/* ------------------------------------------------------------------ */
/*  Markdown → HTML                                                    */
/* ------------------------------------------------------------------ */

function markdownToHtml(md: string): string {
  const cleaned = md.replace(/\\n/g, "\n");
  return marked.parse(cleaned, { async: false }) as string;
}

/* ------------------------------------------------------------------ */
/*  Pillar category labels                                             */
/* ------------------------------------------------------------------ */

const PILLAR_LABELS: Record<string, string> = {
  buying: "Buying Guide",
  selling: "Selling Guide",
  budget: "Budget Tips",
  mot: "MOT Guide",
  scrapping: "Scrapping Guide",
};

/* ------------------------------------------------------------------ */
/*  Internal link labels                                               */
/* ------------------------------------------------------------------ */

const LINK_LABELS: Record<string, string> = {
  "/cars": "Browse Cars",
  "/sell": "Sell Your Car",
  "/mot-checker": "MOT Checker",
  "/guides": "All Guides",
};

/* ------------------------------------------------------------------ */
/*  Static params (SSG)                                                */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  return getAllPillars().map((p) => ({ slug: p.slug }));
}

/* ------------------------------------------------------------------ */
/*  SEO metadata                                                       */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pillar = getPillarBySlug(slug);
  if (!pillar) return { title: "Guide Not Found" };

  const image = await getUnsplashImage(pillar.targetKeyword || pillar.title);

  return {
    title: pillar.title,
    description: pillar.metaDescription,
    keywords: pillar.targetKeyword,
    openGraph: {
      title: pillar.title,
      description: pillar.metaDescription,
      type: "article",
      images: [{ url: image.url, width: 1200, height: 600, alt: pillar.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: pillar.title,
      description: pillar.metaDescription,
      images: [image.url],
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default async function PillarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pillar = getPillarBySlug(slug);
  if (!pillar) notFound();

  const image = await getUnsplashImage(pillar.targetKeyword || pillar.title);
  const readTime = estimateReadTime(pillar.content);
  const categoryLabel = PILLAR_LABELS[pillar.pillar || ""] || "Complete Guide";
  const bodyHtml = markdownToHtml(pillar.content);
  const otherPillars = getAllPillars().filter((p) => p.slug !== pillar.slug);

  return (
    <>
      {/* ── Hero ── */}
      <div className="relative w-full h-[420px] md:h-[480px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={pillar.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-4 right-4 text-xs text-white/70">
          Photo by{" "}
          <a
            href={image.profileLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            {image.photographer}
          </a>{" "}
          on{" "}
          <a
            href={image.attributionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            Unsplash
          </a>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 -mt-24 relative z-10">
        {/* ── Breadcrumbs ── */}
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/80">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li className="select-none">/</li>
            <li>
              <Link href="/guides" className="hover:text-white transition-colors">
                Guides
              </Link>
            </li>
            <li className="select-none">/</li>
            <li className="text-white font-medium truncate max-w-[200px] md:max-w-none">
              {pillar.title}
            </li>
          </ol>
        </nav>

        {/* ── Title card ── */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-block bg-[#22c55e]/10 text-[#16a34a] text-xs font-semibold px-3 py-1 rounded-full">
              {categoryLabel}
            </span>
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
              Pillar Guide
            </span>
            <span className="text-sm text-gray-400">{readTime} min read</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#374151] leading-tight mb-6">
            {pillar.title}
          </h1>

          {/* ── Article body ── */}
          <div
            className="prose prose-lg prose-gray max-w-none prose-headings:text-[#374151] prose-a:text-[#22c55e] hover:prose-a:text-[#16a34a]"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {/* ── Internal links ── */}
          {pillar.internalLinks.length > 0 && (
            <div className="mt-10 p-6 bg-gray-50 rounded-xl">
              <h2 className="text-lg font-bold text-[#374151] mb-3">
                Explore More
              </h2>
              <div className="flex flex-wrap gap-3">
                {pillar.internalLinks.map((link) => (
                  <Link
                    key={link}
                    href={link}
                    className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-[#374151] font-medium text-sm px-4 py-2 rounded-lg hover:border-[#22c55e] hover:text-[#22c55e] transition-colors"
                  >
                    {LINK_LABELS[link] || link}
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── CTA ── */}
          <div className="mt-12 text-center">
            <Link
              href={pillar.ctaLink}
              className="inline-block bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-lg py-3.5 px-10 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              {pillar.cta}
            </Link>
          </div>
        </div>

        {/* ── Other pillar guides ── */}
        {otherPillars.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#374151] mb-6">
              More Complete Guides
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {otherPillars.map((p) => (
                <Link
                  key={p.slug}
                  href={`/pillars/${p.slug}`}
                  className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-[#22c55e]/40 transition-all group"
                >
                  <span className="text-xs font-medium text-purple-600">
                    Pillar Guide
                  </span>
                  <h3 className="text-base font-bold text-[#374151] mt-1 group-hover:text-[#22c55e] transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {p.metaDescription}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
