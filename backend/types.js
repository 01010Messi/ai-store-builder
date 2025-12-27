/**
 * @typedef {'INITIAL_INTENT' | 'CLARIFICATION' | 'BLUEPRINT'} ConversationStage
 */

/**
 * @typedef {Object} ConversationState
 * @property {ConversationStage} stage - The current stage of the conversation.
 * @property {string} initial_intent - The user's initial business idea.
 * @property {string[]} clarification_questions - Questions asked to the user.
 * @property {string} clarification_answers - User's answers to the clarification questions.
 */

/**
 * @typedef {Object} StoreBlueprint
 * @property {Object} brandOverview
 * @property {string} brandOverview.name
 * @property {string} brandOverview.tagline
 * @property {string} brandOverview.description
 * @property {string} brandOverview.targetAudience
 * @property {string} brandOverview.positioning
 * @property {Array<{name: string, description: string}>} productCategories
 * @property {Array<{name: string, category: string, priceRange: string, description: string}>} sampleProducts
 * @property {Object} homepageStructure
 * @property {string} homepageStructure.hero
 * @property {string[]} homepageStructure.sections
 * @property {string[]} essentialPages
 * @property {string[]} policies
 */

export const INITIAL_STATE = {
    stage: 'INITIAL_INTENT',
    initial_intent: '',
    clarification_questions: [],
    clarification_answers: '',
};
