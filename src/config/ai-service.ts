// Updated to use a free API alternative
// No API key required for this implementation

// Function to call free AI API
export const callGemmaModel = async (prompt: string) => {
    try {
        // Using a free API endpoint from NLP Cloud
        const response = await fetch(
            "https://api.nlpcloud.io/v1/gpu/finetuned-llama-2-7b/generation",
            {
                headers: { 
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    text: prompt,
                    max_length: 1000,
                    temperature: 0.7,
                    remove_input: true
                }),
            }
        );
        
        if (!response.ok) {
            // Fallback to local mock response if API fails
            console.warn(`API error: ${response.status}. Using fallback response.`);
            return mockAIResponse(prompt);
        }
        
        const result = await response.json();
        return {
            generated_text: result.generated_text || "I'm sorry, I couldn't generate a response at this time."
        };
    } catch (error) {
        console.error("Error calling AI API:", error);
        // Fallback to local mock response
        return mockAIResponse(prompt);
    }
};

// Fallback function that generates responses locally when API is unavailable
const mockAIResponse = (prompt: string) => {
    // Extract the user's question from the prompt
    const userQuestion = prompt.split("User: ").pop()?.split("\n")[0] || "";
    
    // Simple pattern matching for common science questions
    if (userQuestion.toLowerCase().includes("vinegar") && userQuestion.toLowerCase().includes("baking soda")) {
        return {
            generated_text: "When vinegar (an acid) and baking soda (a base) mix, they create a chemical reaction! The reaction produces carbon dioxide gas, which creates bubbles and fizzing. This is an example of an acid-base reaction that's commonly used in science experiments and even in cooking. 🧪"
        };
    } else if (userQuestion.toLowerCase().includes("gravity")) {
        return {
            generated_text: "Gravity is the force that pulls objects toward each other. On Earth, it pulls everything toward the center of the planet. It's why things fall down instead of up! The strength of gravity depends on mass - bigger objects like planets have stronger gravity. That's why you weigh less on the Moon than on Earth, since the Moon has less mass. 🌍"
        };
    } else if (userQuestion.toLowerCase().includes("chemical reaction")) {
        return {
            generated_text: "A chemical reaction happens when substances (reactants) transform into new substances (products) by breaking and forming chemical bonds. Signs of a chemical reaction include color changes, temperature changes, gas production (bubbles), light emission, or precipitate formation. Chemical reactions are happening all around us - from cooking food to batteries powering devices! ⚗️"
        };
    } else {
        return {
            generated_text: "That's an interesting science question! While I'm currently operating in offline mode, I can tell you that science is all about curiosity and exploration. Try experimenting with the virtual lab tools to discover the answer through hands-on learning! 🔬"
        };
    }
};

export const SYSTEM_PROMPT = `You are a friendly and knowledgeable science lab assistant helping students learn about chemistry and physics through interactive experiments.

Your role:
- Answer questions about chemical reactions, physics concepts, and scientific principles
- Explain experiments in simple, easy-to-understand terms
- Encourage curiosity and hands-on learning
- Provide safety tips when relevant
- Use emojis to make learning fun 🧪⚗️🔬

Keep responses concise (2-3 paragraphs max) and educational. Always be encouraging and supportive!`;