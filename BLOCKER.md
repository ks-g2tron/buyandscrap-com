# Blockers

## BLOCKER 1: Supabase Project Setup
**Status:** BLOCKED — requires browser login
**Date:** 2026-03-10
**Impact:** Database, auth, real-time features

### Problem
Supabase project creation requires interactive browser login at https://supabase.com/dashboard.
The CLI (`supabase init` / `supabase link`) also requires an access token generated via the dashboard.
There is no fully headless way to create a new Supabase project without initial browser auth.

### Steps for KS to unblock:
1. Go to https://supabase.com/dashboard and sign in (or create account)
2. Click "New Project" → name it `buyandscrap` → choose region `eu-west-2` (London) → set a DB password
3. Once created, go to Settings → API and copy:
   - `SUPABASE_URL` (e.g. `https://xxxxx.supabase.co`)
   - `SUPABASE_ANON_KEY` (public anon key)
   - `SUPABASE_SERVICE_KEY` (service role key — keep secret)
4. Add these to `~/.openclaw/.env.secrets`
5. Run the SQL schema in `src/lib/schema.sql` (will be created) via the Supabase SQL editor

### Workaround
Using local JSON file storage (`data/` directory) as fallback until Supabase is connected.
All data access goes through `src/lib/data.ts` which can be swapped to Supabase later.

---

## BLOCKER 2: DVLA Vehicle Enquiry API Key
**Status:** BLOCKED — requires API key registration
**Date:** 2026-03-10
**Impact:** Vehicle lookup, MOT history, auto-fill on /sell page

### Problem
The DVLA Vehicle Enquiry Service API requires registration at:
https://developer-portal.driver-vehicle-licensing.api.gov.uk/

Registration is free but requires manual approval (usually 1-2 business days).

### Steps for KS to unblock:
1. Go to https://developer-portal.driver-vehicle-licensing.api.gov.uk/
2. Register for an account
3. Subscribe to the "Vehicle Enquiry Service" API
4. Copy the API key (from your profile → subscriptions)
5. Add `DVLA_API_KEY=your_key_here` to `~/.openclaw/.env.secrets`

### Workaround
Using mock DVLA data for development. The mock returns realistic vehicle data for any registration.
When the real API key is available, swap `src/lib/dvla.ts` from mock to live mode.
