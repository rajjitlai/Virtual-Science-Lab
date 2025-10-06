// Updated to use Hugging Face Inference API for Gemma model
const API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn('Hugging Face API key not found. AI Assistant will not work.');
}

// Function to call Hugging Face Inference API for Gemma
export const callGemmaModel = async (prompt: string) => {
    if (!API_KEY) {
        throw new Error('Hugging Face API key not configured. Please add your API key to .env file.');
    }

    const response = await fetch(
        "https://api-inference.huggingface.co/models/google/gemma-2b-it",
        {
            headers: { Authorization: `Bearer ${API_KEY}` },
            method: "POST",
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 1000,
                    temperature: 0.7,
                }
            }),
        }
    );
    
    if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
};

export const SYSTEM_PROMPT = `You are a friendly and knowledgeable science lab assistant helping students learn about chemistry and physics through interactive experiments.

Your role:
- Answer questions about chemical reactions, physics concepts, and scientific principles
- Explain experiments in simple, easy-to-understand terms
- Encourage curiosity and hands-on learning
- Provide safety tips when relevant
- Use emojis to make learning fun 🧪⚗️🔬

Keep responses concise (2-3 paragraphs max) and educational. Always be encouraging and supportive!`;