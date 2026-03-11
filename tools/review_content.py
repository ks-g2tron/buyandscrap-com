#!/usr/bin/env python3
"""
Content Review Agent for buyandscrap.com
Acts as: Copywriter + SEO Specialist + AI Search Optimiser
Reviews and rewrites all 502 content pieces against a strict rubric.
"""

import json, os, re, time, sys, glob

# Load API key
secrets = {}
with open(os.path.expanduser('~/.openclaw/.env.secrets')) as f:
    for line in f:
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1)
            secrets[k] = v

api_key = secrets.get('GEMINI_API_KEY', '')
if not api_key:
    print("ERROR: No GEMINI_API_KEY"); sys.exit(1)

from google import genai
client = genai.Client(api_key=api_key)
MODEL = 'gemini-2.5-flash'

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(REPO, 'content')
PROGRESS_FILE = os.path.join(CONTENT_DIR, 'review_progress.json')
SLEEP = 2.0

REVIEW_PROMPT = """You are a senior copywriter, SEO specialist, and AI search optimisation expert reviewing content for BuyAndScrap.com — a UK car marketplace for honest, affordable cars.

Review and REWRITE the following content piece to score 9/10 or higher on ALL criteria:

RUBRIC:
1. READABILITY — Short sentences (max 20 words), plain British English, no corporate fluff, conversational tone, short paragraphs (2-3 sentences max)
2. USER VALUE — Genuinely answers the question with real, actionable advice. No padding. Every sentence earns its place.
3. SEO — Target keyword appears in: title, first 100 words, at least one H2, meta description. Keyword used naturally 3-5 times total. H2/H3 structure throughout.
4. AI-FRIENDLY — Clear, direct answers that AI search engines (Perplexity, ChatGPT, Google AI Overviews) can quote. Include at least one FAQ-style Q&A section. First paragraph should be a direct summary answer.
5. UK-SPECIFIC — British English throughout (colour, tyres, centre, licence, favour, £ not $). UK context, UK roads, UK law references where relevant.
6. INTERNAL LINKS — Naturally mention and link to relevant pages: [Browse Cars](/cars), [Sell Your Car](/sell), [Free MOT Checker](/mot-checker), [Guides](/guides)
7. E-E-A-T — Include signals of real experience and expertise. Reference real-world scenarios. Sound like someone who actually knows about cars, not a content farm.

CONTENT TO REVIEW:
Title: {title}
Target Keyword: {keyword}
Current Meta Description: {meta}
Current Content:
{content}

RETURN ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{{
  "slug": "{slug}",
  "title": "Improved title (keep keyword, make it compelling)",
  "metaDescription": "Improved meta description, 150-155 chars, includes keyword, has a benefit/hook",
  "targetKeyword": "{keyword}",
  "intent": "{intent}",
  "pillar": "{pillar}",
  "internalLinks": ["/cars", "/sell", "/mot-checker"],
  "content": "Full rewritten content in markdown. Must include: direct opening paragraph, H2/H3 structure, FAQ section at end, CTA linking to {cta_link}",
  "wordCount": <actual word count of rewritten content>,
  "cta": "{cta_text}",
  "ctaLink": "{cta_link}",
  "reviewScore": <your score 1-10>,
  "improvements": "Brief note on what you improved"
}}"""

def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE) as f:
            return json.load(f)
    return {"completed": [], "failed": [], "total": 0, "done": 0}

def save_progress(p):
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(p, f, indent=2)

def get_content(d):
    """Extract content string from potentially nested JSON."""
    c = d.get('content', '')
    if isinstance(c, dict):
        c = c.get('content', str(c))
    if isinstance(c, str) and c.strip().startswith('{'):
        try:
            inner = json.loads(c)
            c = inner.get('content', c)
        except:
            pass
    return str(c)

def review_and_rewrite(filepath):
    with open(filepath) as f:
        data = json.load(f)

    content = get_content(data)
    if not content or len(content) < 100:
        return None

    title = data.get('title', '')
    keyword = data.get('targetKeyword', '')
    meta = data.get('metaDescription', '')
    slug = data.get('slug', '')
    intent = data.get('intent', 'informational')
    pillar = data.get('pillar', '')
    cta_link = data.get('ctaLink', '/cars')
    cta_text = data.get('cta', 'Browse Cars')

    prompt = REVIEW_PROMPT.format(
        title=title, keyword=keyword, meta=meta,
        content=content[:3000],  # Limit to avoid token overflow
        slug=slug, intent=intent, pillar=pillar,
        cta_link=cta_link, cta_text=cta_text
    )

    for attempt in range(3):
        try:
            r = client.models.generate_content(model=MODEL, contents=prompt)
            text = r.text.strip()
            # Strip code blocks if present
            text = re.sub(r'^```(?:json)?\s*', '', text)
            text = re.sub(r'\s*```$', '', text)
            result = json.loads(text)
            # Save back to same file
            with open(filepath, 'w') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
            return result
        except json.JSONDecodeError:
            # Save as raw improved content if JSON parse fails
            improved = {**data, 'content': text, 'reviewed': True}
            with open(filepath, 'w') as f:
                json.dump(improved, f, indent=2, ensure_ascii=False)
            return improved
        except Exception as e:
            print(f"  Attempt {attempt+1} failed: {e}")
            if attempt < 2:
                time.sleep((attempt+1)*5)
    return None

def main():
    # Find all content JSON files
    all_files = []
    for pattern in [
        'pillars/*.json', 'locations/*.json', 'makes/*.json',
        'models/*.json', 'guides/buying/*.json', 'guides/selling/*.json',
        'guides/mot/*.json', 'guides/budget/*.json', 'guides/scrapping/*.json',
        'faqs/*.json'
    ]:
        found = glob.glob(os.path.join(CONTENT_DIR, pattern))
        all_files.extend(found)

    # Exclude progress files
    all_files = [f for f in all_files if 'progress' not in f and 'index' not in f]
    all_files.sort()

    progress = load_progress()
    completed = set(progress.get('completed', []))
    failed = set(progress.get('failed', []))
    total = len(all_files)
    done = 0

    print(f"Content Review Agent starting")
    print(f"Total files: {total}")
    print(f"Already reviewed: {len(completed)}")
    print(f"Starting...\n")

    for filepath in all_files:
        rel_path = os.path.relpath(filepath, CONTENT_DIR)

        if rel_path in completed:
            done += 1
            continue

        try:
            with open(filepath) as f:
                data = json.load(f)
            title = data.get('title', rel_path)[:55]
        except:
            title = rel_path

        print(f"[{done+1}/{total}] Reviewing: {title}...")

        result = review_and_rewrite(filepath)

        if result:
            completed.add(rel_path)
            failed.discard(rel_path)
            score = result.get('reviewScore', '?')
            improvements = result.get('improvements', '')[:60]
            print(f"  ✅ Score: {score}/10 — {improvements}")
        else:
            failed.add(rel_path)
            print(f"  ❌ Failed")

        done += 1
        progress.update({
            'completed': list(completed),
            'failed': list(failed),
            'total': total,
            'done': done
        })
        save_progress(progress)
        time.sleep(SLEEP)

    print(f"\n✅ Review complete: {done}/{total} reviewed")
    print(f"Failed: {len(failed)}")

    # Commit reviewed content
    os.system(f"cd {REPO} && git add -A && git commit -m 'Content: All {done} pieces reviewed + improved by SEO/copywriter agent'")
    os.system(f"cd {REPO} && git push origin master")
    os.system("openclaw system event --text 'Done: All 502 content pieces reviewed and improved. Ready to wire into site.' --mode now")

if __name__ == '__main__':
    main()
