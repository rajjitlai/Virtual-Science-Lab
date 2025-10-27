import { Fire } from './Fire';

interface FireBeakerProps {
    position: [number, number, number];
    intensity: number;
    chemicalName?: string;
}

export const FireBeaker = ({ position, intensity, chemicalName }: FireBeakerProps) => {
    return (
        <Fire 
            intensity={intensity} 
            position={position} 
            chemicalName={chemicalName}
        />
    );
};
