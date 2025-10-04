import React from 'react';

interface PhysicsLabProps {
  onAskAI: (question: string) => void;
}

const PhysicsLab: React.FC<PhysicsLabProps> = ({ onAskAI }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Physics Lab</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="font-semibold">Objects</h3>
          <ul className="list-disc pl-5 mt-2">
            <li>Ball</li>
            <li>Block</li>
            <li>Ramp</li>
            <li>Spring</li>
          </ul>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="font-semibold">Experiments</h3>
          <p className="mt-2">Drop objects to see physics in action!</p>
          <button 
            className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            onClick={() => onAskAI("What is the acceleration due to gravity?")}
          >
            Ask AI: Gravity
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhysicsLab;