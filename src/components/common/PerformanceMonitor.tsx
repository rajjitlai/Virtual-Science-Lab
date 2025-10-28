import { useState, useEffect, useRef } from 'react';

interface PerformanceStats {
    fps: number;
    memory: number;
    renderTime: number;
    objects: number;
}

interface PerformanceMonitorProps {
    isVisible: boolean;
    onToggle: () => void;
}

export const PerformanceMonitor = ({ isVisible, onToggle }: PerformanceMonitorProps) => {
    const [stats, setStats] = useState<PerformanceStats>({
        fps: 0,
        memory: 0,
        renderTime: 0,
        objects: 0
    });
    const frameCount = useRef(0);
    const lastTime = useRef(performance.now());
    const animationId = useRef<number>();

    useEffect(() => {
        if (!isVisible) return;

        const updateStats = () => {
            const now = performance.now();
            frameCount.current++;

            if (now - lastTime.current >= 1000) {
                const fps = Math.round((frameCount.current * 1000) / (now - lastTime.current));

                // Get memory usage if available
                const memory = (performance as any).memory
                    ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
                    : 0;

                setStats(prev => ({
                    ...prev,
                    fps,
                    memory,
                    renderTime: now - lastTime.current
                }));

                frameCount.current = 0;
                lastTime.current = now;
            }

            animationId.current = requestAnimationFrame(updateStats);
        };

        animationId.current = requestAnimationFrame(updateStats);

        return () => {
            if (animationId.current) {
                cancelAnimationFrame(animationId.current);
            }
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs font-mono z-50">
            <div className="flex items-center justify-between mb-2">
                <span className="font-bold">Performance</span>
                <button
                    onClick={onToggle}
                    className="text-gray-400 hover:text-white"
                >
                    ✕
                </button>
            </div>
            <div className="space-y-1">
                <div className="flex justify-between">
                    <span>FPS:</span>
                    <span className={stats.fps >= 30 ? 'text-green-400' : stats.fps >= 15 ? 'text-yellow-400' : 'text-red-400'}>
                        {stats.fps}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Memory:</span>
                    <span className={stats.memory < 100 ? 'text-green-400' : stats.memory < 200 ? 'text-yellow-400' : 'text-red-400'}>
                        {stats.memory}MB
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Render:</span>
                    <span className={stats.renderTime < 16 ? 'text-green-400' : 'text-yellow-400'}>
                        {stats.renderTime.toFixed(1)}ms
                    </span>
                </div>
            </div>
        </div>
    );
};
