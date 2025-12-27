import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConversationState {
  stage: "INITIAL_INTENT" | "CLARIFICATION" | "BLUEPRINT";
  initial_intent: string;
  clarification_questions: string[];
  clarification_answers: string;
}

interface StoreBlueprint {
  brandOverview: {
    name: string;
    tagline: string;
    description: string;
    targetAudience: string;
    positioning: string;
  };
  productCategories: {
    name: string;
    description: string;
  }[];
  sampleProducts: {
    name: string;
    category: string;
    priceRange: string;
    description: string;
  }[];
  homepageStructure: {
    hero: string;
    sections: string[];
  };
  essentialPages: string[];
  policies: string[];
}

const SYSTEM_PROMPT = `You are an AI Store Setup Engine that helps users create online store blueprints. You guide users through a conversational flow to understand their business and generate a comprehensive store structure.

Your conversation follows three stages:

1. INITIAL_INTENT: The user describes their business. Listen carefully and extract key information.

2. CLARIFICATION: Ask 2-3 targeted questions to understand:
   - Target customer (demographics, interests, needs)
   - Price range / market positioning (budget, mid-range, premium, luxury)
   - Brand vibe / aesthetic (minimalist, playful, elegant, rustic, modern, etc.)

3. BLUEPRINT: Generate a comprehensive store blueprint.

Rules:
- Be professional and concise
- No emojis
- Focus on extracting actionable business information
- When you have enough information, generate the blueprint`;

async function callAI(messages: { role: string; content: string }[], useTools: boolean = false): Promise<any> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    throw new Error("LOVABLE_API_KEY is not configured");
  }

  const body: any = {
    model: "google/gemini-2.5-flash",
    messages,
  };

  if (useTools) {
    body.tools = [
      {
        type: "function",
        function: {
          name: "generate_store_blueprint",
          description: "Generate a complete store blueprint based on the business information gathered.",
          parameters: {
            type: "object",
            properties: {
              brandOverview: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Store/brand name" },
                  tagline: { type: "string", description: "Short tagline" },
                  description: { type: "string", description: "Brand description" },
                  targetAudience: { type: "string", description: "Target customer description" },
                  positioning: { type: "string", description: "Market positioning" }
                },
                required: ["name", "tagline", "description", "targetAudience", "positioning"]
              },
              productCategories: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" }
                  },
                  required: ["name", "description"]
                }
              },
              sampleProducts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    category: { type: "string" },
                    priceRange: { type: "string" },
                    description: { type: "string" }
                  },
                  required: ["name", "category", "priceRange", "description"]
                }
              },
              homepageStructure: {
                type: "object",
                properties: {
                  hero: { type: "string", description: "Hero section description" },
                  sections: { type: "array", items: { type: "string" } }
                },
                required: ["hero", "sections"]
              },
              essentialPages: {
                type: "array",
                items: { type: "string" }
              },
              policies: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["brandOverview", "productCategories", "sampleProducts", "homepageStructure", "essentialPages", "policies"]
          }
        }
      }
    ];
    body.tool_choice = { type: "function", function: { name: "generate_store_blueprint" } };
  }

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI gateway error:", response.status, errorText);
    
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a moment.");
    }
    if (response.status === 402) {
      throw new Error("AI usage limit reached. Please check your account.");
    }
    throw new Error("Failed to get AI response");
  }

  return await response.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversation_state } = await req.json();
    
    console.log("Received request:", { message, stage: conversation_state.stage });

    let newState = { ...conversation_state };
    let reply = "";
    let blueprint: StoreBlueprint | null = null;

    const conversationHistory: { role: string; content: string }[] = [
      { role: "system", content: SYSTEM_PROMPT }
    ];

    if (conversation_state.stage === "INITIAL_INTENT") {
      // First message - user describes their business
      newState.initial_intent = message;
      
      conversationHistory.push({
        role: "user",
        content: `The user described their business: "${message}". Ask 2-3 concise clarifying questions about their target customer, price positioning, and brand aesthetic. Format as a numbered list.`
      });

      const aiResponse = await callAI(conversationHistory);
      reply = aiResponse.choices[0].message.content;
      
      newState.stage = "CLARIFICATION";
      newState.clarification_questions = reply.split('\n').filter((line: string) => line.trim());
      
    } else if (conversation_state.stage === "CLARIFICATION") {
      // User answered clarifying questions - generate blueprint
      newState.clarification_answers = message;
      
      conversationHistory.push({
        role: "user",
        content: `Business description: "${conversation_state.initial_intent}"\n\nClarifying questions asked: ${conversation_state.clarification_questions.join('\n')}\n\nUser's answers: "${message}"\n\nNow generate a complete store blueprint based on all this information.`
      });

      const aiResponse = await callAI(conversationHistory, true);
      
      // Extract the tool call response
      const toolCall = aiResponse.choices[0].message.tool_calls?.[0];
      if (toolCall && toolCall.function.name === "generate_store_blueprint") {
        blueprint = JSON.parse(toolCall.function.arguments);
        reply = "I've analyzed your business and created a comprehensive store blueprint. Here's your personalized store structure:";
      } else {
        // Fallback if tool call didn't work
        reply = aiResponse.choices[0].message.content || "Blueprint generation complete.";
      }
      
      newState.stage = "BLUEPRINT";
    }

    console.log("Sending response:", { reply: reply.substring(0, 100), stage: newState.stage, hasBlueprint: !!blueprint });

    return new Response(
      JSON.stringify({
        reply,
        conversation_state: newState,
        blueprint,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        reply: "I apologize, but I encountered an error processing your request. Please try again.",
        conversation_state: { stage: "INITIAL_INTENT", initial_intent: "", clarification_questions: [], clarification_answers: "" }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
