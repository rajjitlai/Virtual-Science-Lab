export interface Chemical {
    id: string;
    name: string;
    formula: string;
    color: string;
    state: 'solid' | 'liquid' | 'gas';
    pH?: number;
    flammable?: boolean;
    flammabilityLevel?: number; // 0-10 scale, higher = more intense fire
}

export interface ReactionProduct {
    name: string;
    formula: string;
}

export interface Reaction {
    reactants: string[];
    products: string[];
    product: ReactionProduct;
    description: string;
    visualization: 'bubbles' | 'color-change' | 'heat' | 'precipitate';
}

export interface Mixture {
    id: string;
    name: string;
    chemicals: Chemical[];
    createdAt: Date;
    color: string;
}

export type RobotAction = 'idle' | 'pouring' | 'observing' | 'reacting' | 'celebrating' | 'running' | 'walking';

// Appwrite document type (for reference)
// Note: $id and $createdAt are automatically provided by Appwrite and should not be manually set
export interface AppwriteMixtureDocument {
    $id: string;
    $createdAt: string; // Automatically set by Appwrite
    userId: string;
    name: string;
    chemicals: string; // JSON stringified array
    color: string;
}

export const CHEMICALS: Chemical[] = [
    { id: 'water', name: 'Water', formula: 'H₂O', color: '#00aaff', state: 'liquid', pH: 7 },
    { id: 'vinegar', name: 'Vinegar', formula: 'CH₃COOH', color: '#ffeeaa', state: 'liquid', pH: 3 },
    { id: 'baking-soda', name: 'Baking Soda', formula: 'NaHCO₃', color: '#ffffff', state: 'solid', pH: 9 },
    { id: 'salt', name: 'Table Salt', formula: 'NaCl', color: '#eeeeee', state: 'solid', pH: 7 },
    { id: 'sugar', name: 'Sugar', formula: 'C₁₂H₂₂O₁₁', color: '#fff5e6', state: 'solid', pH: 7 },
    { id: 'lemon-juice', name: 'Lemon Juice', formula: 'C₆H₈O₇', color: '#ffff99', state: 'liquid', pH: 2 },
    { id: 'ethanol', name: 'Ethanol', formula: 'C₂H₅OH', color: '#e6f3ff', state: 'liquid', pH: 7, flammable: true, flammabilityLevel: 8 },
    { id: 'methane', name: 'Methane', formula: 'CH₄', color: '#f0f0f0', state: 'gas', pH: 7, flammable: true, flammabilityLevel: 10 },
];

export const REACTIONS: Reaction[] = [
    {
        reactants: ['vinegar', 'baking-soda'],
        products: ['CO₂', 'H₂O', 'CH₃COONa'],
        product: { name: 'Sodium Acetate, Water, and Carbon Dioxide', formula: 'CH₃COONa + H₂O + CO₂' },
        description: 'Vinegar + Baking Soda → Fizzing reaction! Carbon dioxide gas is produced.',
        visualization: 'bubbles'
    },
    {
        reactants: ['water', 'salt'],
        products: ['NaCl solution'],
        product: { name: 'Sodium Chloride Solution', formula: 'NaCl(aq)' },
        description: 'Salt dissolves in water, creating a saline solution.',
        visualization: 'color-change'
    },
    {
        reactants: ['water', 'sugar'],
        products: ['Sugar solution'],
        product: { name: 'Sugar Solution', formula: 'C₁₂H₂₂O₁₁(aq)' },
        description: 'Sugar dissolves in water, creating a sweet solution.',
        visualization: 'color-change'
    },
];
