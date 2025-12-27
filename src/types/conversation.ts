export type ConversationStage = "INITIAL_INTENT" | "CLARIFICATION" | "BLUEPRINT";

export interface ConversationState {
  stage: ConversationStage;
  initial_intent: string;
  clarification_questions: string[];
  clarification_answers: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  conversation_state: ConversationState;
}

export interface ChatResponse {
  reply: string;
  conversation_state: ConversationState;
}

export interface StoreBlueprint {
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
