# Ask This House Anything — 60 Housatonic Drive

A public, no-login AI concierge for 60 Housatonic Drive, Sandy Hook, Newtown, CT.
Built from the active MLS listing (MLS# 24200671), listed by Richelle Ward,
Coldwell Banker Realty.

Current list price: $925,000 (reduced from $975,000 on 09/16/2026).

Note: confidential agent remarks (e.g. the non-working cooktop burner) were
intentionally left out of the assistant's knowledge — that's information
for you and the buyer's agent to handle directly, not for a public chatbot.

## Deploy (same steps as before, ~10 minutes on Vercel free tier)
1. Get an Anthropic API key at https://console.anthropic.com
2. Create a free account at https://vercel.com
3. Upload this folder to a GitHub repo (or run `vercel` from inside this
   folder via the CLI) and import it as a new Vercel project
4. Add an environment variable: `ANTHROPIC_API_KEY` = your key
5. Deploy — you'll get a URL like `ask-60-housatonic.vercel.app`
6. Test it in a private/incognito window to confirm no login is needed
7. Generate a QR code from the URL for signs, flyers, and listing pages

## What's different from the previous listing's package
- Knowledge base pulled from the MLS, assessor/field-card materials, floor plans,
  seller's property condition report, historical town well/septic records, and seller upgrade sheet
- Includes a standing instruction to always mention the flood zone
  disclosure if a buyer asks about flooding or insurance
- Uses the seller condition report for current well/flood disclosures and intentionally
  omits historical mineral test results that do not establish current water quality
- Reflects the Shady Rest community's non-mandatory $150/year fee
