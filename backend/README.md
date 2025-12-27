# AI Store Setup Engine Backend

This is the backend for the AI Store Setup Engine. It handles the chat logic, state management, and interaction with the Gemini API.

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Set environment variables:
    Create a `.env` file with:
    ```
    GEMINI_API_KEY=your_api_key
    PORT=3000
    ```

3.  Start the server:
    ```bash
    npm start
    ```

## API

### POST /chat

Accepts:
```json
{
  "message": "User message",
  "conversation_state": { ... }
}
```

Returns:
```json
{
  "reply": "AI response",
  "conversation_state": { ... },
  "blueprint": { ... } // Only in BLUEPRINT stage
}
```
