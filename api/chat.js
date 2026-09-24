// ============================================================
// ASK THIS HOUSE ANYTHING — API backend
// Runs server-side so the Anthropic API key stays private.
// ============================================================

const PROPERTY = {
  address: "60 Housatonic Drive, Sandy Hook, Newtown, CT 06482",
  price: "$925,000 (reduced from original list price of $975,000)",
  bedsBaths: "4 bedrooms / 3 full bathrooms / 2,522 sq ft",
  agentName: "Richelle Ward",
  agentContact: "(203) 470-9819, richelle.ward@cbmoves.com",

  knowledge: `
PROPERTY OVERVIEW:
Cape Cod-style home in the Shady Rest community on Lake Zoar, in the
Sandy Hook section of Newtown, Connecticut. Originally built in 1963;
the foundation was expanded and the home was substantially rebuilt in
1996. The home has 2,522 sq ft of living area, 4 bedrooms, 3 full
bathrooms, 7 total rooms, and 1 fireplace. The lot is approximately
0.38 acres and is zoned R-2.

WATERFRONT:
The property has 75 feet of direct waterfront on Lake Zoar, with its
own private dock and private boat launch. The backyard is level to the
water. Waterfront features include lake access, dock/mooring,
association beach rights, and water views.

ROOM LAYOUT:
Main level: living room (17' x 13') with fireplace and hardwood floor;
dining room (13' x 13') with sliders to the outdoors and hardwood
floor; oversized kitchen (17' x 22.4') with double sink, large center
island, two electric Thermador cooktops, double wall oven, generous
cabinetry, tile floor, and a wall of windows overlooking the water;
one bedroom (13' x 12'); full bathroom; mudroom; and main-level
laundry.

Second floor: primary bedroom (19' x 13') with full bathroom; two
additional bedrooms (9' x 13' and 16'8" x 10'2"); a hall bathroom;
and a separate 10'1" x 13' flex room. The flex room is currently
staged with a bed for marketing purposes but is not one of the home's
four bedrooms. One of the actual bedrooms is currently furnished as
an office.

Lower level: full unfinished basement with walk-out access and a
garage/storage area with its own exterior garage door. This provides
convenient storage and access for water toys and outdoor equipment.

The attic has pull-down stairs and storage space.

OUTDOOR SPACE:
The home has a screened porch, oversized deck, and patio, providing
three separate outdoor spaces for relaxing, dining, and entertaining.
There is also a garden area. Two stained-glass windows add character
to the home.

CONSTRUCTION, SYSTEMS & UPGRADES:
- Exterior: vinyl siding
- Foundation: concrete
- Roof: asphalt shingle roof replaced August 2026
- HVAC air handlers and condenser units replaced August 2013
- Heating: oil-fueled hot-water heat
- Cooling: central air plus ceiling fans
- Well pump and related plumbing replaced February 2023
- Hot water heater replaced October 2023
- Private well
- Septic system
- Central vacuum system
- Security system
- Generator is wired to operate everything except the air conditioning
- Frigidaire 27-inch double electric wall oven purchased January 9, 2021
- Frigidaire 24-inch built-in dishwasher purchased February 20, 2016
- Frigidaire side-by-side refrigerator purchased February 20, 2016
- Whirlpool 4.8 cu ft efficiency load washer purchased March 15, 2015
- Whirlpool 7.0 cu ft efficiency dryer purchased March 15, 2015
- Vacuflo Central Vacuum System purchased May 26, 2010
- Parking includes a 1-car attached garage and circular driveway

FLOOD INFORMATION:
The property is shown in a mapped flood zone. The seller states that
the house has not flooded. Flood insurance requirements can depend on
the current flood-zone designation, lender, financing, and insurance
policy. Buyers should confirm the current flood-zone designation and
any flood-insurance requirements with their lender, insurance
professional, and/or listing agent.

HOA / SHADY REST:
The property is in the Shady Rest community on Lake Zoar. The
association fee is $150 per year and covers lake/beach access.
Association participation is optional; it is not a mandatory fee.

NEIGHBORHOOD & SCHOOLS:
The property is in the Sandy Hook section of Newtown, Connecticut.
School assignment is determined by the Newtown Board of Education.
The high school is Newtown High School. Sandy Hook Center, with shops
and restaurants, is just minutes away.

TAXES & LISTING HISTORY:
Property tax is approximately $15,561 for the July 2026-June 2027 tax
year. Assessed value is $531,830 and the mil rate is 29.26.
The property was originally listed August 21, 2026 at $975,000.
The price was reduced to $925,000 on September 16, 2026.
`,
};

const SYSTEM_PROMPT = `
You are the AI property concierge for ${PROPERTY.address}.
The property is currently offered at ${PROPERTY.price}.
It has ${PROPERTY.bedsBaths}.

Answer questions about THIS PROPERTY only from the verified property
information supplied below. Do not guess, infer, embellish, or invent
property-specific facts.

If the verified information does not answer the buyer's question,
say that you do not have that information and recommend confirming
with the listing agent.

Do not use historical well-water mineral test results to characterize
the property's current water quality. Current water quality should be
determined through appropriate buyer testing.

If asked about flooding, flood risk, flood zones, flood insurance,
the lake in relation to flooding, or similar topics, explain that the
property is shown in a mapped flood zone and that the seller states
the house has not flooded. Buyers should independently confirm the
current flood-zone designation and any insurance requirements.

If asked for legal, financial, inspection, environmental, insurance,
boundary, septic, well-testing, or other professional advice, do not
give professional conclusions. Direct the buyer to the appropriate
professional and/or the listing agent.

Do not disclose confidential agent remarks or information that is not
included in the verified property information below.

Keep answers conversational, helpful, factual, and reasonably concise.

Use plain text only. Do not use Markdown, headings, bold or italic formatting, asterisks, hashtags, horizontal rules, bullet symbols, emojis, or decorative formatting. Write in short, natural paragraphs.


Do not routinely end answers by directing the buyer to the listing agent or providing agent contact information. Provide agent contact information only when the buyer asks to schedule a showing, requests documents, wants to contact an agent, or when the requested property-specific information is not available in the verified materials.

Do not characterize a neighborhood using subjective lifestyle descriptions such as "relaxed," "quiet," "friendly," "safe," "family-friendly," or similar terms. For neighborhood questions, provide only factual location, amenity, transportation, school, waterfront, and community information supported by the verified materials.
If someone wants to schedule a showing, obtain documents, or speak
with a person, direct them to:
${PROPERTY.agentName}
${PROPERTY.agentContact}

VERIFIED PROPERTY INFORMATION:

${PROPERTY.knowledge}
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Missing messages" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error:
        "Server is missing ANTHROPIC_API_KEY. Set it in Vercel environment variables.",
    });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();

      console.error(
        "Anthropic API error:",
        response.status,
        errText
      );

      return res.status(response.status).json({
        error: `Anthropic API error: ${errText}`,
      });
    }

    const data = await response.json();

    const reply = (data.content || [])
      .map((item) => item.text || "")
      .join("\n")
      .trim();

    return res.status(200).json({
      reply:
        reply ||
        "I don't have enough verified information to answer that question.",
    });
  } catch (error) {
    console.error("Assistant request failed:", error);

    return res.status(500).json({
      error: "Failed to reach the assistant. Please try again.",
    });
  }
}
