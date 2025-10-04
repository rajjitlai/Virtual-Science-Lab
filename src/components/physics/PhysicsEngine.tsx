import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { PHYSICS_OBJECTS, PhysicsObject } from '../../types/physics';

interface PhysicsEngineProps {
    gravity: number;
    onStatsUpdate: (stats: { objects: number; kinetic: number }) => void;
}

export const PhysicsEngine = ({ gravity, onStatsUpdate }: PhysicsEngineProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const renderRef = useRef<Matter.Render | null>(null);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Create engine
        const engine = Matter.Engine.create();
        engineRef.current = engine;
        engine.gravity.y = gravity;

        // Create renderer
        const render = Matter.Render.create({
            canvas: canvasRef.current,
            engine: engine,
            options: {
                width: 800,
                height: 600,
                wireframes: false,
                background: '#1a1a2e',
            },
        });
        renderRef.current = render;

        // Create ground
        const ground = Matter.Bodies.rectangle(400, 590, 810, 20, {
            isStatic: true,
            render: { fillStyle: '#e8e8e8' },
        });

        // Create walls
        const leftWall = Matter.Bodies.rectangle(0, 300, 20, 600, {
            isStatic: true,
            render: { fillStyle: '#e8e8e8' },
        });

        const rightWall = Matter.Bodies.rectangle(800, 300, 20, 600, {
            isStatic: true,
            render: { fillStyle: '#e8e8e8' },
        });

        // Create ceiling
        const ceiling = Matter.Bodies.rectangle(400, 0, 810, 20, {
            isStatic: true,
            render: { fillStyle: '#e8e8e8' },
        });

        // Add static platforms
        const platform1 = Matter.Bodies.rectangle(200, 400, 150, 15, {
            isStatic: true,
            render: { fillStyle: '#6c5ce7' },
        });

        const platform2 = Matter.Bodies.rectangle(600, 300, 150, 15, {
            isStatic: true,
            render: { fillStyle: '#6c5ce7' },
        });

        // Add all bodies to the world
        Matter.Composite.add(engine.world, [ground, leftWall, rightWall, ceiling, platform1, platform2]);

        // Run the engine and renderer
        Matter.Render.run(render);
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);

        // Update stats
        const updateStats = () => {
            const bodies = Matter.Composite.allBodies(engine.world).filter(b => !b.isStatic);
            const kineticEnergy = bodies.reduce((sum, body) => {
                const velocity = Matter.Body.getVelocity(body);
                const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
                return sum + 0.5 * body.mass * speed * speed;
            }, 0);

            onStatsUpdate({
                objects: bodies.length,
                kinetic: Math.round(kineticEnergy * 100) / 100,
            });
        };

        const statsInterval = setInterval(updateStats, 100);

        // Cleanup
        return () => {
            clearInterval(statsInterval);
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
            Matter.World.clear(engine.world, false);
            Matter.Engine.clear(engine);
            render.canvas.remove();
        };
    }, [gravity, onStatsUpdate]);

    // Update gravity when it changes
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.gravity.y = gravity;
        }
    }, [gravity]);

    const addObject = (obj: PhysicsObject) => {
        if (!engineRef.current) return;

        const x = 400 + (Math.random() - 0.5) * 200;
        const y = 100;

        let body;
        if (obj.type === 'ball') {
            body = Matter.Bodies.circle(x, y, obj.size / 2, {
                restitution: obj.restitution || 0.7,
                friction: 0.05,
                mass: obj.mass || 1,
                render: { fillStyle: obj.color },
            });
        } else {
            body = Matter.Bodies.rectangle(x, y, obj.size, obj.size, {
                restitution: obj.restitution || 0.3,
                friction: 0.1,
                mass: obj.mass || 1,
                render: { fillStyle: obj.color },
            });
        }

        Matter.Composite.add(engineRef.current.world, body);
    };

    const clearObjects = () => {
        if (!engineRef.current) return;
        const bodies = Matter.Composite.allBodies(engineRef.current.world).filter(b => !b.isStatic);
        Matter.Composite.remove(engineRef.current.world, bodies);
    };

    const togglePause = () => {
        if (!engineRef.current) return;
        engineRef.current.timing.timeScale = isRunning ? 0 : 1;
        setIsRunning(!isRunning);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-4 justify-center">
                <button
                    onClick={togglePause}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
                >
                    {isRunning ? '⏸️ Pause' : '▶️ Play'}
                </button>
                <button
                    onClick={clearObjects}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold"
                >
                    🗑️ Clear All
                </button>
            </div>

            <div className="flex justify-center">
                <canvas
                    ref={canvasRef}
                    className="border-4 border-gray-300 dark:border-gray-700 rounded-lg shadow-2xl"
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {PHYSICS_OBJECTS.map((obj) => (
                    <button
                        key={obj.id}
                        onClick={() => addObject(obj)}
                        className="p-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 hover:shadow-lg transition-all"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div
                                className={`${obj.type === 'ball' ? 'rounded-full' : 'rounded-md'}`}
                                style={{
                                    width: `${obj.size / 2}px`,
                                    height: `${obj.size / 2}px`,
                                    backgroundColor: obj.color,
                                }}
                            />
                            <div className="text-center">
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    {obj.type === 'ball' ? '⚽' : '📦'} {obj.type}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Mass: {obj.mass}
                                </p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};