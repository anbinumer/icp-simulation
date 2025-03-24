// src/components/Leaderboard.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export const Leaderboard = ({ 
  gameState, 
  playerName, 
  setPlayerName, 
  onClose, 
  getBadgeAndRank, 
  formatTime 
}) => {
  const [submitName, setSubmitName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Mock leaderboard data
  const mockLeaderboardData = [
    { name: "Dr. Neuro", score: 580, badge: "Brain Trauma Champion", time: 425000 },
    { name: "NurseExpert", score: 540, badge: "Critical Care Expert", time: 512000 },
    { name: "MedStudent22", score: 490, badge: "Neurological First Responder", time: 632000 },
    { name: "ICUNurse2023", score: 450, badge: "Critical Care Expert", time: 587000 },
    { name: "BrainDoc", score: 420, badge: "ICP Management Trainee", time: 724000 }
  ];

  const submitScore = () => {
    if (!submitName.trim()) return;
    setPlayerName(submitName);
    setIsSubmitted(true);
    // In a real implementation, this would submit to a database
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Leaderboard</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        {!isSubmitted && !playerName ? (
          <div className="mb-4">
            <p className="mb-2">Submit your score to the leaderboard:</p>
            <div className="flex space-x-2">
              <input
                type="text"
                value={submitName}
                onChange={(e) => setSubmitName(e.target.value)}
                placeholder="Enter your name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded"
                maxLength={20}
              />
              <Button onClick={submitScore}>Submit</Button>
            </div>
          </div>
        ) : (
          <div className="mb-4 p-2 bg-green-50 text-green-800 rounded">
            Score submitted successfully!
          </div>
        )}
        
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Badge</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockLeaderboardData.map((entry, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium">{entry.name}</td>
                  <td className="px-4 py-3 text-sm font-bold">{entry.score}</td>
                  <td className="px-4 py-3 text-sm">{entry.badge}</td>
                  <td className="px-4 py-3 text-sm">{formatTime(entry.time)}</td>
                </tr>
              ))}
              {(isSubmitted || playerName) && (
                <tr className="bg-blue-50">
                  <td className="px-4 py-3 text-sm">{mockLeaderboardData.length + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {playerName || submitName} <span className="ml-1 text-blue-600">(You)</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold">{gameState.score + gameState.bonusPoints}</td>
                  <td className="px-4 py-3 text-sm">{getBadgeAndRank(gameState.score + gameState.bonusPoints, gameState.totalPossibleScore, gameState.icpStatus).badge}</td>
                  <td className="px-4 py-3 text-sm">{formatTime(gameState.timeTaken)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={onClose}>
            Close Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
};