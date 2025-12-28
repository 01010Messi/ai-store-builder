export const CLARIFICATION_PROMPT_1_AUDIENCE = `
You are an expert e-commerce consultant.
User Intent: "{initial_intent}"

Task:
Ask ONE question to identify the primary target audience.
Provide 4 distinct options + "Other".

Output format (JSON ONLY):
{
  "question": "Your question here...",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4", "Other (type your own)"],
  "dimension": "customer"
}
`;

export const CLARIFICATION_PROMPT_2_PRICE = `
You are an expert e-commerce consultant.
User Intent: "{initial_intent}"
Context: "{clarification_answers}"

Task:
Ask ONE question to determine the price positioning.
Provide 4 distinct options with INR (₹) ranges where applicable + "Other".

Output format (JSON ONLY):
{
  "question": "Your question here...",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4", "Other (type your own)"],
  "dimension": "pricing"
}
`;

export const CLARIFICATION_PROMPT_3_AESTHETIC = `
You are an expert e-commerce consultant.
User Intent: "{initial_intent}"
Context: "{clarification_answers}"

Task:
Ask ONE question to define the brand aesthetic.
Provide 4 distinct options + "Other".

Output format (JSON ONLY):
{
  "question": "Your question here...",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4", "Other (type your own)"],
  "dimension": "aesthetic"
}
`;

export const BLUEPRINT_PROMPT = `
You are an expert e-commerce consultant.
Generate a structured store blueprint.

User Intent: "{initial_intent}"
Clarification Context: "{clarification_answers}"

Task:
Generate a JSON object representing the store blueprint.
The output MUST be valid JSON. Do not include markdown formatting like \`\`\`json.

Structure:
{
  "brandOverview": {
    "name": "Store Name",
    "tagline": "Catchy Tagline",
    "description": "Brief description",
    "targetAudience": "Target audience description",
    "positioning": "Luxury/Budget/Eco-friendly etc."
  },
  "productCategories": [
    { "name": "Category 1", "description": "Description" },
    { "name": "Category 2", "description": "Description" },
    { "name": "Category 3", "description": "Description" }
  ],
  "sampleProducts": [
    { "name": "Product 1", "category": "Category 1", "priceRange": "₹500-₹1500", "description": "Description" },
    { "name": "Product 2", "category": "Category 2", "priceRange": "₹2500-₹5000", "description": "Description" }
  ],
  "homepageStructure": {
    "hero": "Hero section description",
    "sections": ["Section 1", "Section 2", "Section 3"]
  },
  "essentialPages": ["About Us", "Contact", "FAQ"],
  "policies": ["Shipping Policy", "Return Policy"]
}

Rules:
- Human-readable content.
- No emojis.
- No mention of Shopify or competitors.
- Pure JSON output.
- STRICTLY USE INDIAN RUPEES (₹) for all prices.
- Example: "₹599", "₹1200-₹2000".
- DO NOT use "$" or "USD".
`;
