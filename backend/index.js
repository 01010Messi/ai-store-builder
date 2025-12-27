import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateContent } from './llm.js';
import { CLARIFICATION_PROMPT, BLUEPRINT_PROMPT } from './prompts.js';
import { INITIAL_STATE } from './types.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
    try {
        const { message, conversation_state } = req.body;
        let state = conversation_state || INITIAL_STATE;
        let reply = "";
        let blueprint = null;

        // State Machine Logic
        if (state.stage === 'INITIAL_INTENT') {
            state.initial_intent = message;
            state.stage = 'CLARIFICATION';

            const prompt = CLARIFICATION_PROMPT.replace('{initial_intent}', state.initial_intent)
                .replace('{clarification_answers}', '');

            const aiResponse = await generateContent(prompt);
            reply = aiResponse;

            // Extract questions (simple heuristic: split by newlines and filter)
            state.clarification_questions = aiResponse.split('\n').filter(line => line.match(/^\d+\./));

        } else if (state.stage === 'CLARIFICATION') {
            state.clarification_answers += `\nUser: ${message}`;

            // Check if we need more clarification or if we are ready for blueprint
            // For simplicity, after 3 interactions or if AI says READY, we move to blueprint.
            // Here we will just ask the AI again if it has enough info.

            const prompt = CLARIFICATION_PROMPT.replace('{initial_intent}', state.initial_intent)
                .replace('{clarification_answers}', state.clarification_answers);

            const aiResponse = await generateContent(prompt);

            if (aiResponse.includes("READY_FOR_BLUEPRINT") || state.clarification_answers.length > 500) { // Safety break
                state.stage = 'BLUEPRINT';
                // Fallthrough to blueprint generation immediately
            } else {
                reply = aiResponse;
                state.clarification_questions = aiResponse.split('\n').filter(line => line.match(/^\d+\./));
            }
        }

        if (state.stage === 'BLUEPRINT') {
            const prompt = BLUEPRINT_PROMPT.replace('{initial_intent}', state.initial_intent)
                .replace('{clarification_answers}', state.clarification_answers);

            const aiResponse = await generateContent(prompt);

            // Clean up JSON block if present
            const jsonStr = aiResponse.replace(/```json\n?|\n?```/g, '');
            try {
                blueprint = JSON.parse(jsonStr);
                reply = "Here is your store blueprint based on our conversation.";
            } catch (e) {
                console.error("Failed to parse blueprint JSON", e);
                reply = "I created a blueprint but there was an error formatting it. Please try again.";
            }
        }

        res.json({
            reply,
            conversation_state: state,
            blueprint
        });

    } catch (error) {
        console.error("Error in /chat:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
