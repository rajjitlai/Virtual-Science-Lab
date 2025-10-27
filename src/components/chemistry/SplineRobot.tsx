import { Suspense, useRef, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { DynamicText } from '../common/DynamicText';
import type { RobotAction } from '../../types/chemistry';

interface SplineRobotProps {
    position?: [number, number, number];
    isActive?: boolean;
    action?: RobotAction;
    aiResponse?: string;
    className?: string;
}

export const SplineRobot = ({
    isActive = true,
    action = 'idle',
    aiResponse,
    className = ""
}: SplineRobotProps) => {
    const splineRef = useRef<any>(null);

    useEffect(() => {
        if (splineRef.current) {
            // You can add Spline-specific animations here based on the action
            // For example, triggering animations on the Spline object
            console.log('Robot action:', action);
        }
    }, [action]);

    if (!isActive) return null;

    return (
        <div className={`spline-robot-container ${className}`}>
            {/* Spline 3D Robot */}
            <div className="w-full h-96 relative">
                <Suspense fallback={
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-300">Loading Robot...</p>
                        </div>
                    </div>
                }>
                    <Spline
                        scene="https://prod.spline.design/8af-L82PrOdnbI7m/scene.splinecode"
                        onLoad={(splineApp) => {
                            splineRef.current = splineApp;
                            console.log('Spline robot loaded successfully');
                        }}
                        onError={(error) => {
                            console.error('Spline robot loading error:', error);
                        }}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '0.5rem'
                        }}
                    />
                </Suspense>
            </div>

            {/* Dynamic Text Display */}
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <DynamicText
                    aiResponse={aiResponse}
                    showRandomWords={!aiResponse}
                    randomWordsInterval={3000}
                    className="text-center"
                />
            </div>

            {/* Action Indicator */}
            <div className="mt-2 text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${action === 'idle' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                        action === 'pouring' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            action === 'observing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                action === 'reacting' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                    action === 'celebrating' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                        action === 'running' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                            action === 'walking' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
                                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                    <span className="mr-2">
                        {action === 'idle' ? '😴' :
                            action === 'pouring' ? '🥤' :
                                action === 'observing' ? '👀' :
                                    action === 'reacting' ? '⚡' :
                                        action === 'celebrating' ? '🎉' :
                                            action === 'running' ? '🏃' :
                                                action === 'walking' ? '🚶' : '🤖'}
                    </span>
                    <span className="capitalize">{action}</span>
                </div>
            </div>
        </div>
    );
};
