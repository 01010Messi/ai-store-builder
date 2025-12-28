import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateContent } from './llm.js';
import {
    CLARIFICATION_PROMPT_1_AUDIENCE,
    CLARIFICATION_PROMPT_2_PRICE,
    CLARIFICATION_PROMPT_3_AESTHETIC,
    BLUEPRINT_PROMPT
} from './prompts.js';
import { INITIAL_STATE } from './types.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// --- CACHE & CONFIG ---
const responseCache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

function getCacheKey(state) {
    if (state.stage === 'BLUEPRINT') {
        return `BLUEPRINT:${state.initial_intent}:${state.clarification_answers}`;
    }
    return `${state.stage}:${state.clarification_step}:${state.initial_intent}:${state.clarification_answers}`;
}

function parseJSON(text) {
    try {
        const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("JSON Parse Error:", e);
        return null;
    }
}

app.post('/chat', async (req, res) => {
    try {
        const { message, conversation_state } = req.body;
        let state = conversation_state || INITIAL_STATE;

        // Ensure defaults
        if (state.clarification_step === undefined) state.clarification_step = 0;
        if (!state.clarification_questions) state.clarification_questions = [];

        let reply = "";
        let options = [];
        let blueprint = null;

        // Optimization: Check Cache First
        const cacheKey = getCacheKey(state);

        // Note: For Blueprint, if we have it in state, return it?
        // User request: "If the user scrolls, refreshes... Return cached responses"
        // If state already has the data for the NEXT step, we might not need to call AI.
        // But the previous architecture didn't store "next question" in state persistently across refreshes unless frontend sent it.
        // Frontend sends 'state' back to us.

        // If we are in 'CLARIFICATION' and step is X, we are generating question for step X+1 (or X).
        // The logic below handles transitions.

        // --- STATE MACHINE ---

        if (state.stage === 'INITIAL_INTENT') {
            state.initial_intent = message;
            state.stage = 'CLARIFICATION';
            state.clarification_step = 1;

            const cacheHit = responseCache.get(getCacheKey(state));
            if (cacheHit) {
                console.log("Cache Hit (Intent)");
                reply = cacheHit.reply;
                options = cacheHit.options;
                state.clarification_questions.push(reply);
            } else {
                const prompt = CLARIFICATION_PROMPT_1_AUDIENCE.replace('{initial_intent}', state.initial_intent);
                // Use Lite model for clarification
                const aiRaw = await generateContent(prompt, "gemini-2.5-flash-lite");
                const aiData = parseJSON(aiRaw);

                if (aiData) {
                    reply = aiData.question;
                    options = aiData.options || [];
                    state.clarification_questions.push(reply);

                    responseCache.set(getCacheKey(state), { reply, options });
                } else {
                    throw new Error("Failed to parse AI response");
                }
            }

        } else if (state.stage === 'CLARIFICATION') {
            // Strict Limit: Max 3 steps.
            if (state.clarification_step >= 4) {
                // Should be Blueprint.
                state.stage = 'BLUEPRINT';
            } else {

                if (state.clarification_step === 1) {
                    state.clarification_answers += `\nTarget Audience: ${message}`;
                    state.clarification_step = 2;

                    const cacheHit = responseCache.get(getCacheKey(state));
                    if (cacheHit) {
                        console.log("Cache Hit (Step 2)");
                        reply = cacheHit.reply;
                        options = cacheHit.options;
                        state.clarification_questions.push(reply);
                    } else {
                        const prompt = CLARIFICATION_PROMPT_2_PRICE
                            .replace('{initial_intent}', state.initial_intent)
                            .replace('{clarification_answers}', state.clarification_answers);

                        const aiRaw = await generateContent(prompt, "gemini-2.5-flash-lite");
                        const aiData = parseJSON(aiRaw);

                        if (aiData) {
                            reply = aiData.question;
                            options = aiData.options || [];
                            state.clarification_questions.push(reply);
                            responseCache.set(getCacheKey(state), { reply, options });
                        } else {
                            throw new Error("Failed to parse AI response");
                        }
                    }

                } else if (state.clarification_step === 2) {
                    state.clarification_answers += `\nPricing: ${message}`;
                    state.clarification_step = 3;

                    const cacheHit = responseCache.get(getCacheKey(state));
                    if (cacheHit) {
                        console.log("Cache Hit (Step 3)");
                        reply = cacheHit.reply;
                        options = cacheHit.options;
                        state.clarification_questions.push(reply);
                    } else {
                        const prompt = CLARIFICATION_PROMPT_3_AESTHETIC
                            .replace('{initial_intent}', state.initial_intent)
                            .replace('{clarification_answers}', state.clarification_answers);

                        const aiRaw = await generateContent(prompt, "gemini-2.5-flash-lite");
                        const aiData = parseJSON(aiRaw);

                        if (aiData) {
                            reply = aiData.question;
                            options = aiData.options || [];
                            state.clarification_questions.push(reply);
                            responseCache.set(getCacheKey(state), { reply, options });
                        } else {
                            throw new Error("Failed to parse AI response");
                        }
                    }

                } else if (state.clarification_step === 3) {
                    state.clarification_answers += `\nAesthetic: ${message}`;
                    state.stage = 'BLUEPRINT';
                    // Fallthrough to Blueprint
                }
            }
        }

        if (state.stage === 'BLUEPRINT') {
            // Check if blueprint already exists in state
            if (state.blueprint) {
                blueprint = state.blueprint;
                reply = "Here is your store blueprint.";
            } else {
                const cKey = getCacheKey(state);
                const cacheHit = responseCache.get(cKey);

                if (cacheHit) {
                    console.log("Cache Hit (Blueprint)");
                    blueprint = cacheHit.blueprint;
                    reply = cacheHit.reply;
                } else {
                    const prompt = BLUEPRINT_PROMPT
                        .replace('{initial_intent}', state.initial_intent)
                        .replace('{clarification_answers}', state.clarification_answers);

                    // Use Standard model for Blueprint
                    const aiRaw = await generateContent(prompt, "gemini-2.5-flash");
                    const aiData = parseJSON(aiRaw);

                    if (aiData) {
                        blueprint = aiData;
                        reply = "Here is your store blueprint based on our conversation.";

                        responseCache.set(cKey, { blueprint, reply });
                    } else {
                        throw new Error("Failed to generate blueprint");
                    }
                }
            }
        }

        res.json({
            reply,
            options,
            conversation_state: state,
            blueprint
        });

    } catch (error) {
        console.error("Error in /chat:", error);
        res.status(500).json({
            reply: "I encountered a technical issue while processing your request. Please try again.",
            conversation_state: req.body.conversation_state || INITIAL_STATE
        });
    }
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
