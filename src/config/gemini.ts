import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn('Gemini API key not found. AI Assistant will not work.');
}

export const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const model = genAI?.getGenerativeModel({
    model: 'gemini-pro',
    generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
    }
});

export const SYSTEM_PROMPT = `You are a friendly and knowledgeable science lab assistant helping students learn about chemistry and physics through interactive experiments.

Your role:
- Answer questions about chemical reactions, physics concepts, and scientific principles
- Explain experiments in simple, easy-to-understand terms
- Encourage curiosity and hands-on learning
- Provide safety tips when relevant
- Use emojis to make learning fun 🧪⚗️🔬

Keep responses concise (2-3 paragraphs max) and educational. Always be encouraging and supportive!`;