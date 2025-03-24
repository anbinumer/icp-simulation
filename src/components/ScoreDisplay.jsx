// src/components/ScoreDisplay.jsx
import React from 'react';

export const ScoreDisplay = ({ score, bonusPoints, currentScenarioIndex, totalScenarios }) => {
  const progressPercentage = (currentScenarioIndex / totalScenarios) * 100;
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-blue-600">Current Score</h3>
        <div className="text-xl font-bold">{score + bonusPoints}</div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Base Score:</span>
        <span>{score}</span>
      </div>
      
      <div className="flex justify-between text-sm text-gray-600 mb-3">
        <span>Bonus Points:</span>
        <span>{bonusPoints}</span>
      </div>
      
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500" 
          style={{ 
            width: `${progressPercentage}%`,
            transition: 'width 0.5s ease-in-out'
          }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Scenario {currentScenarioIndex + 1}</span>
        <span>of {totalScenarios}</span>
      </div>
    </div>
  );
};