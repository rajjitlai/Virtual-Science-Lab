import { useState } from 'react';

interface WelcomeTourProps {
    onComplete: () => void;
}

export const WelcomeTour = ({ onComplete }: WelcomeTourProps) => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: "Welcome to Virtual Science Lab! 🧪",
            description: "Explore chemistry and physics through interactive experiments. Let's take a quick tour!",
            icon: "👋"
        },
        {
            title: "Chemistry Lab 🧪",
            description: "Mix chemicals, watch reactions, and see bubbling effects in a 3D beaker. Try mixing vinegar and baking soda!",
            icon: "⚗️"
        },
        {
            title: "Physics Lab ⚡",
            description: "Drop balls and boxes, adjust gravity, and explore different planets. Watch objects collide and bounce!",
            icon: "🌍"
        },
        {
            title: "AI Assistant 🤖",
            description: "Click the AI button to ask questions about your experiments. Get instant explanations about science!",
            icon: "💬"
        },
        {
            title: "Chat History & Settings ⚙️",
            description: "Review past conversations and customize your experience with themes and preferences.",
            icon: "📚"
        },
        {
            title: "Ready to Experiment! 🎉",
            description: "You're all set! Start exploring and have fun learning science.",
            icon: "🚀"
        }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            localStorage.setItem('welcomeTourCompleted', 'true');
            onComplete();
        }
    };

    const handleSkip = () => {
        localStorage.setItem('welcomeTourCompleted', 'true');
        onComplete();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[200] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
                <div className="text-6xl mb-4">{steps[step].icon}</div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                    {steps[step].title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {steps[step].description}
                </p>

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mb-6">
                    {steps.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all ${idx === step ? 'bg-indigo-600 w-8' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                        />
                    ))}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleSkip}
                        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        Skip
                    </button>
                    <button
                        onClick={handleNext}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold"
                    >
                        {step === steps.length - 1 ? "Let's Go!" : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};