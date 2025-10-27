import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Chemical } from '../types/chemistry';

interface SimulatorContextType {
    triggerChemicalReaction: (chemicals: Chemical[]) => void;
    pendingChemicals: Chemical[];
    clearPendingChemicals: () => void;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export const SimulatorProvider = ({ children }: { children: ReactNode }) => {
    const [pendingChemicals, setPendingChemicals] = useState<Chemical[]>([]);

    const triggerChemicalReaction = (chemicals: Chemical[]) => {
        setPendingChemicals(chemicals);
    };

    const clearPendingChemicals = () => {
        setPendingChemicals([]);
    };

    return (
        <SimulatorContext.Provider value={{ triggerChemicalReaction, pendingChemicals, clearPendingChemicals }}>
            {children}
        </SimulatorContext.Provider>
    );
};

export const useSimulator = () => {
    const context = useContext(SimulatorContext);
    if (!context) {
        throw new Error('useSimulator must be used within SimulatorProvider');
    }
    return context;
};
