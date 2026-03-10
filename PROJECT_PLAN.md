# BuyAndScrap.com — Project Plan

## Vision

A honest, community-driven marketplace for end-of-life cars that still have life left in them.
Built for people who need cheap, reliable transport for 1-2 years — not forever.
No commission. No middlemen. Just honest sellers, honest cars, and people who need to get moving.

**Born from real need:** The founder needed a car with 1 year MOT, couldn't afford a "proper" car,
and found no trustworthy place to find one. This site fixes that.

---

## The User

### Buyer
- Struggling financially, needs transport urgently
- Wants a car with ~1 year MOT that will get them through the next year
- Scared of getting ripped off — needs to trust the seller
- Not buying to keep — buying to drive then scrap

### Seller
- Has a car that's near end-of-life but still driveable
- Doesn't want to go through the hassle of AutoTrader/eBay
- Wants a fair price, quick sale, honest transaction
- May be upgrading and just needs rid of the old car

---

## Goals

1. **Helpful** — genuinely serve people in tough situations
2. **Learning** — build real product skills (databases, APIs, automation, SEO)
3. **Sustainable income** — AdSense + affiliates targeting £500-£2k/month within 12 months

---

## Agent Team

| Agent | Role |
|---|---|
| 🧠 PM Agent | Product Manager — owns roadmap, specs, coordination |
| 🎨 UX Agent | UI/UX Designer — wireframes, user flows, design system |
| 💻 Dev Agent | Developer — builds all features |
| 🧪 QA Agent | Tester — tests, finds bugs, validates acceptance criteria |
| ⚖️ Legal Agent | Legal/Compliance — T&Cs, GDPR UK, marketplace liability |
| 🔒 Security Agent | Security — audits, spam prevention, vulnerability checks |
| 🚀 DevOps Agent | Infrastructure — deployments, monitoring, performance |
| ✍️ Marketing Agent | Content/SEO — blog posts, page copy, keyword strategy |
| 📣 Growth Agent | Online Marketing — ads, social, email campaigns |
| 💼 BizDev Agent | Business Dev — monetisation, affiliates, partnerships |
| 📊 Analytics Agent | Data — tracking setup, reporting, conversion insights |

**Orchestrator:** JC (main AI assistant) — coordinates all agents, reports to KS

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) | Fast, SEO-friendly, already set up |
| Styling | Tailwind CSS | Rapid, consistent UI |
| Database | Supabase (PostgreSQL) | Free tier, real-time, auth built in |
| Image storage | Cloudinary | Free tier, auto-compression |
| Auth | Supabase Auth | Built in, no extra setup |
| Email | Resend | Free tier, reliable |
| Vehicle API | DVLA MOT History API | Free, official UK gov data |
| AI content | Gemini API | Weekly blog generation (key already configured) |
| Cron jobs | Vercel Cron | Automated tasks |
| Analytics | Google Analytics 4 | Already integrated |
| Deployment | Vercel | Already set up |
| Repo | GitHub (ks-g2tron) | Already set up |

---

## Site Structure

```
buyandscrap.com/
│
├── / — Homepage
│   ├── Hero: search by postcode + MOT length filter
│   ├── Featured listings (newest/best value)
│   ├── How it works (3 steps for buyers + sellers)
│   ├── The story (founder's personal story — trust anchor)
│   ├── Trust signals
│   └── AdSense slots
│
├── /cars — Browse listings
│   ├── Filter: price, MOT remaining, make, model, distance, fuel type
│   ├── Sort: newest, cheapest, most MOT left
│   ├── Map view (future)
│   └── AdSense slots between results
│
├── /cars/[slug] — Individual listing
│   ├── Photo gallery
│   ├── Key stats: price, MOT expiry, mileage, fuel, transmission
│   ├── Live DVLA MOT check (pulls real data)
│   ├── Known faults (mandatory honest disclosure)
│   ├── Condition rating: Solid Runner / Minor Issues / Rough But Drives
│   ├── Seller contact form (no phone shown publicly — prevents spam)
│   ├── Similar listings nearby
│   ├── HPI check affiliate link
│   └── AdSense slots
│
├── /sell — List your car
│   ├── Step 1: Enter reg → DVLA auto-fills make/model/year/MOT date/colour
│   ├── Step 2: Upload photos (up to 10), set price, describe known issues
│   ├── Step 3: Account creation / login, contact details, location
│   └── Free to list (always)
│
├── /mot-checker — Free tool
│   ├── Enter any reg → pulls full MOT history from DVLA
│   ├── Shows pass/fail history, advisories, mileage at each test
│   └── CTA: "Buying this car? See if it's listed on BuyAndScrap"
│
├── /location/[city] — Auto-generated location pages
│   ├── "Cheap cars for sale in Manchester with MOT"
│   ├── Local listings grid
│   ├── Local tips (AI-generated)
│   └── SEO-optimised meta
│
├── /make/[make] — Auto-generated make pages
│   ├── "Buy cheap Ford cars UK"
│   ├── Common issues, what to check (AI-generated)
│   └── Current listings for that make
│
├── /make/[make]/[model] — Auto-generated model pages
│   ├── "Buy cheap Ford Focus UK"
│   ├── Model-specific advice
│   └── Current listings
│
├── /guides — Blog (auto-updated weekly)
│   ├── "How to buy a cheap car safely in the UK"
│   ├── "What to check before buying a banger"
│   ├── "UK scrapping rules explained"
│   ├── "How long should a £500 car last?"
│   └── New posts generated weekly via Gemini AI
│
├── /about — The founder's story
├── /how-it-works — Detailed buyer + seller guide
├── /privacy — Privacy policy (UK GDPR compliant)
├── /cookies — Cookie policy
├── /terms — Terms of use + marketplace liability
│
└── /admin — Admin dashboard (private)
    ├── All listings (approve/reject/flag)
    ├── All leads/contacts
    ├── User management
    ├── Analytics overview
    └── Blog post manager
```

---

## Revenue Model

| Stream | Mechanism | Target |
|---|---|---|
| Google AdSense | Display ads throughout site | Grows with traffic |
| Featured listings | Sellers pay £2-5 to pin listing to top | Low friction upsell |
| HPI/Car check affiliate | carvertical or similar, per listing CTA | £5-15 per check |
| Car insurance affiliate | Compare the Market or MoneySupermarket API | £20-50 per sale |
| Warranty affiliate | WarrantyWise or similar | £15-40 per sale |
| MOT garage directory | Local garages pay £10-30/month to be listed as recommended | Recurring |

---

## Sprint Plan

### Sprint 0 — Foundation (Week 1)
**Goal:** Core infrastructure, database, auth, basic UI

Tasks:
- [ ] Set up Supabase project + schema (listings, users, contacts, leads)
- [ ] Design system: colours, typography, components (green/grey, honest/trustworthy feel)
- [ ] Homepage with hero search + how it works + founder story placeholder
- [ ] Authentication (sign up / log in via Supabase Auth)
- [ ] Basic navigation + footer
- [ ] GDPR cookie consent banner (already started)
- [ ] Deploy and confirm live on Vercel

Acceptance criteria:
- Site loads in <3s
- Auth works (sign up, log in, log out)
- Database connected
- Deployed to buyandscrap.com

---

### Sprint 1 — Core Marketplace (Week 2)
**Goal:** Buyers can browse, sellers can list

Tasks:
- [ ] /sell page with DVLA reg lookup (auto-fills vehicle data)
- [ ] Photo upload (Cloudinary integration, up to 10 photos)
- [ ] Listing creation flow (3 steps)
- [ ] /cars browse page with filters + sorting
- [ ] /cars/[slug] individual listing page
- [ ] Live DVLA MOT history on each listing
- [ ] Seller contact form (email via Resend)
- [ ] Listing management (seller can edit/delete their own listings)
- [ ] Admin approval queue for new listings

Acceptance criteria:
- Seller can list a car end-to-end in <5 minutes
- Buyer can browse, filter, and contact a seller
- MOT data pulls correctly from DVLA
- Photos upload and display correctly

---

### Sprint 2 — Trust & SEO Foundation (Week 3)
**Goal:** Build trust signals + SEO infrastructure

Tasks:
- [ ] /mot-checker free tool page
- [ ] Location pages auto-generated from listing data
- [ ] Make/model pages auto-generated
- [ ] Structured data (Car schema, LocalBusiness schema, FAQPage)
- [ ] Dynamic sitemap (auto-regenerates daily via Vercel Cron)
- [ ] robots.txt
- [ ] Honest condition rating system on listings
- [ ] "Known faults" mandatory field + display
- [ ] HPI check affiliate links on listing pages
- [ ] About page with founder story

Acceptance criteria:
- Google Search Console shows no crawl errors
- Schema markup validates in Google Rich Results Test
- Location pages generate automatically when listings are added

---

### Sprint 3 — Automation & Growth (Week 4)
**Goal:** Site starts running itself

Tasks:
- [ ] Weekly AI blog post generation (Gemini API via Vercel Cron)
- [ ] Email alerts: buyer gets notified when matching car listed
- [ ] Email alerts: seller reminded when listing expires (with renewal CTA)
- [ ] Auto-remove listings when MOT expires
- [ ] Auto-generate social post when new listing added
- [ ] Featured listings (paid upgrade via Stripe)
- [ ] AdSense integration (replace placeholder slots with live ads)
- [ ] Admin analytics dashboard (traffic, listings, conversions)

Acceptance criteria:
- Blog generates and publishes automatically without manual input
- Email alerts send correctly
- Expired listings removed automatically
- AdSense live and serving ads

---

### Sprint 4 — Monetisation & Polish (Week 5-6)
**Goal:** Revenue streams active, site polished

Tasks:
- [ ] Insurance affiliate integration (Compare the Market or similar)
- [ ] Warranty affiliate integration
- [ ] MOT garage directory (basic version)
- [ ] Mobile UX audit + fixes
- [ ] Performance audit (Core Web Vitals)
- [ ] Security audit (spam prevention, input validation, rate limiting)
- [ ] Legal pages finalised (T&Cs, privacy, cookies)
- [ ] Google Search Console + Analytics reporting setup
- [ ] First 10 listings seeded (manually or via outreach)

Acceptance criteria:
- All affiliate links tracked and converting
- Lighthouse score >90 on mobile
- No critical security vulnerabilities
- Legal pages reviewed and compliant with UK GDPR

---

### Sprint 5+ — Scale (Month 2+)
**Goal:** Traffic, rankings, revenue growth

Tasks:
- [ ] Link building campaign (local directories, car forums)
- [ ] Google Ads trial (small budget, test conversion)
- [ ] Social media presence (Facebook group, Twitter/X)
- [ ] User reviews between buyers and sellers
- [ ] Map view for listings
- [ ] Price comparison tool (what's your car worth?)
- [ ] Partnership outreach (scrap yards, MOT garages, local dealers)

---

## SEO Strategy

### Keywords to target (by phase)

**Phase 1 — Local (quick wins):**
- "cheap cars Manchester MOT"
- "buy scrap car Manchester"
- "cheap car for sale Salford"
- "[city] cheap cars with MOT"

**Phase 2 — Informational (blog traffic):**
- "how to buy a cheap car safely UK"
- "what to check before buying a cheap car"
- "how much is my car worth to scrap"
- "scrap car prices UK 2025"

**Phase 3 — Commercial (national):**
- "buy and scrap car UK"
- "cheap cars 1 year MOT"
- "scrap car for sale UK"

### On-page SEO checklist (every page)
- [ ] Unique title tag (60 chars max)
- [ ] Meta description (155 chars max, includes CTA)
- [ ] H1 with primary keyword
- [ ] Structured data (relevant schema type)
- [ ] Internal links to related pages
- [ ] Image alt text on all images
- [ ] Mobile responsive
- [ ] Page speed <3s

---

## Success Metrics

| Metric | Month 1 | Month 3 | Month 6 | Month 12 |
|---|---|---|---|---|
| Listings live | 10 | 50 | 200 | 500+ |
| Monthly visitors | 100 | 1,000 | 5,000 | 20,000+ |
| Monthly revenue | £0 | £50 | £300 | £1,500+ |
| Google rankings | - | Local top 10 | Local top 3 | National top 10 |
| Email subscribers | 0 | 50 | 300 | 1,000+ |

---

## Rules for All Agents

1. **User first** — every decision is made thinking about the person who's cold, broke, and needs a car
2. **Honest by default** — don't over-promise features, don't hide faults, build trust into everything
3. **Ship small, ship often** — working software beats perfect plans
4. **Mobile first** — assume most users are on a phone
5. **SEO in everything** — every page, every URL, every piece of content
6. **UK law compliant** — GDPR UK, consumer rights, marketplace liability
7. **Free to run** — use free tiers where possible, keep overheads at £0 until revenue justifies cost
8. **Document everything** — leave comments in code, update this plan as you go

---

## Current State

- Domain: buyandscrap.com (Namecheap)
- Hosting: Vercel (live at buyandscrap.vercel.app)
- Repo: github.com/ks-g2tron/buyandscrap-com
- Stack: Next.js 14, Tailwind CSS
- Current site: basic lead gen page (to be replaced by this full product)
- Tokens available: GITHUB_TOKEN, VERCEL_TOKEN, GEMINI_API_KEY, AGENTMAIL_TOKEN

---

*Last updated: 2026-03-10*
*Owner: KS*
*Orchestrator: JC*
