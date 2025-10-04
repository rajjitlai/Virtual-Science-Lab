export interface Chemical {
    id: string;
    name: string;
    formula: string;
    color: string;
    state: 'solid' | 'liquid' | 'gas';
    pH?: number;
}

export interface Reaction {
    reactants: string[];
    products: string[];
    description: string;
    visualization: 'bubbles' | 'color-change' | 'heat' | 'precipitate';
}

export const CHEMICALS: Chemical[] = [
    { id: 'water', name: 'Water', formula: 'H₂O', color: '#00aaff', state: 'liquid', pH: 7 },
    { id: 'vinegar', name: 'Vinegar', formula: 'CH₃COOH', color: '#ffeeaa', state: 'liquid', pH: 3 },
    { id: 'baking-soda', name: 'Baking Soda', formula: 'NaHCO₃', color: '#ffffff', state: 'solid', pH: 9 },
    { id: 'salt', name: 'Table Salt', formula: 'NaCl', color: '#eeeeee', state: 'solid', pH: 7 },
    { id: 'sugar', name: 'Sugar', formula: 'C₁₂H₂₂O₁₁', color: '#fff5e6', state: 'solid', pH: 7 },
    { id: 'lemon-juice', name: 'Lemon Juice', formula: 'C₆H₈O₇', color: '#ffff99', state: 'liquid', pH: 2 },
];

export const REACTIONS: Reaction[] = [
    {
        reactants: ['vinegar', 'baking-soda'],
        products: ['CO₂', 'H₂O', 'CH₃COONa'],
        description: 'Vinegar + Baking Soda → Fizzing reaction! Carbon dioxide gas is produced.',
        visualization: 'bubbles'
    },
    {
        reactants: ['water', 'salt'],
        products: ['NaCl solution'],
        description: 'Salt dissolves in water, creating a saline solution.',
        visualization: 'color-change'
    },
    {
        reactants: ['water', 'sugar'],
        products: ['Sugar solution'],
        description: 'Sugar dissolves in water, creating a sweet solution.',
        visualization: 'color-change'
    },
];