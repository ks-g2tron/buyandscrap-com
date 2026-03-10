#!/usr/bin/env python3
"""Generate 500 SEO content pieces for buyandscrap.com using Gemini API."""

import json, os, re, time, sys

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
    print("ERROR: No GEMINI_API_KEY found")
    sys.exit(1)

from google import genai
client = genai.Client(api_key=api_key)
MODEL = 'gemini-2.5-flash'

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(REPO, 'content')
PROGRESS_FILE = os.path.join(CONTENT_DIR, 'progress.json')
SLEEP = 1.5

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE) as f:
            return json.load(f)
    return {"completed": [], "total": 500, "failed": []}

def save_progress(p):
    os.makedirs(CONTENT_DIR, exist_ok=True)
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(p, f, indent=2)

def generate(prompt):
    for attempt in range(3):
        try:
            r = client.models.generate_content(model=MODEL, contents=prompt)
            return r.text
        except Exception as e:
            print(f"  Attempt {attempt+1} failed: {e}")
            if attempt < 2:
                time.sleep((attempt+1)*5)
    return None

def save_content(path, data):
    full_path = os.path.join(CONTENT_DIR, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def make_article(title, slug, keyword, intent, pillar, word_target, extra_prompt="", cta="/cars", cta_text="Browse Cars"):
    prompt = f"""Write a high-quality SEO article for a UK car marketplace website called BuyAndScrap.com.

Title: {title}
Target keyword: "{keyword}" (use naturally 3-5 times)
Word count: approximately {word_target} words
Audience: UK car buyers/sellers, plain English, British spelling
Tone: Friendly, honest, helpful — NOT corporate

Structure with H2/H3 subheadings throughout.
{extra_prompt}

End with a call to action linking to {cta}: "{cta_text}"

IMPORTANT: Return ONLY a JSON object with this exact structure (no markdown, no code blocks):
{{
  "slug": "{slug}",
  "title": "{title}",
  "metaDescription": "A 150-155 character meta description including the keyword",
  "targetKeyword": "{keyword}",
  "intent": "{intent}",
  "pillar": "{pillar}",
  "internalLinks": ["relevant-slug-1", "relevant-slug-2"],
  "content": "Full article content in markdown format",
  "wordCount": {word_target},
  "cta": "{cta_text}",
  "ctaLink": "{cta}"
}}"""
    text = generate(prompt)
    if not text:
        return None
    # Try to parse JSON
    try:
        # Strip markdown code blocks if present
        text = re.sub(r'^```(?:json)?\s*', '', text.strip())
        text = re.sub(r'\s*```$', '', text.strip())
        return json.loads(text)
    except:
        # Return raw content if JSON parse fails
        return {
            "slug": slug,
            "title": title,
            "metaDescription": f"{title} - BuyAndScrap.com",
            "targetKeyword": keyword,
            "intent": intent,
            "pillar": pillar,
            "internalLinks": [],
            "content": text,
            "wordCount": word_target,
            "cta": cta_text,
            "ctaLink": cta
        }

# ============================================================
# CONTENT DEFINITIONS
# ============================================================

PILLARS = [
    ("How to Buy a Cheap Car in the UK: The Complete Guide", "buy-cheap-car-uk", "buy cheap car UK", "commercial", "buying", 2500, "/cars", "Browse Cheap Cars"),
    ("How to Sell Your Car Privately in the UK: Step by Step", "sell-car-privately-uk", "sell car privately UK", "commercial", "selling", 2000, "/sell", "List Your Car Free"),
    ("The Complete UK MOT Guide: Everything Car Owners Need to Know", "mot-guide-uk", "UK MOT guide", "informational", "mot", 2500, "/mot-checker", "Check Your MOT Free"),
    ("Cheap Cars Under £1000 in the UK: Buyer's Complete Guide", "cheap-cars-under-1000", "cheap cars under 1000 UK", "commercial", "budget", 2000, "/cars", "Browse Cars Under £1000"),
    ("Car Scrapping in the UK: The Complete A-Z Guide", "car-scrapping-uk", "car scrapping UK", "informational", "scrapping", 2000, "/sell", "Sell Your Car"),
]

CITIES = [
    "Manchester","Birmingham","Leeds","Sheffield","Liverpool","Bristol","Leicester",
    "Edinburgh","Glasgow","Coventry","Bradford","Nottingham","Hull","Plymouth",
    "Stoke-on-Trent","Wolverhampton","Derby","Southampton","Brighton","Portsmouth",
    "Cardiff","Sunderland","Oxford","Milton Keynes","Newcastle","Aberdeen","Dundee",
    "Swansea","Middlesbrough","Bolton","Swindon","Ipswich","Norwich","Luton",
    "Southend-on-Sea","Warrington","Slough","Bournemouth","Peterborough","Huddersfield",
    "Blackpool","Birkenhead","Telford","Gloucester","Oldham","Northampton","Reading",
    "Wigan","Barnsley","Rotherham"
]

MAKES = [
    "Ford","Vauxhall","Volkswagen","BMW","Mercedes-Benz","Audi","Toyota","Honda",
    "Nissan","Hyundai","Kia","Renault","Peugeot","Citroen","Fiat","Skoda","SEAT",
    "Mazda","Volvo","Land Rover","Mini","Subaru","Mitsubishi","Lexus","Jaguar",
    "Alfa Romeo","Suzuki","Dacia","MG","Chevrolet","Daewoo","Proton","Ssangyong",
    "Isuzu","Saab","Rover","Lancia","Pontiac","Chrysler","Dodge","Jeep","Cupra",
    "BYD","Chery","Genesis","Infiniti","Acura","Triumph","Austin","Seat"
]

MODELS = [
    ("Ford","Fiesta"),("Ford","Focus"),("Ford","Ka"),("Ford","Mondeo"),("Ford","Puma"),
    ("Ford","Galaxy"),("Ford","Kuga"),("Ford","EcoSport"),("Ford","Fusion"),("Ford","Ranger"),
    ("Vauxhall","Corsa"),("Vauxhall","Astra"),("Vauxhall","Insignia"),("Vauxhall","Zafira"),
    ("Vauxhall","Mokka"),("Vauxhall","Meriva"),("Vauxhall","Vectra"),("Vauxhall","Tigra"),
    ("Vauxhall","Adam"),("Vauxhall","Viva"),
    ("VW","Golf"),("VW","Polo"),("VW","Passat"),("VW","Tiguan"),("VW","Up"),
    ("VW","Touran"),("VW","Sharan"),("VW","Caddy"),("VW","T-Roc"),("VW","T-Cross"),
    ("BMW","1 Series"),("BMW","3 Series"),("BMW","5 Series"),("BMW","X1"),("BMW","X3"),
    ("Mercedes","A-Class"),("Mercedes","C-Class"),("Mercedes","E-Class"),("Mercedes","GLA"),("Mercedes","Vito"),
    ("Toyota","Yaris"),("Toyota","Corolla"),("Toyota","Auris"),("Toyota","Avensis"),("Toyota","Prius"),
    ("Toyota","RAV4"),("Toyota","Aygo"),("Toyota","C-HR"),("Toyota","Hilux"),("Toyota","Land Cruiser"),
    ("Honda","Civic"),("Honda","Jazz"),("Honda","CR-V"),("Honda","HR-V"),("Honda","Accord"),("Honda","FR-V"),
    ("Nissan","Micra"),("Nissan","Note"),("Nissan","Juke"),("Nissan","Qashqai"),("Nissan","Almera"),
    ("Nissan","Primera"),("Nissan","X-Trail"),
    ("Renault","Clio"),("Renault","Megane"),("Renault","Scenic"),("Renault","Laguna"),
    ("Renault","Twingo"),("Renault","Zoe"),("Renault","Kadjar"),
    ("Peugeot","107"),("Peugeot","206"),("Peugeot","207"),("Peugeot","208"),
    ("Peugeot","307"),("Peugeot","308"),("Peugeot","3008"),
    ("Hyundai","i10"),("Hyundai","i20"),("Hyundai","i30"),("Hyundai","Tucson"),("Hyundai","ix35"),
    ("Kia","Picanto"),("Kia","Rio"),("Kia","Ceed"),("Kia","Sportage"),("Kia","Soul"),
    ("Fiat","500"),("Fiat","Punto"),("Fiat","Bravo"),("Fiat","Panda"),
    ("Skoda","Fabia"),("Skoda","Octavia"),("Skoda","Superb"),("Skoda","Yeti"),
    ("SEAT","Ibiza"),("SEAT","Leon"),("SEAT","Altea"),
    ("Mazda","2"),("Mazda","3"),("Mazda","6"),("Mazda","CX-5"),
]

BUYING_TITLES = [
    "What to Check Before Buying a Cheap Car",
    "How to Spot a Clocked Car in the UK",
    "What Does an MOT Certificate Tell You?",
    "How to Do a Pre-Purchase Car Inspection",
    "HPI Check: Is It Worth It for a Cheap Car?",
    "Buying a Car with Advisories — What to Know",
    "Is It Safe to Buy a Car with 6 Months MOT?",
    "What Is a V5C Logbook and Why Does It Matter?",
    "How to Transfer Car Ownership in the UK",
    "What to Do If You Buy a Car with Hidden Faults",
    "Cheap Cars Under £500 UK — What to Expect",
    "Cheap Cars Under £1000 UK — Best Buys",
    "Cheap Cars Under £2000 UK — What You Can Get",
    "Best First Cars for Young Drivers on a Budget",
    "Cheapest Cars to Insure in the UK",
    "Cheapest Cars to Run in the UK",
    "Most Reliable Cheap Cars UK",
    "Best Cheap Family Cars UK",
    "Best Cheap Cars for Long Motorway Commutes",
    "Best Cheap Diesel Cars UK",
    "Best Cheap Petrol Cars UK",
    "Should I Buy a Diesel or Petrol Cheap Car?",
    "Automatic vs Manual — Which is Cheaper to Buy?",
    "How to Negotiate When Buying a Cheap Car",
    "Red Flags to Watch When Buying a Cheap Car",
    "What Paperwork Do I Need to Buy a Car in the UK?",
    "How to Test Drive a Cheap Car",
    "What Questions to Ask When Buying a Used Car",
    "Can I Buy a Car Without a V5C?",
    "What Is a Cat S or Cat N Car — Should I Buy One?",
    "How to Check a Car's Full History for Free UK",
    "DVLA Vehicle Check — How It Works",
    "What Is the Mileage Sweet Spot for a Cheap Car?",
    "Buying a Car from a Private Seller vs Dealer",
    "How to Pay Safely When Buying a Car Privately",
    "What to Do After Buying a Car UK",
    "How to Register a Car in Your Name UK",
    "Cheap Cars for New Drivers UK",
    "Cheap Cars for Single Mums in the UK",
    "Cheap Cars for Students UK",
    "Cheap Cars for Delivery Drivers UK",
    "Cheap Cars for Uber/Taxi Drivers UK",
    "Best Cheap Cars for Women in the UK",
    "Cars That Last Well Even When Cheap",
    "What's the Cheapest Way to Get a Car in the UK?",
    "Leasing vs Buying a Cheap Car — What's Better?",
    "Finance vs Cash When Buying a Budget Car",
    "What Happens If a Cheap Car Breaks Down?",
    "Breakdown Cover for Cheap Cars — Is It Worth It?",
    "Best Cheap Cars That Pass MOT Easily",
    "How to Get the Most Out of a Budget Car",
    "Maintaining a Cheap Car — What You Must Do",
    "Oil Changes on a Budget Car — How Often?",
    "Tyres for Cheap Cars — What to Know",
    "How to Make a Cheap Car Last Longer",
    "Common Cheap Car Problems and How to Fix Them",
    "When to Give Up on a Cheap Car",
    "Signs Your Cheap Car Is About to Fail MOT",
    "Cheap Electric Cars UK — Are They Worth It?",
    "Buying a Hybrid on a Budget UK",
]

SELLING_TITLES = [
    "How to Price Your Old Car Realistically",
    "How to Take Great Car Photos for a Private Sale",
    "Where to List Your Car for Free in the UK",
    "How to Write a Good Car Listing Description",
    "How to Sell a Car That Won't Start",
    "How to Sell a Car with No MOT",
    "How to Sell a Car with Outstanding Finance",
    "Selling a Car with Damage — What to Know",
    "How to Deal with Timewasters When Selling a Car",
    "How to Avoid Scams When Selling Your Car",
    "What Documents Do I Need to Sell My Car?",
    "How to Notify DVLA When You Sell a Car",
    "How to Accept Payment Safely When Selling a Car",
    "Cash vs Bank Transfer When Selling a Car",
    "How to Cancel Car Insurance After Selling",
    "How to Sell a Car That Needs Repairs",
    "Should I Fix My Car Before Selling It?",
    "How to Sell a High-Mileage Car in the UK",
    "Selling an Old Car vs Scrapping It — What Pays More?",
    "How to Get the Best Price for a Scrap Car",
    "What Is My Car Worth to Scrap?",
    "Best Time of Year to Sell a Car in the UK",
    "How to Sell a Car Quickly in the UK",
    "Selling a Car with a Full Service History",
    "How to Sell a Car Without a V5C",
    "How to Transfer a Private Plate Before Selling",
    "How Much Does It Cost to Sell a Car Privately?",
    "How Long Does It Take to Sell a Car Privately?",
    "How to Sell a Car to a Dealer",
    "Part Exchange vs Private Sale — Which Is Better?",
    "Selling to We Buy Any Car — Is It Worth It?",
    "What to Tell Buyers About Your Car's History",
    "How to Make Your Old Car Look Better Before Sale",
    "Valeting a Car Before Selling — Is It Worth It?",
    "How to Sell a Diesel Car Post-ULEZ",
    "Selling a Car in Winter — Tips and Tricks",
    "How to Handle Test Drives Safely",
    "What to Do If a Buyer Wants to Return the Car",
    "Selling a Car as Seen — What Does It Mean?",
    "How to Leave Honest Feedback After a Private Sale",
]

MOT_TITLES = [
    "What Does an MOT Test Check?","How Long Does an MOT Take?",
    "How Much Does an MOT Cost in the UK?","Can I Drive Without an MOT?",
    "What Happens If My Car Fails Its MOT?","Most Common MOT Failure Reasons",
    "How to Prepare Your Car for MOT","MOT Advisories — What They Mean",
    "Minor vs Major vs Dangerous MOT Failures","How to Find a Cheap MOT Near Me",
    "Best Time to Book an MOT","Can I Get an MOT Without a V5C?",
    "MOT Retest — What You Need to Know","How Long Is an MOT Valid?",
    "Does a New Car Need an MOT?","MOT History Check — How to Do It Free",
    "How to Read an MOT Certificate","Electric Car MOT — What's Different?",
    "Classic Car MOT Exemptions UK","What Is the MOT Grace Period?",
    "Can You Sell a Car Without an MOT?","Buying a Car with a New MOT — Is It Better?",
    "What Is a DVLA MOT Check?","Can a Garage Fail an MOT Unfairly?",
    "How to Appeal an MOT Failure","MOT vs Service — What's the Difference?",
    "What Gets Checked in a Full Service?","Interim vs Full Service — Which Do I Need?",
    "How Often Should I Service My Car?","Can I MOT a Car That Has Been Off the Road?",
    "SORN and MOT — What You Need to Know","How to Get a SORN in the UK",
    "Keeping a Car Without MOT — Is It Legal?","MOT Test Centre vs Mobile MOT — What's Better?",
    "How to Know If Your Garage Is Doing a Fair MOT","Common Tyre Failures on MOT",
    "Common Brake Failures on MOT","Common Emissions Failures on MOT",
    "Common Light Failures on MOT","Common Suspension Failures on MOT",
    "Windscreen Cracks and MOT — What's Allowed?","Exhaust and MOT — What Gets Checked",
    "Catalytic Converter and MOT UK","Airbag Warning Light and MOT",
    "ABS Warning Light and MOT","Engine Warning Light and MOT",
    "How to Pass MOT on a Budget Car","Cheap Cars Most Likely to Pass MOT First Time",
    "Signs Your Car Will Fail Its MOT","How to Find an Honest MOT Garage",
]

BUDGET_TITLES = [
    "Living With a Cheap Car — Real Talk","Hidden Costs of Running a Cheap Car",
    "Cheapest Cars to Tax in the UK","Cheapest Cars to Insure for Young Drivers",
    "Free Car Tax Models Still Available UK","Cheapest Cars to Run Per Mile",
    "Budget Cars with Best MPG","Cheapest Cars to Maintain UK",
    "How to Budget for a Cheap Car","Total Cost of Ownership — Cheap Car vs New Car",
    "Why a Cheap Car Makes Sense Right Now","Cheap Cars That Look Expensive",
    "Best Cheap Cars for Families Under £2000","Best Cheap Cars for 1000 Miles a Month",
    "Best Cheap Estate Cars UK","Best Cheap SUVs Under £3000 UK",
    "Best Cheap City Cars UK","Best Cheap Cars for Motorway Driving",
    "Best Cheap Automatic Cars UK","Best Cheap Hatchbacks UK",
    "Ford Fiesta vs Vauxhall Corsa — Which Is Cheaper to Run?",
    "VW Polo vs Ford Fiesta — Best Budget Choice?",
    "Toyota Yaris vs Honda Jazz — Budget Reliability Compared",
    "Vauxhall Corsa vs Renault Clio — Which Wins on Budget?",
    "Nissan Micra vs Fiat 500 — Cheap Car Comparison",
    "Best Cheap Cars to Avoid Expensive Repairs","Most Expensive Cheap Cars to Repair — Avoid These",
    "Japanese vs European Budget Cars — Which Lasts Longer?","Cheap Cars with the Best Resale Value",
    "Cars Worth Buying for Scrap Price UK","Best Cheap Cars for Cold Weather UK",
    "Cheap Cars with Heated Seats","Cheap Cars with Air Conditioning",
    "Cheap Cars with Parking Sensors","Cheap Cars Good for Towing",
    "Cheap Vans UK — What to Know","Cheap 7-Seater Cars UK",
    "Cheap Cars for Tall People UK","Cheap Cars for Dog Owners UK",
    "Best Budget Cars for New Parents","Running a Cheap Car as a Student",
    "How to Make Your Budget Car Last 2 Years","Cheap Cars Worth the Risk vs Ones to Avoid",
    "Things to Never Skip on a Cheap Car","When It's Time to Walk Away from Your Cheap Car",
    "How to Keep Insurance Low on a Cheap Car","Breakdown Insurance for Budget Car Owners",
    "What to Do When Your Cheap Car Breaks Down","Cheap Car Emergency Fund — How Much to Save",
    "Buying the Right Cheap Car the First Time",
]

SCRAP_TITLES = [
    "When Should You Scrap a Car?","How Much Is My Scrap Car Worth?",
    "How to Scrap a Car in the UK — Step by Step","What Happens to a Scrapped Car?",
    "How to Find a Legit Scrap Yard Near Me","What Is an ATF (Authorised Treatment Facility)?",
    "Scrap Car Prices — What Affects the Value?","Best Scrap Car Price Comparison UK",
    "How Long Does It Take to Scrap a Car?","Do I Need a V5C to Scrap My Car?",
    "Can I Scrap a Car Without the Logbook?","How to Notify DVLA After Scrapping a Car",
    "Scrap Car Certificate of Destruction — What Is It?","How to Avoid Scrap Car Scams",
    "Is We Buy Any Car Worth It for Scrap?","Scrapping vs Selling — Which Gets More Money?",
    "How to Prepare a Car for Scrapping","What to Remove Before Scrapping Your Car",
    "Can I Scrap a Car That Isn't in My Name?","Scrapping a Car with Outstanding Finance",
    "How Much Do Scrap Yards Pay Per Tonne?","Scrap Metal Prices UK — Current Rates",
    "Best Time to Scrap a Car — Does Timing Matter?","Scrapping a Car with No Engine",
    "Scrapping a Car That Won't Start","Can I Scrap a Damaged Car?",
    "Selling Car Parts vs Scrapping Whole — Which Pays More?","Most Valuable Parts to Remove Before Scrapping",
    "Classic Cars — Scrap or Restore?","Electric Car Scrapping — Special Rules",
    "How to Recycle Your Old Car Responsibly","Environmental Impact of Car Scrapping UK",
    "ULEZ and Scrap Cars — What's Happening","Diesel Scrap Car Scrappage Schemes UK",
    "Government Scrappage Schemes UK History","Cat A, B, S, N — What Do They Mean?",
    "Buying a Cat S Car UK — Is It Safe?","Buying a Cat N Car UK — What to Know",
    "Insurance Write-Off Categories Explained","Can a Written-Off Car Be Repaired?",
    "End of Life Vehicles — UK Regulations","Where Does Scrap Car Metal Go?",
    "How Car Recycling Works in the UK","Carbon Footprint of Keeping an Old Car vs Buying New",
    "Is Scrapping Old Diesels Good for the Environment?","Scrap Car to EV — Government Incentives",
    "Free Car Collection for Scrapping — Is It Real?","Scrap Car Charity Donation — How It Works",
    "Abandoned Cars UK — Who Is Responsible?","End of Life vs Scrap — What's the Difference?",
]

FAQ_TITLES = [
    "Is BuyAndScrap.com Free to Use?","How Do I List My Car on BuyAndScrap?",
    "How Do I Contact a Seller?","Is the MOT Data on Listings Accurate?",
    "What If the Car Isn't as Described?","How Do I Know If a Seller Is Genuine?",
    "Can I Reserve a Car on BuyAndScrap?","What Is the Honesty Badge?",
    "How Long Do Listings Stay Live?","Can I List a Car Without an MOT?",
    "What Cars Can I List on BuyAndScrap?","Can Dealers List on BuyAndScrap?",
    "How Do I Delete My Listing?","How Do I Update My Listing?",
    "Can I List Multiple Cars?","What Photos Should I Include?",
    "How Do I Price My Car?","What Is the DVLA Check on Each Listing?",
    "Is My Phone Number Shared Publicly?","How Do Buyer Alerts Work?",
    "What Is a Featured Listing?","How Do I Pay for a Featured Listing?",
    "What Payment Methods Are Accepted?","What Is BuyAndScrap's Privacy Policy?",
    "How Do I Delete My Account?","I Found a Suspicious Listing — What Do I Do?",
    "What Is a Condition Rating?","What Does 'Known Faults Required' Mean?",
    "Can I Sell a Cat S or Cat N Car?","What Happens When My Car's MOT Expires?",
    "Can I List a Car Being Sold for Parts?","Is BuyAndScrap Available Across the UK?",
    "How Do I Use the MOT Checker?","What Data Does the MOT Checker Show?",
    "Is the MOT Checker Free?","How Do I Turn Off Email Alerts?",
    "What Browsers Does BuyAndScrap Support?","Is BuyAndScrap Safe?",
    "How Does BuyAndScrap Make Money?","Does BuyAndScrap Take a Commission?",
    "How Are Disputes Handled?","What Are the Terms of Use?",
    "Is BuyAndScrap GDPR Compliant?","How Do I Contact BuyAndScrap Support?",
    "What Is BuyAndScrap's Mission?",
]

# ============================================================
# MAIN GENERATION LOOP
# ============================================================

def main():
    progress = load_progress()
    completed = set(progress.get('completed', []))
    failed = set(progress.get('failed', []))
    
    all_items = []

    # 1. Pillars
    for title, slug, keyword, intent, pillar, words, cta_link, cta_text in PILLARS:
        path = f"pillars/{slug}.json"
        all_items.append(('pillar', path, title, slug, keyword, intent, pillar, words, cta_link, cta_text))

    # 2. Locations
    for city in CITIES:
        slug = f"cheap-cars-{slugify(city)}"
        path = f"locations/{slug}.json"
        title = f"Cheap Cars for Sale in {city} with MOT | BuyAndScrap"
        keyword = f"cheap cars {city.lower()}"
        extra = f"Include local flavour about {city}. Mention it's a great place to find budget transport."
        all_items.append(('location', path, title, slug, keyword, 'transactional', 'locations', 600, '/cars', f'Browse Cars in {city}'))

    # 3. Makes
    for make in MAKES:
        slug = f"cheap-{slugify(make)}-uk"
        path = f"makes/{slug}.json"
        title = f"Buy a Cheap {make} in the UK | Reliability, Issues & Tips | BuyAndScrap"
        keyword = f"cheap {make.lower()} UK"
        all_items.append(('make', path, title, slug, keyword, 'commercial', 'makes', 700, '/cars', f'Browse Cheap {make} Cars'))

    # 4. Models
    for make, model in MODELS:
        slug = f"cheap-{slugify(make)}-{slugify(model)}-uk"
        path = f"models/{slug}.json"
        title = f"Buy a Cheap {make} {model} UK | Common Issues & Buyer Tips | BuyAndScrap"
        keyword = f"cheap {make.lower()} {model.lower()} UK"
        extra = f"Focus on the {make} {model} specifically: common faults, years to avoid, what to inspect."
        all_items.append(('model', path, title, slug, keyword, 'commercial', 'models', 800, '/cars', f'Browse Cheap {make} {model}'))

    # 5. Blog articles
    for title in BUYING_TITLES:
        slug = slugify(title)
        path = f"guides/buying/{slug}.json"
        keyword = title.lower().replace("?","").replace("—","").strip()[:50]
        all_items.append(('buying', path, title, slug, keyword, 'informational', 'buying', 700, '/cars', 'Browse Cheap Cars'))

    for title in SELLING_TITLES:
        slug = slugify(title)
        path = f"guides/selling/{slug}.json"
        keyword = title.lower().replace("?","").replace("—","").strip()[:50]
        all_items.append(('selling', path, title, slug, keyword, 'informational', 'selling', 700, '/sell', 'List Your Car Free'))

    for title in MOT_TITLES:
        slug = slugify(title)
        path = f"guides/mot/{slug}.json"
        keyword = title.lower().replace("?","").replace("—","").strip()[:50]
        all_items.append(('mot', path, title, slug, keyword, 'informational', 'mot', 700, '/mot-checker', 'Check Your MOT Free'))

    for title in BUDGET_TITLES:
        slug = slugify(title)
        path = f"guides/budget/{slug}.json"
        keyword = title.lower().replace("?","").replace("—","").strip()[:50]
        all_items.append(('budget', path, title, slug, keyword, 'commercial', 'budget', 700, '/cars', 'Browse Budget Cars'))

    for title in SCRAP_TITLES:
        slug = slugify(title)
        path = f"guides/scrapping/{slug}.json"
        keyword = title.lower().replace("?","").replace("—","").strip()[:50]
        all_items.append(('scrapping', path, title, slug, keyword, 'informational', 'scrapping', 600, '/sell', 'Sell Your Car'))

    for title in FAQ_TITLES:
        slug = slugify(title)
        path = f"faqs/{slug}.json"
        keyword = title.lower().replace("?","").replace("—","").strip()[:50]
        all_items.append(('faq', path, title, slug, keyword, 'informational', 'faq', 400, '/cars', 'Get Started'))

    total = len(all_items)
    done = 0
    
    print(f"Total content pieces: {total}")
    print(f"Already completed: {len(completed)}")
    print(f"Starting generation...\n")

    for item in all_items:
        kind, path, title, slug, keyword, intent, pillar, words, cta_link, cta_text = item
        
        if path in completed:
            done += 1
            continue
            
        print(f"[{done+1}/{total}] {kind}: {title[:60]}...")
        
        data = make_article(title, slug, keyword, intent, pillar, words, cta=cta_link, cta_text=cta_text)
        
        if data:
            save_content(path, data)
            completed.add(path)
            if path in failed:
                failed.discard(path)
            done += 1
            print(f"  ✅ Saved ({done}/{total})")
        else:
            failed.add(path)
            print(f"  ❌ Failed")
        
        progress['completed'] = list(completed)
        progress['failed'] = list(failed)
        progress['total'] = total
        progress['done'] = done
        save_progress(progress)
        
        time.sleep(SLEEP)

    print(f"\n✅ Done! Generated {done}/{total} pieces.")
    print(f"Failed: {len(failed)}")
    
    # Final commit
    os.system(f"cd {REPO} && git add -A && git commit -m 'Content: {done} SEO pieces generated'")
    os.system("openclaw system event --text 'Done: 500 content pieces generated for buyandscrap.com' --mode now")

if __name__ == '__main__':
    main()
