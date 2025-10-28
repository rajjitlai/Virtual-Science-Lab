import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Chemical } from '../types/chemistry';

interface DemoContextType {
    isDemoRunning: boolean;
    currentDemo: any | null;
    startChemistryDemo: (scenario: any) => void;
    stopDemo: () => void;
    getDemoChemicals: () => Chemical[];
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const useDemo = () => {
    const context = useContext(DemoContext);
    if (!context) {
        throw new Error('useDemo must be used within a DemoProvider');
    }
    return context;
};

interface DemoProviderProps {
    children: ReactNode;
}

export const DemoProvider = ({ children }: DemoProviderProps) => {
    const [isDemoRunning, setIsDemoRunning] = useState(false);
    const [currentDemo, setCurrentDemo] = useState<any | null>(null);

    const startChemistryDemo = (scenario: any) => {
        setIsDemoRunning(true);
        setCurrentDemo(scenario);
    };

    const stopDemo = () => {
        setIsDemoRunning(false);
        setCurrentDemo(null);
    };

    const getDemoChemicals = (): Chemical[] => {
        if (!currentDemo || !currentDemo.chemicals) return [];

        // Map demo chemical names to actual Chemical objects
        const chemicalMap: { [key: string]: string } = {
            'Water': 'water',
            'Vinegar': 'vinegar',
            'Baking Soda': 'baking-soda',
            'Table Salt': 'salt',
            'Sugar': 'sugar',
            'Lemon Juice': 'lemon-juice',
            'Ethanol': 'ethanol',
            'Methane': 'methane'
        };

        return currentDemo.chemicals
            .map((name: string) => chemicalMap[name])
            .filter(Boolean)
            .map((id: string) => {
                // Import CHEMICALS here to avoid circular dependency
                const CHEMICALS = [
                    { id: 'water', name: 'Water', formula: 'H₂O', color: '#00aaff', state: 'liquid', pH: 7 },
                    { id: 'vinegar', name: 'Vinegar', formula: 'CH₃COOH', color: '#ffeeaa', state: 'liquid', pH: 3 },
                    { id: 'baking-soda', name: 'Baking Soda', formula: 'NaHCO₃', color: '#ffffff', state: 'solid', pH: 9 },
                    { id: 'salt', name: 'Table Salt', formula: 'NaCl', color: '#eeeeee', state: 'solid', pH: 7 },
                    { id: 'sugar', name: 'Sugar', formula: 'C₁₂H₂₂O₁₁', color: '#fff5e6', state: 'solid', pH: 7 },
                    { id: 'lemon-juice', name: 'Lemon Juice', formula: 'C₆H₈O₇', color: '#ffff99', state: 'liquid', pH: 2 },
                    { id: 'ethanol', name: 'Ethanol', formula: 'C₂H₅OH', color: '#e6f3ff', state: 'liquid', pH: 7, flammable: true, flammabilityLevel: 8 },
                    { id: 'methane', name: 'Methane', formula: 'CH₄', color: '#f0f0f0', state: 'gas', pH: 7, flammable: true, flammabilityLevel: 10 },
                ];
                return CHEMICALS.find(chem => chem.id === id);
            })
            .filter(Boolean) as Chemical[];
    };

    return (
        <DemoContext.Provider value={{
            isDemoRunning,
            currentDemo,
            startChemistryDemo,
            stopDemo,
            getDemoChemicals
        }}>
            {children}
        </DemoContext.Provider>
    );
};
