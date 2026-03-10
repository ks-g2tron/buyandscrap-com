#!/bin/bash
# PM Agent Hourly Check Script
# Checks project status, continues work, emails KS if blocked

REPO="/root/.openclaw/workspace/buyandscrap"
AGENTMAIL_TOKEN=$(grep AGENTMAIL_TOKEN ~/.openclaw/.env.secrets | cut -d= -f2)
GITHUB_TOKEN=$(grep GITHUB_TOKEN ~/.openclaw/.env.secrets | cut -d= -f2)
VERCEL_TOKEN=$(grep VERCEL_TOKEN ~/.openclaw/.env.secrets | cut -d= -f2)
GEMINI_API_KEY=$(grep GEMINI_API_KEY ~/.openclaw/.env.secrets | cut -d= -f2)
KS_EMAIL="ksisbuilding@gmail.com"
AGENT_EMAIL="gen2tron-jc@agentmail.to"

cd "$REPO"

# Get recent git log
RECENT_COMMITS=$(git log --oneline -5 2>/dev/null || echo "No commits yet")

# Check for blocker file
BLOCKER=""
if [ -f "$REPO/BLOCKER.md" ]; then
  BLOCKER=$(cat "$REPO/BLOCKER.md")
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
  # Send a system event so JC can report to KS if needed
  openclaw system event --text "📊 BuyAndScrap hourly check: No blockers. Last commits: $(git log --oneline -2 | tr '\n' ' ')" --mode now
fi
