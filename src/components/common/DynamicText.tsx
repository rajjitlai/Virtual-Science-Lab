import { useState, useEffect } from 'react';

interface DynamicTextProps {
    aiResponse?: string;
    className?: string;
    showRandomWords?: boolean;
    randomWordsInterval?: number;
}

const ENGAGING_WORDS = [
    "🧪 Experimenting...",
    "⚗️ Mixing chemicals...",
    "🔬 Analyzing results...",
    "💡 Discovery!",
    "🌟 Amazing!",
    "🎯 Perfect reaction!",
    "✨ Magic happening!",
    "🚀 Science in action!",
    "🎨 Color changing...",
    "💫 Bubbling up!",
    "🔥 Fire detected!",
    "❄️ Cooling down...",
    "🌈 Beautiful colors!",
    "🎪 Lab show!",
    "🎭 Chemical theater!",
    "🎨 Art meets science!",
    "🌟 Spectacular!",
    "💎 Crystal clear!",
    "🎯 Bullseye!",
    "🚀 Blast off!",
    "✨ Shimmering...",
    "🎪 Amazing show!",
    "🎨 Creative chemistry!",
    "🌟 Stellar results!",
    "💫 Mesmerizing!",
    "🎭 Dramatic reaction!",
    "🎪 Lab circus!",
    "🎨 Colorful magic!",
    "🌟 Brilliant!",
    "💎 Precious discovery!"
];

export const DynamicText = ({
    aiResponse,
    className = "",
    showRandomWords = true,
    randomWordsInterval = 2000
}: DynamicTextProps) => {
    const [currentText, setCurrentText] = useState<string>("");
    const [isTyping, setIsTyping] = useState(false);
    const [randomWord, setRandomWord] = useState<string>("");

    // Typewriter effect for AI responses
    useEffect(() => {
        if (!aiResponse) return;

        setIsTyping(true);
        setCurrentText("");

        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < aiResponse.length) {
                setCurrentText(aiResponse.slice(0, index + 1));
                index++;
            } else {
                setIsTyping(false);
                clearInterval(typeInterval);
            }
        }, 30); // 30ms per character for smooth typing

        return () => clearInterval(typeInterval);
    }, [aiResponse]);

    // Random words rotation
    useEffect(() => {
        if (!showRandomWords) return;

        const wordInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * ENGAGING_WORDS.length);
            setRandomWord(ENGAGING_WORDS[randomIndex]);
        }, randomWordsInterval);

        // Set initial random word
        const initialIndex = Math.floor(Math.random() * ENGAGING_WORDS.length);
        setRandomWord(ENGAGING_WORDS[initialIndex]);

        return () => clearInterval(wordInterval);
    }, [showRandomWords, randomWordsInterval]);

    const displayText = aiResponse ? currentText : randomWord;
    const showCursor = isTyping || (!aiResponse && showRandomWords);

    return (
        <div className={`dynamic-text ${className}`}>
            <div className="relative">
                <span className="text-lg font-medium text-gray-800 dark:text-white">
                    {displayText}
                </span>
                {showCursor && (
                    <span className="animate-pulse text-indigo-500 ml-1">|</span>
                )}
            </div>

            {/* Decorative elements */}
            <div className="flex items-center gap-2 mt-2">
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    {aiResponse ? 'AI Response' : 'Lab Status'}
                </div>
            </div>
        </div>
    );
};
