import { useState, useRef, useEffect } from 'react';
import { callGemmaModel, SYSTEM_PROMPT } from '../../config/ai-service';
import type { Message } from '../../types/chat';
import { useChatHistory } from '../../contexts/ChatHistoryContext';
import { useSimulator } from '../../contexts/SimulatorContext';
import { useAppwrite } from '../../contexts/AppwriteContext';
import { CHEMICALS } from '../../types/chemistry';
import type { Chemical } from '../../types/chemistry';

interface AIAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    context?: 'chemistry' | 'physics';
    initialMessages?: Message[];
    isContinuedChat?: boolean;
    sessionId?: string; // Add sessionId prop for continuing chats
}

interface APIError {
    message: string;
    name?: string;
    stack?: string;
}

// Add type definitions for chemical patterns
type ChemicalPattern = {
    [key: string]: RegExp[];
};

export const AIAssistant = ({ isOpen, onClose, context, initialMessages, isContinuedChat, sessionId }: AIAssistantProps) => {
    const { saveSession } = useChatHistory();
    const { triggerChemicalReaction } = useSimulator();
    const { incrementAIQuestionsCount } = useAppwrite();
    const [messages, setMessages] = useState<Message[]>(initialMessages && initialMessages.length > 0
        ? initialMessages
        : (isContinuedChat
            ? []
            : [
                {
                    id: '1',
                    role: 'assistant',
                    content: `Hi! 👋 I'm your AI Lab Assistant. I'm here to help you understand ${context || 'science'} experiments! Ask me anything about chemical reactions, physics concepts, or how things work. 

💡 **Pro tip:** Use \`/simulate [chemicals]\` to get a "Test in Simulator" button for any chemicals you want to experiment with!

What would you like to learn today?`,
                    timestamp: new Date(),
                },
            ])
    );
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasBeenSaved = useRef<boolean>(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            if (isContinuedChat && initialMessages && initialMessages.length > 0) {
                setMessages(initialMessages);
            } else {
                // New chat
                setMessages([
                    {
                        id: '1',
                        role: 'assistant',
                        content: `Hi! 👋 I'm your AI Lab Assistant. I'm here to help you understand ${context || 'science'} experiments! Ask me anything about chemical reactions, physics concepts, or how things work. What would you like to learn today?`,
                        timestamp: new Date(),
                    },
                ]);
            }
        } else {
            // Reset after a delay to allow close animation
            setTimeout(() => {
                setMessages([]);
                hasBeenSaved.current = false;
            }, 300);
        }
    }, [isOpen, context, initialMessages, isContinuedChat]);

    const handleClose = async () => {
        // Save session before closing if there are user messages and not already saved
        if (messages.some(m => m.role === 'user') && !hasBeenSaved.current) {
            try {
                await saveSession(messages, context, sessionId); // Pass sessionId for continued chats
                hasBeenSaved.current = true;
            } catch (error) {
                console.error('Failed to save chat session:', error);
            }
        }
        onClose();
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Increment AI questions count
        incrementAIQuestionsCount().catch(error => {
            console.error('Error incrementing AI questions count:', error);
        });

        // Handle /simulate command specially
        if (input.trim().toLowerCase() === '/simulate') {
            const helpMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `🧪 **Simulation Command Help**

Use \`/simulate [chemicals]\` to get a "Test in Simulator" button for any chemicals!

**Available chemicals:**
- Water
- Vinegar  
- Baking Soda
- Table Salt
- Sugar
- Lemon Juice
- Ethanol
- Methane

**Examples:**
- \`/simulate vinegar and baking soda\`
- \`/simulate water, salt\`
- \`/simulate ethanol\`
- \`/simulate methane\`

Just type the command with any combination of chemicals!`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, helpMessage]);
            setIsLoading(false);
            return;
        }

        try {
            // Limit conversation history to last 6 messages to prevent context overflow
            const recentMessages = messages.slice(-6);
            const conversationHistory = recentMessages
                .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
                .join('\n');

            const contextPrompt = context
                ? `Current lab: ${context}. User is working with ${context === 'chemistry' ? 'chemical reactions and mixtures' : 'physics simulations and gravity'}.`
                : '';

            const fullPrompt = `${SYSTEM_PROMPT}

${contextPrompt}

Conversation history:
${conversationHistory}

User: ${input}

Assistant:`;

            const result = await callGemmaModel(fullPrompt);

            // Extract the generated text from the response
            let response = '';
            if (result.generated_text) {
                response = result.generated_text.trim();
            } else {
                response = 'Sorry, I encountered an issue processing your request.';
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            const apiError = error as APIError;
            console.error('Error with AI response:', apiError);

            let errorMessage = 'Sorry, I encountered an error. ';

            if (apiError.message.includes('API key is not configured')) {
                errorMessage += 'Please make sure you have set your OpenRouter API key in the VITE_OPENROUTER_API_KEY environment variable.';
            } else if (apiError.message.includes('Invalid Google Gemini API key')) {
                errorMessage += 'Your API key seems to be invalid. Please check your VITE_OPENROUTER_API_KEY in the .env file.';
            } else if (apiError.message.includes('timed out')) {
                errorMessage += 'The request timed out. This might be due to a slow network connection or high demand on the API. Please try again.';
            } else if (apiError.message.includes('Network error')) {
                errorMessage += 'There seems to be a network connectivity issue. Please check your internet connection and try again.';
            } else {
                errorMessage += 'Please try again. If the problem persists, check that your API key is valid and your network connection is stable.';
            }

            const errorMessageObj: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: errorMessage,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorMessageObj]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Simple markdown parser for basic formatting
    const parseMarkdown = (content: string) => {
        // Split content into lines
        const lines = content.split('\n');
        const elements: React.ReactNode[] = [];
        let key = 0;

        // Process inline formatting for a line
        const processInlineFormatting = (line: string) => {
            return line
                .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>') // Bold and italic
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
                .replace(/__(.*?)__/g, '<strong>$1</strong>') // Bold
                .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
                .replace(/_(.*?)_/g, '<em>$1</em>') // Italic
                .replace(/~~(.*?)~~/g, '<del>$1</del>') // Strikethrough
                .replace(/`([^`]+)`/g, '<code>$1</code>'); // Inline code
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Check for code blocks (```)
            if (line.startsWith('```')) {
                // language tag intentionally ignored
                const codeLines = [];
                let j = i + 1;

                // Collect all lines until closing ```
                while (j < lines.length && !lines[j].startsWith('```')) {
                    codeLines.push(lines[j]);
                    j++;
                }

                elements.push(
                    <pre key={key++} className="markdown-code-block">
                        <code>{codeLines.join('\n')}</code>
                    </pre>
                );
                i = j; // Skip processed lines
            }
            // Check for blockquotes (>)
            else if (line.startsWith('> ')) {
                const quoteLines = [];
                let j = i;

                // Collect all consecutive blockquote lines
                while (j < lines.length && lines[j].startsWith('> ')) {
                    quoteLines.push(lines[j].substring(2));
                    j++;
                }

                elements.push(
                    <blockquote key={key++}>
                        {quoteLines.map((quoteLine, idx) => (
                            <p key={idx} dangerouslySetInnerHTML={{ __html: processInlineFormatting(quoteLine) }} />
                        ))}
                    </blockquote>
                );
                i = j - 1; // Adjust index
            }
            // Check for horizontal rules
            else if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
                elements.push(<hr key={key++} />);
            }
            // Check for headers (### Header)
            else if (line.startsWith('### ')) {
                elements.push(<h3 key={key++} dangerouslySetInnerHTML={{ __html: processInlineFormatting(line.substring(4)) }} />);
            }
            // Check for headers (## Header)
            else if (line.startsWith('## ')) {
                elements.push(<h2 key={key++} dangerouslySetInnerHTML={{ __html: processInlineFormatting(line.substring(3)) }} />);
            }
            // Check for headers (# Header)
            else if (line.startsWith('# ')) {
                elements.push(<h1 key={key++} dangerouslySetInnerHTML={{ __html: processInlineFormatting(line.substring(2)) }} />);
            }
            // Check for ordered lists (1. item)
            else if (/^\d+\.\s/.test(line.trim())) {
                const listItems = [];
                let j = i; // eslint-disable-next-line @typescript-eslint/no-unused-vars

                // Collect all consecutive ordered list items
                while (j < lines.length && /^\d+\.\s/.test(lines[j].trim())) {
                    // Extract the actual content after the number
                    const listItemContent = lines[j].trim().substring(lines[j].trim().indexOf('.') + 2);
                    listItems.push(<li key={key++} dangerouslySetInnerHTML={{ __html: processInlineFormatting(listItemContent) }} />);
                    j++;
                }

                elements.push(<ol key={key++}>{listItems}</ol>);
                i = j - 1; // Adjust index
            }
            // Check for bullet points (* item or - item)
            else if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                const listItems = [];
                let j = i;

                // Collect all consecutive list items
                while (j < lines.length &&
                    (lines[j].trim().startsWith('* ') || lines[j].trim().startsWith('- '))) {
                    const listItemContent = lines[j].trim().substring(2);
                    listItems.push(<li key={key++} dangerouslySetInnerHTML={{ __html: processInlineFormatting(listItemContent) }} />);
                    j++;
                }

                elements.push(<ul key={key++}>{listItems}</ul>);
                i = j - 1; // Adjust index
            }
            // Check for chemical equations (contain special characters)
            else if (line.includes('⇌') || line.includes('→') || line.includes('←') || line.includes('⁺') || line.includes('⁻')) {
                elements.push(<div key={key++} className="font-mono bg-gray-50 dark:bg-gray-700 rounded p-3 my-2 border border-gray-200 dark:border-gray-600">{line}</div>);
            }
            // Regular paragraph with inline formatting
            else if (line.trim() !== '') {
                elements.push(<p key={key++} dangerouslySetInnerHTML={{ __html: processInlineFormatting(line) }} />);
            }
            // Empty line
            else {
                elements.push(<div key={key++}>&nbsp;</div>);
            }
        }

        return elements;
    };

    const handleTestInSimulator = async (chemicalNames: string[]) => {
        // Handle help case
        if (chemicalNames.includes('help')) {
            const helpMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `🧪 **Available Chemicals for Simulation**

Here are all the chemicals you can use with \`/simulate\`:

**Basic Chemicals:**
- **Water** (H₂O) - Clear liquid, pH 7
- **Vinegar** (CH₃COOH) - Yellow liquid, pH 3, acidic
- **Baking Soda** (NaHCO₃) - White solid, pH 9, basic
- **Table Salt** (NaCl) - White solid, pH 7, neutral
- **Sugar** (C₁₂H₂₂O₁₁) - White solid, pH 7, sweet
- **Lemon Juice** (C₆H₈O₇) - Yellow liquid, pH 2, very acidic

**Flammable Chemicals:**
- **Ethanol** (C₂H₅OH) - Clear liquid, flammable
- **Methane** (CH₄) - Colorless gas, highly flammable

**Try these combinations:**
- \`/simulate vinegar and baking soda\` → Fizzing reaction!
- \`/simulate water and salt\` → Salt dissolves
- \`/simulate ethanol\` → Flammable liquid
- \`/simulate methane\` → Flammable gas`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, helpMessage]);
            return;
        }

        // Find chemicals by name from the predefined list
        const chemicalsToAdd: Chemical[] = [];

        chemicalNames.forEach(name => {
            const chemical = CHEMICALS.find(c =>
                c.name.toLowerCase() === name.toLowerCase() ||
                c.id.toLowerCase() === name.toLowerCase()
            );
            if (chemical) {
                chemicalsToAdd.push(chemical);
            }
        });

        if (chemicalsToAdd.length > 0) {
            // Save the session before triggering the simulation
            if (messages.some(m => m.role === 'user') && !hasBeenSaved.current) {
                try {
                    await saveSession([...messages, {
                        id: (Date.now() + 2).toString(),
                        role: 'assistant',
                        content: `🧪 Testing ${chemicalsToAdd.map(c => c.name).join(' + ')} in simulator...`,
                        timestamp: new Date()
                    }], context, sessionId); // Pass sessionId for continued chats
                    hasBeenSaved.current = true;
                } catch (error) {
                    console.error('Failed to save chat session before simulation:', error);
                }
            }

            triggerChemicalReaction(chemicalsToAdd);
            onClose();
        }
    };

    // Enhanced function to find chemicals
    const findChemicalsInText = (text: string): string[] => {
        const validChemicals = new Set<string>();
        const normalizedText = text.toLowerCase();

        // Map of chemical names and their variations to their IDs
        const chemicalPatterns: ChemicalPattern = {
            'vinegar': [
                /vinegar/i,
                /acetic acid/i,
                /ch₃cooh/i,
                /ch3cooh/i
            ],
            'baking-soda': [
                /baking\s*soda/i,
                /sodium\s*bicarbonate/i,
                /nahco₃/i,
                /nahco3/i
            ],
            'water': [
                /\bwater\b/i,
                /h₂o/i,
                /h2o/i
            ],
            'salt': [
                /\bsalt\b/i,
                /table\s*salt/i,
                /sodium\s*chloride/i,
                /nacl/i
            ],
            'sugar': [
                /\bsugar\b/i,
                /sucrose/i,
                /c₁₂h₂₂o₁₁/i
            ],
            'lemon-juice': [
                /lemon\s*juice/i,
                /citric\s*acid/i,
                /c₆h₈o₇/i
            ],
            'ethanol': [
                /ethanol/i,
                /c₂h₅oh/i,
                /c2h5oh/i
            ],
            'methane': [
                /methane/i,
                /ch₄/i,
                /ch4/i
            ]
        };

        // Check each chemical pattern against the text
        Object.entries(chemicalPatterns).forEach(([chemicalId, patterns]) => {
            if (patterns.some(pattern => pattern.test(normalizedText))) {
                validChemicals.add(chemicalId);
            }
        });

        return Array.from(validChemicals);
    };

    const parseReactionButton = (content: string): string[] | null => {
        const chemicals = new Set<string>();

        // 1. Check for explicit test commands
        const testMatch = content.match(/\[Test\s+(.+?)\s+in\s+Simulator\]/i);
        if (testMatch?.[1]) {
            findChemicalsInText(testMatch[1]).forEach(c => chemicals.add(c));
        }

        // 2. Check for chemical formulas
        const formulaMatches = content.match(/(?:CH₃COOH|NaHCO₃|H₂O|NaCl|C₂H₅OH|CH₄)/g);
        if (formulaMatches) {
            formulaMatches.forEach(formula => {
                findChemicalsInText(formula).forEach(c => chemicals.add(c));
            });
        }

        // 3. Check for chemical names
        const nameMatches = content.match(/(?:vinegar|baking soda|water|salt|ethanol|methane|acetic acid|sodium bicarbonate)/gi);
        if (nameMatches) {
            nameMatches.forEach(name => {
                findChemicalsInText(name).forEach(c => chemicals.add(c));
            });
        }

        // 4. Check for reaction descriptions
        if (content.toLowerCase().includes('titration') ||
            content.toLowerCase().includes('acid-base') ||
            content.toLowerCase().includes('neutralization')) {
            const reactionText = content.toLowerCase();
            if (reactionText.includes('vinegar') || reactionText.includes('acetic acid')) {
                chemicals.add('vinegar');
            }
            if (reactionText.includes('baking soda') || reactionText.includes('bicarbonate')) {
                chemicals.add('baking-soda');
            }
        }

        // Convert Set back to array and filter out any null/undefined values
        const validChemicals = Array.from(chemicals).filter(Boolean);
        return validChemicals.length > 0 ? validChemicals : null;
    };

    // Call the test function once when the component mounts
    useEffect(() => {
        // Test chemical matching on mount
        const testNames = ['ethanol', 'water', 'sugar', 'salt', 'vinegar', 'baking soda', 'methane', 'baking-soda'];
        testNames.forEach(name => {
            CHEMICALS.some(c =>
                c.name.toLowerCase() === name.toLowerCase() ||
                c.id.toLowerCase() === name.toLowerCase()
            );
        });
    }, []);

    const quickQuestions = [
        "What happens when vinegar and baking soda mix?",
        "What happens when methane burns?",
        "Why do objects bounce?",
        "What is a chemical reaction?",
        "How does fire work?",
        "/simulate vinegar and baking soda",
        "/simulate water and salt",
        "Simulate what happens when ethanol mixes with water",
        "Test the reaction between baking soda and vinegar",
        "Can you show me how salt dissolves in water?",
        "What happens if I mix ethanol and water?",
        "Show me the reaction between methane and oxygen",
        "Simulate a simple acid-base titration",
        "Show me a neutralization reaction",
        "What happens during a combustion reaction?"
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🤖</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                AI Lab Assistant
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {context ? `${context} mode` : 'Ready to help'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => {
                        const chemicalsInMessage = message.role === 'assistant' ? parseReactionButton(message.content) : null;

                        return (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl p-4 ${message.role === 'user'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'}
                                        }`}
                                >
                                    <div className="markdown-content">
                                        {parseMarkdown(message.content)}
                                    </div>

                                    {/* Test in Simulator button for chemistry reactions */}
                                    {context === 'chemistry' && chemicalsInMessage && (
                                        <button
                                            onClick={() => handleTestInSimulator(chemicalsInMessage)}
                                            className="mt-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                                        >
                                            <span>🧪</span>
                                            <span>
                                                {chemicalsInMessage.includes('help')
                                                    ? 'Show Available Chemicals'
                                                    : `Test ${chemicalsInMessage.map(id => {
                                                        const chemical = CHEMICALS.find(c => c.id === id);
                                                        return chemical ? chemical.name : id;
                                                    }).join(' + ')} in Simulator`
                                                }
                                            </span>
                                        </button>
                                    )}

                                    <p className="text-xs mt-2 opacity-70">
                                        {message.timestamp.toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions */}
                {messages.length <= 1 && (
                    <div className="px-4 pb-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            Quick questions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {quickQuestions.slice(0, 3).map((question, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setInput(question)}
                                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>

                        {context === 'chemistry' && (
                            <div className="mt-3">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                    Try simulation commands:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        '/simulate vinegar and baking soda',
                                        '/simulate water and salt',
                                        '/simulate ethanol',
                                        'Simulate methane and oxygen reaction',
                                        'Test ethanol burning',
                                        'What happens when I mix salt and water?',
                                        'Show me vinegar and baking soda reaction',
                                        'Simulate a simple titration experiment',
                                        'Show me a neutralization reaction'
                                    ].map((command, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setInput(command)}
                                            className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors font-mono"
                                        >
                                            {command}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything about science..."
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                            rows={2}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
