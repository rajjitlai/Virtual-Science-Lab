interface AIButtonProps {
    onClick: () => void;
}

export const AIButton = ({ onClick }: AIButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center text-3xl z-40"
            title="Ask AI Assistant"
        >
            🤖
        </button>
    );
};