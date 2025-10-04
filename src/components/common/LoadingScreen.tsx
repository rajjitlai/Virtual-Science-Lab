export const LoadingScreen = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="text-center">
                <div className="relative">
                    <div className="w-24 h-24 border-8 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                        🧪
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-white mt-6 mb-2">
                    Virtual Science Lab
                </h2>
                <p className="text-white text-opacity-90">Loading your experiments...</p>
            </div>
        </div>
    );
};