# AI Store Setup Engine

## 1. Project Overview

The AI Store Setup Engine is a foundational onboarding primitive designed to replace manual e-commerce configuration with an intelligent, conversational agent. It is not a fully functional e-commerce store in itself, but rather the "setup wizard" engine that would power the next generation of merchant platforms.

The system guides a user from a vague business idea to a complete, structured JSON store blueprint through a deterministic workflow: Intent -> Clarification -> Blueprint. This blueprint serves as the single source of truth for downstream provisioning of products, themes, and settings.

## 2. Problem Statement

Traditional e-commerce onboarding (e.g., Shopify, WooCommerce) suffers from "blank canvas paralysis." New merchants are immediately confronted with complex dashboards, empty product lists, and generic theme editors before they have even defined their business.

This friction leads to high churn during onboarding. Merchants are forced to become web designers and copywriters immediately. The cognitive load of configuring shipping zones, tax rates, and product variants often overwhelms first-time entrepreneurs who simply want to sell a specific product.

Current solutions rely on static templates or long intake forms, neither of which actively help the merchant structure their catalogue or refine their value proposition.

## 3. Solution: AI-First Store Setup

This engine inverts the varied configuration model into a unified conversation. Instead of asking the user to "create a product," the system asks, "What do you want to sell?"

The solution implements a strict, deterministic state machine:

1.  **Business Intent**: The user provides a natural language description of their idea.
2.  **Structured Clarification**: The system generates exactly three context-aware multiple-choice questions. These questions allow the user to refine their target audience, pricing strategy, and aesthetic without typing lengthy responses.
3.  **Blueprint Generation**: The engine actively synthesizes the conversation into a final store architecture (Blueprint), which is a machine-readable JSON object containing product catalogs, page structures, and brand positioning.

By limiting the interaction to three questions, the system ensures the setup process is predictable, finite, and always results in a usable outcome.

## 4. How This Fits Into an AI-First Shopify Competitor

In a hypothetical AI-first e-commerce platform, this engine is the entry point. It replaces the "Sign Up" flow.

The output of this engine is a structured Blueprint. This Blueprint is not merely text; it is a configuration object that downstream systems would consume to:

*   **Auto-populate the Catalog**: Generate realistic products with titles, descriptions, and prices based on the user's specific answers.
*   **Provision the Database**: Create the necessary database rows for the store's inventory and categories.
*   **Generate Frontend Code**: Select and configure UI components that match the "Modern" or "Classic" aesthetic defined in the blueprint.
*   **Configure Admin Settings**: Set default currency, shipping rules, and return policies appropriate for the user's region and vertical.

This transforms the platform from a tool the merchant has to build, into a service that is built for them.

## 5. How AI Is Used

The system uses Generative AI (Google Gemini) as a controlled reasoning engine, not an open-ended chatbot. We prioritize reliability and structure over creativity.

**Controlled Reasoning**
The AI is constrained to specific tasks at specific stages. It is not allowed to hallucinate platform features or deviate from the onboarding script.

**Deterministic State Machine**
The backend enforces a strict flow (Intent -> Q1 -> Q2 -> Q3 -> Blueprint). The AI cannot choose to ask a fourth question or skip to the end. This guarantees a consistent user experience.

**Model Strategy**
We utilize a split-model approach for performance and cost optimization:
*   **Clarification Phase**: Uses `gemini-2.5-flash-lite`. This smaller, faster model is sufficient for generating relevant multiple-choice questions.
*   **Blueprint Phase**: Uses `gemini-2.5-flash`. The final generation requires a larger context window and stronger reasoning capabilities to produce a complex, valid JSON object.

**Safety Limits**
To prevent token exhaustion and loops, the system enforces hard limits on API calls. No mock data is used; if the AI fails, the system fails gracefully rather than presenting hallucinated placeholders.

## 6. Architecture Overview

**Frontend (React + Vite)**
A lightweight, reactive interface that renders the conversational flow. It visualizes the "Setup Guide" state to keep the user oriented and displays the final JSON Blueprint as a preview.

**Backend (Node.js + Express)**
The state manager and orchestrator. It maintains the conversation history, selects the appropriate AI model, sanitizes inputs, and ensures the JSON output adheres to the strict schema required by the blueprint parser.

**LLM (Google Gemini)**
The intelligence layer, accessed via a secure backend integration. It handles the specific tasks of intent classification, question generation, and structured data synthesis.

## 7. What's Next

To evolve this prototype into a production service, the next logical steps are:

*   **Live Provisioning**: Build the pipeline to ingest the JSON Blueprint and write actual data to a database (e.g., Postgres/Supabase).
*   **Payment Integration**: Automatically configure payment gateways (e.g., Stripe/Razorpay) based on the user's region in the blueprint.
*   **Theme Generation**: Use the "Aesthetic" parameter to dynamically style a storefront using a utility-first CSS framework.
*   **Merchant Customization**: Create a standard admin dashboard where the merchant can tweet the AI-generated settings after the initial setup.
