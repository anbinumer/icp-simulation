// components/ScoreDisplay.jsx
import React from 'react';
import { Trophy, Award, Star } from 'lucide-react';

export const ScoreDisplay = ({ score, bonusPoints, currentScenarioIndex, totalScenarios }) => {
  const progressPercentage = (currentScenarioIndex / totalScenarios) * 100;
  
  return (
    <div className="glass p-5 rounded-lg mb-6 border border-blue-800">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
          <h3 className="font-bold text-lg text-blue-300">Score</h3>
        </div>
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          {score + bonusPoints}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="glass p-2 rounded text-center">
          <span className="text-sm text-gray-400">Base</span>
          <div className="font-bold text-white">{score}</div>
        </div>
        
        <div className="glass p-2 rounded text-center">
          <span className="text-sm text-gray-400">Bonus</span>
          <div className="font-bold text-white flex items-center justify-center">
            {bonusPoints} 
            {bonusPoints > 0 && <Star className="h-4 w-4 text-yellow-400 ml-1 animate-pulse" />}
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{currentScenarioIndex + 1}/{totalScenarios}</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500" 
            style={{ 
              width: `${progressPercentage}%`,
              transition: 'width 0.5s ease-in-out'
            }}
          ></div>
        </div>
        
        {/* Scenario markers */}
        <div className="relative h-6 mt-1">
          {Array.from({ length: totalScenarios }).map((_, index) => (
            <div 
              key={index}
              className={`absolute w-2 h-2 rounded-full transform -translate-x-1/2 
                        ${index <= currentScenarioIndex ? 'bg-blue-500' : 'bg-gray-600'}`}
              style={{ left: `${(index / (totalScenarios - 1)) * 100}%` }}
            >
              {index <= currentScenarioIndex && (
                <div className="absolute w-4 h-4 rounded-full bg-blue-500 opacity-50 animate-ping" 
                     style={{ top: '-4px', left: '-4px' }}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};