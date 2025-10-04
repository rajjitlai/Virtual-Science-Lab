import React from 'react';

interface ChemistryLabProps {
  onAskAI: (question: string) => void;
}

const ChemistryLab: React.FC<ChemistryLabProps> = ({ onAskAI }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chemistry Lab</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="font-semibold">Chemicals</h3>
          <ul className="list-disc pl-5 mt-2">
            <li>Hydrogen Peroxide</li>
            <li>Baking Soda</li>
            <li>Vinegar</li>
            <li>Food Coloring</li>
          </ul>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-semibold">Reactions</h3>
          <p className="mt-2">Mix chemicals to see reactions!</p>
          <button 
            className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            onClick={() => onAskAI("What happens when I mix vinegar and baking soda?")}
          >
            Ask AI: Vinegar + Baking Soda
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChemistryLab;