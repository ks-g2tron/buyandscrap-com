import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { getUnsplashImage } from "@/lib/unsplash";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface GuideContent {
  slug: string;
  title: string;
  metaDescription: string;
  targetKeyword: string;
  intent?: string;
  pillar?: string;
  content: string;
  cta: string;
  ctaLink: string;
  wordCount?: number;
}

/* ------------------------------------------------------------------ */
/*  Content helpers                                                    */
/* ------------------------------------------------------------------ */

function getAllGuides(): GuideContent[] {
  const guides: GuideContent[] = [];
  const root = process.cwd();

  // Read from content/guides/**/*.json
  const guidesDir = path.join(root, "content", "guides");
  if (fs.existsSync(guidesDir)) {
    const categories = fs.readdirSync(guidesDir).filter((d) =>
      fs.statSync(path.join(guidesDir, d)).isDirectory()
    );
    for (const cat of categories) {
      const catDir = path.join(guidesDir, cat);
      const files = fs.readdirSync(catDir).filter((f) => f.endsWith(".json"));
      for (const file of files) {
        try {
          const raw = JSON.parse(fs.readFileSync(path.join(catDir, file), "utf-8"));
          guides.push(normalizeGuide(raw, cat));
        } catch {
          // skip bad files
        }
      }
    }
  }

  // Read from content/pillars/*.json
  const pillarsDir = path.join(root, "content", "pillars");
  if (fs.existsSync(pillarsDir)) {
    const files = fs.readdirSync(pillarsDir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      try {
        const raw = JSON.parse(fs.readFileSync(path.join(pillarsDir, file), "utf-8"));
        guides.push(normalizeGuide(raw, "pillar"));
      } catch {
        // skip bad files
      }
    }
  }

  return guides;
}

/** Pillar files sometimes have a nested JSON string in `content` */
function normalizeGuide(raw: Record<string, unknown>, category: string): GuideContent {
  let data = raw;

  // Some pillar files have the real content nested as a JSON string in .content
  if (typeof raw.content === "string" && raw.content.startsWith("{")) {
    try {
      const inner = JSON.parse(raw.content as string);
      if (inner.content && inner.title) {
        data = inner;
      }
    } catch {
      // use outer data as-is
    }
  }

  return {
    slug: (data.slug as string) || "",
    title: (data.title as string) || "",
    metaDescription: (data.metaDescription as string) || "",
    targetKeyword: (data.targetKeyword as string) || "",
    intent: (data.intent as string) || "",
    pillar: category,
    content: (data.content as string) || "",
    cta: (data.cta as string) || "Browse Cheap Cars",
    ctaLink: (data.ctaLink as string) || "/cars",
    wordCount: (data.wordCount as number) || 0,
  };
}

function getGuideBySlug(slug: string): GuideContent | undefined {
  return getAllGuides().find((g) => g.slug === slug);
}

function getRelatedGuides(current: GuideContent, count = 4): GuideContent[] {
  const all = getAllGuides().filter((g) => g.slug !== current.slug);
  // Prefer same pillar/category
  const samePillar = all.filter((g) => g.pillar === current.pillar);
  const others = all.filter((g) => g.pillar !== current.pillar);
  return [...samePillar, ...others].slice(0, count);
}

/* ------------------------------------------------------------------ */
/*  Reading time                                                       */
/* ------------------------------------------------------------------ */

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 230));
}

/* ------------------------------------------------------------------ */
/*  Markdown → HTML (lightweight)                                      */
/* ------------------------------------------------------------------ */

function markdownToHtml(md: string): string {
  let html = md
    // Headings
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-[#374151] mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-[#374151] mt-10 mb-4">$2</h2>')
    .replace(/^# (.+)$/gm, '<h2 class="text-3xl font-extrabold text-[#374151] mt-10 mb-4">$1</h2>')
    // Bold & italic
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#22c55e] hover:text-[#16a34a] underline">$1</a>')
    // Unordered lists
    .replace(/^\*   (.+)$/gm, '<li class="ml-6 list-disc text-gray-700 mb-1">$1</li>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-8 border-gray-200" />');

  // Wrap consecutive <li> in <ul>
  html = html.replace(
    /(<li[^>]*>.*?<\/li>\n?)+/g,
    (match) => `<ul class="my-4 space-y-1">${match}</ul>`
  );

  // Paragraphs: wrap lines that aren't already HTML tags
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<")) return trimmed;
      return `<p class="text-gray-700 leading-relaxed mb-4">${trimmed}</p>`;
    })
    .join("\n");

  return html;
}

/* ------------------------------------------------------------------ */
/*  Category labels                                                    */
/* ------------------------------------------------------------------ */

const CATEGORY_LABELS: Record<string, string> = {
  buying: "Buying Guide",
  selling: "Selling Guide",
  budget: "Budget Tips",
  mot: "MOT Guide",
  scrapping: "Scrapping Guide",
  pillar: "Complete Guide",
};

/* ------------------------------------------------------------------ */
/*  Static params (SSG)                                                */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.slug }));
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
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide Not Found" };

  const image = await getUnsplashImage(guide.targetKeyword || guide.title);

  return {
    title: guide.title,
    description: guide.metaDescription,
    keywords: guide.targetKeyword,
    openGraph: {
      title: guide.title,
      description: guide.metaDescription,
      type: "article",
      images: [{ url: image.url, width: 1200, height: 600, alt: guide.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.metaDescription,
      images: [image.url],
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const image = await getUnsplashImage(guide.targetKeyword || guide.title);
  const readTime = estimateReadTime(guide.content);
  const categoryLabel = CATEGORY_LABELS[guide.pillar || ""] || "Guide";
  const related = getRelatedGuides(guide);
  const bodyHtml = markdownToHtml(guide.content);

  return (
    <>
      {/* ── Hero ── */}
      <div className="relative w-full h-[420px] md:h-[480px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={guide.title}
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
              {guide.title}
            </li>
          </ol>
        </nav>

        {/* ── Title card ── */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-block bg-[#22c55e]/10 text-[#16a34a] text-xs font-semibold px-3 py-1 rounded-full">
              {categoryLabel}
            </span>
            <span className="text-sm text-gray-400">{readTime} min read</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#374151] leading-tight mb-6">
            {guide.title}
          </h1>

          {/* ── Article body ── */}
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {/* ── CTA ── */}
          <div className="mt-12 text-center">
            <Link
              href={guide.ctaLink}
              className="inline-block bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-lg py-3.5 px-10 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              {guide.cta}
            </Link>
          </div>
        </div>

        {/* ── Related guides ── */}
        {related.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#374151] mb-6">
              Related Guides
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/guides/${r.slug}`}
                  className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-[#22c55e]/40 transition-all group"
                >
                  <span className="text-xs font-medium text-[#22c55e]">
                    {CATEGORY_LABELS[r.pillar || ""] || "Guide"}
                  </span>
                  <h3 className="text-base font-bold text-[#374151] mt-1 group-hover:text-[#22c55e] transition-colors line-clamp-2">
                    {r.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {r.metaDescription}
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
