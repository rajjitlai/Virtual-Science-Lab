export interface PhysicsObject {
    id: string;
    type: 'ball' | 'box' | 'platform';
    color: string;
    size: number;
    mass?: number;
    restitution?: number; // Bounciness
}

export const PHYSICS_OBJECTS: PhysicsObject[] = [
    { id: 'ball-small', type: 'ball', color: '#ff6b6b', size: 20, mass: 1, restitution: 0.8 },
    { id: 'ball-medium', type: 'ball', color: '#4ecdc4', size: 35, mass: 2, restitution: 0.7 },
    { id: 'ball-large', type: 'ball', color: '#45b7d1', size: 50, mass: 3, restitution: 0.6 },
    { id: 'box-small', type: 'box', color: '#f9ca24', size: 30, mass: 1.5, restitution: 0.3 },
    { id: 'box-medium', type: 'box', color: '#f0932b', size: 45, mass: 2.5, restitution: 0.2 },
    { id: 'box-large', type: 'box', color: '#eb4d4b', size: 60, mass: 4, restitution: 0.1 },
];