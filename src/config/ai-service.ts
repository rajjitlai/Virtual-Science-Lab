// Using a completely free approach with local response generation
// No API key or external service required

/**
 * Simulates an AI model response using local pattern matching
 * This implementation doesn't require any API keys or external services
 */
export const callGemmaModel = async (prompt: string) => {
    try {
        // Simulate network delay for realistic experience (300-800ms)
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
        
        // Generate response locally using pattern matching
        return generateLocalResponse(prompt);
    } catch (error) {
        console.error("Error generating AI response:", error);
        // Return a fallback response in case of any errors
        return {
            generated_text: "I'm sorry, I couldn't process your question. Please try again with a different question about science concepts."
        };
    }
};

/**
 * Generates AI-like responses locally using pattern matching
 * This function provides educational responses to common science questions
 */
const generateLocalResponse = (prompt: string) => {
    // Extract the user's question from the prompt
    const userQuestion = prompt.split("User: ").pop()?.split("\n")[0] || "";
    
    // Enhanced pattern matching for common science questions
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
    } else if (userQuestion.toLowerCase().includes("atom") || userQuestion.toLowerCase().includes("molecule")) {
        return {
            generated_text: "Atoms are the basic building blocks of matter, made of protons, neutrons, and electrons. Molecules form when two or more atoms bond together. For example, water (H₂O) is a molecule made of two hydrogen atoms and one oxygen atom. The way atoms connect determines the properties of substances we see in everyday life! ⚛️"
        };
    } else {
        return {
            generated_text: "That's an interesting science question! I can help you explore this topic through our virtual lab tools. Science is all about curiosity and hands-on learning. What specific aspect would you like to investigate further? 🔬"
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