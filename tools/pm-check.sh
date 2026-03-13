#!/bin/bash
# PM Agent Hourly Check Script
# Checks all project statuses, emails KS if blocked

REPO="/root/.openclaw/workspace/buyandscrap"
SITES_DIR="/root/.openclaw/workspace/sites"
AGENTMAIL_TOKEN=$(grep AGENTMAIL_TOKEN ~/.openclaw/.env.secrets | cut -d= -f2)
GITHUB_TOKEN=$(grep GITHUB_TOKEN ~/.openclaw/.env.secrets | cut -d= -f2)
VERCEL_TOKEN=$(grep VERCEL_TOKEN ~/.openclaw/.env.secrets | cut -d= -f2)
GEMINI_API_KEY=$(grep GEMINI_API_KEY ~/.openclaw/.env.secrets | cut -d= -f2)
KS_EMAIL="ksisbuilding@gmail.com"
AGENT_EMAIL="gen2tron-jc@agentmail.to"

cd "$REPO"

# Get recent git log
RECENT_COMMITS=$(git log --oneline -5 2>/dev/null || echo "No commits yet")

# Check for blocker file - only flag if it contains 🚨 or "BLOCKED:" markers
BLOCKER=""
if [ -f "$REPO/BLOCKER.md" ]; then
  RAW=$(cat "$REPO/BLOCKER.md")
  # Only treat as a real blocker if the file contains active blocker markers
  if echo "$RAW" | grep -qE "^## BLOCKER|Status: BLOCKED"; then
    BLOCKER="$RAW"
  fi
fi

# Check for status file
STATUS=""
if [ -f "$REPO/SPRINT_STATUS.md" ]; then
  STATUS=$(cat "$REPO/SPRINT_STATUS.md")
fi

echo "=== PM Check $(date) ==="
echo "Recent commits:"
echo "$RECENT_COMMITS"
echo ""

# If there's a blocker, email KS
if [ -n "$BLOCKER" ]; then
  echo "🚨 BLOCKER DETECTED - Sending email to KS"
  
  curl -s -X POST "https://api.agentmail.to/v0/inboxes/${AGENT_EMAIL}/threads" \
    -H "Authorization: Bearer ${AGENTMAIL_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{
      \"to\": [\"${KS_EMAIL}\"],
      \"subject\": \"🚨 BuyAndScrap.com — Action Required: Blocker Detected\",
      \"text\": \"Hi KS,\n\nThe build team has hit a blocker that needs your attention:\n\n${BLOCKER}\n\nRecent progress:\n${RECENT_COMMITS}\n\nPlease reply to this email or message JC on Telegram to unblock.\n\nThe team is standing by.\n\n— JC (Orchestrator)\nbuyandscrap.com project\"
    }"
  
  echo "Email sent to KS"
  
  # Notify via OpenClaw system event too
  openclaw system event --text "🚨 BuyAndScrap blocker detected - emailed KS. Check BLOCKER.md" --mode now
  
else
  echo "✅ No blockers. Project running."
fi

# ── Other Projects Status ──────────────────────────────────────────────────
echo ""
echo "=== Other Projects ==="

check_site() {
  local name=$1
  local url=$2
  local file=$3

  if [ -n "$url" ]; then
    HTTP=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$url" 2>/dev/null)
    if [ "$HTTP" = "200" ] || [ "$HTTP" = "301" ] || [ "$HTTP" = "302" ]; then
      echo "✅ $name — LIVE ($url) [HTTP $HTTP]"
    else
      echo "⚠️  $name — NOT LIVE ($url) [HTTP $HTTP]"
    fi
  else
    echo "⏳ $name — Awaiting deployment (GitHub: $file)"
  fi
}

# Read URLs from sites files if they exist
APPEAL_URL=$(grep -i "^Live URL:" "$SITES_DIR/appeal-my-fine.txt" 2>/dev/null | grep -v "pending" | sed 's/Live URL: //' | tr -d '[:space:]')
MTD_URL=$(grep -i "^Expected URL:\|^Live URL:" "$SITES_DIR/mtd-ready.txt" 2>/dev/null | head -1 | sed 's/.*: //' | tr -d '[:space:]')
CTF_URL=$(grep -i "^Live URL:\|^Expected URL:" "$SITES_DIR/council-tax-fighter.txt" 2>/dev/null | head -1 | sed 's/.*: //' | tr -d '[:space:]')

check_site "AppealMyFine" "$APPEAL_URL" "github.com/ks-g2tron/appeal-my-fine"
check_site "MTDReady" "https://mtd-ready.vercel.app" "github.com/ks-g2tron/mtd-ready"
check_site "CouncilTaxFighter" "https://council-tax-fighter.vercel.app" "github.com/ks-g2tron/council-tax-fighter"
check_site "BuyAndScrap" "https://buyandscrap.vercel.app" ""
check_site "Dashboard" "https://ks-g2tron.github.io/ks-venture-dashboard/" ""

# ── System Event ──────────────────────────────────────────────────────────
openclaw system event --text "📊 Hourly check: BuyAndScrap ✅ | Last commit: $(git log --oneline -1 | cut -c1-60)" --mode now
