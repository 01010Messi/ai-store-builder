# AI Store Backend

The robust Node.js backend powering the **AI Store Setup Engine**. It orchestrates the AI conversation, adheres to strict business rules, and interfaces with the Google Gemini API.

## Core Responsibilities

1.  **Conversation State Machine**:
    -   Manages transitions: `INITIAL_INTENT` → `CLARIFICATION` (Steps 1-3) → `BLUEPRINT`.
    -   Strictly enforces the **3-Question Limit** to prevent infinite loops.
2.  **AI Integration (Gemini)**:
    -   **Smart Model Splitting**:
        -   `gemini-2.5-flash-lite`: Used for clarification questions (Speed/Cost efficiency).
        -   `gemini-2.5-flash`: Used for Blueprint generation (High fidelity).
3.  **Safety & Quality Limits**:
    -   **Rate Limiting**: Blocks excessive calls.
    -   **Response Caching**: In-memory caching for identical states (e.g. page refreshes).
    -   **No Mock Data**: Strict crash-on-failure policy to ensure no hallucinated "Mock Stores" are shown to users.
    -   **India-First Context**: All prompts enforced to use **INR (₹)** and relevant market examples.

## API Documentation

### `POST /chat`

**Request:**
```json
{
  "message": "User input text",
  "conversation_state": { ... } // Detailed state object
}
```

**Response:**
```json
{
  "reply": "AI text response",
  "options": ["Option 1", "Option 2"], // For UI buttons
  "conversation_state": { ... }, // Updated state
  "blueprint": null // or JSON object if complete
}
```

## Security & Setup

### Environment Variables
**WARNING**: Never commit `.env` files.
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your Gemini API Key in `.env`.

### Rate Limiting
-   Max 3 Clarification Steps enforced.
-   Caching enabled for redundant requests.

