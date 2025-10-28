import React from 'react';

interface ChemicalFormulaProps {
    formula: string;
    className?: string;
}

export const ChemicalFormula: React.FC<ChemicalFormulaProps> = ({ formula, className = '' }) => {
    // Convert subscript numbers to proper HTML subscripts
    const formatFormula = (formula: string) => {
        // Handle Unicode subscripts first (convert to HTML)
        let formatted = formula
            .replace(/₂/g, '<sub>2</sub>')
            .replace(/₃/g, '<sub>3</sub>')
            .replace(/₄/g, '<sub>4</sub>')
            .replace(/₅/g, '<sub>5</sub>')
            .replace(/₆/g, '<sub>6</sub>')
            .replace(/₇/g, '<sub>7</sub>')
            .replace(/₈/g, '<sub>8</sub>')
            .replace(/₉/g, '<sub>9</sub>')
            .replace(/₀/g, '<sub>0</sub>')
            .replace(/₁/g, '<sub>1</sub>');
        
        // Handle regular numbers - be more specific to avoid conflicts
        // Only convert numbers that are not already in <sub> tags
        formatted = formatted
            .replace(/([A-Z][a-z]?)(\d+)/g, '$1<sub>$2</sub>')
            .replace(/(?<!<sub>)(\d+)(?!<\/sub>)/g, '<sub>$1</sub>');
        
        return formatted;
    };

    return (
        <span 
            className={`${className} chemical-formula`}
            dangerouslySetInnerHTML={{ __html: formatFormula(formula) }}
            style={{ 
                fontFamily: 'Times New Roman, serif',
                fontSize: 'inherit',
                lineHeight: '1.2',
                fontWeight: 'normal'
            }}
        />
    );
};