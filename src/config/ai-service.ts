// Using OpenRouter API with google/gemma-3n-e2b-it:free model
// API key required for this service

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Simple rate limiting - track last request time
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second minimum between requests

/**
 * Calls the OpenRouter API with the google/gemma-3n-e2b-it:free model
 * This implementation requires an API key
 */
export const callGemmaModel = async (prompt: string) => {
    try {
        // Get API key from environment variables
        const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
        
        if (!apiKey) {
            throw new Error('OpenRouter API key is not configured. Please set VITE_OPENROUTER_API_KEY in your .env file.');
        }

        // Simple rate limiting
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
            const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
            console.log(`Rate limiting: waiting ${delay}ms before next request`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        lastRequestTime = Date.now();

        // Log the prompt length for debugging
        console.log(`Sending prompt with ${prompt.length} characters`);
        
        // Set a reasonable timeout for the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin, // Optional, for openrouter dashboard
            },
            body: JSON.stringify({
                model: 'google/gemma-3n-e2b-it:free',
                messages: [
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 500,
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Log response status for debugging
        console.log(`API response status: ${response.status}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API error response: ${errorText}`);
            throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }

        const data: OpenRouterResponse = await response.json();
        console.log(`API response usage:`, data.usage);
        
        const content = data.choices[0]?.message?.content || "I'm sorry, I couldn't process your question. Please try again.";
        
        return {
            generated_text: content
        };
    } catch (error: any) {
        console.error("Error calling OpenRouter API:", error);
        
        // Handle timeout specifically
        if (error.name === 'AbortError') {
            throw new Error('The request to OpenRouter API timed out. Please check your network connection and try again.');
        }
        
        // Handle API key errors
        if (error.message && error.message.includes('API key is not configured')) {
            throw new Error('OpenRouter API key is not configured. Please set VITE_OPENROUTER_API_KEY in your .env file.');
        }
        
        // Handle network errors
        if (error instanceof TypeError) {
            throw new Error('Network error when connecting to OpenRouter API. Please check your internet connection and try again.');
        }
        
        // Re-throw other errors
        throw error;
    }
};

export const SYSTEM_PROMPT = `You are a friendly and knowledgeable science lab assistant helping students learn about chemistry and physics through interactive experiments.

Your role:
- Answer questions about chemical reactions, physics concepts, and scientific principles
- Explain experiments in simple, easy-to-understand terms
- Encourage curiosity and hands-on learning
- Provide safety tips when relevant
- Use emojis to make learning fun 🧪⚗️🔬

Formatting guidelines:
- For chemical equations, use clear formatting with proper subscripts
- For reversible reactions, use the ⇌ symbol as shown: NH₄NO₃(s) ⇌ NH₄⁺(aq) + NO₃⁻(aq)
- For heat absorption, indicate with a heat symbol: + heat or Δ
- For lists of items, use bullet points with asterisks (*)
- For emphasis, use bold text sparingly
- Keep responses concise (2-3 paragraphs max) and educational
- Always be encouraging and supportive!

Example of good formatting:
* **NH₄NO₃(s):** Ammonium nitrate in solid form
* **H₂O(l):** Water in liquid form
* **⇌:** This symbol represents a reversible reaction
* **NH₄⁺(aq):** Ammonium ions in aqueous solution
* **NO₃⁻(aq):** Nitrate ions in aqueous solution
* **Heat:** This indicates that heat is absorbed during the process 💥

Always format chemical equations clearly and use proper subscripts for chemical formulas.`;