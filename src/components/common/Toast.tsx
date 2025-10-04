import { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
    duration?: number;
}

export const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const styles = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
    };

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] animate-slide-up">
            <div className={`${styles[type]} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]`}>
                <span className="text-2xl">{icons[type]}</span>
                <p className="flex-1">{message}</p>
                <button onClick={onClose} className="text-white hover:text-gray-200">
                    ✕
                </button>
            </div>
        </div>
    );
};