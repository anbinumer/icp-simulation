// src/components/Achievements.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Heart, PhoneCall, AlertCircle, CheckCircle } from 'lucide-react';

export const Achievements = ({ gameState, onClose }) => {
  // Define achievements
  const achievements = [
    {
      id: "perfect_score",
      title: "Perfect Decision Maker",
      description: "Make all positive decisions throughout the scenario",
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      unlocked: gameState.decisions.filter(d => d.decision.outcome === "Positive").length === 5
    },
    {
      id: "speed_demon",
      title: "Rapid Response",
      description: "Complete the simulation in under 3 minutes",
      icon: <AlertCircle className="h-6 w-6 text-blue-500" />,
      unlocked: gameState.timeTaken < 180000 // 3 minutes in milliseconds
    },
    {
      id: "independent",
      title: "Independent Practitioner",
      description: "Complete the scenario without calling the doctor",
      icon: <PhoneCall className="h-6 w-6 text-purple-500" />,
      unlocked: gameState.doctorCallsRemaining === 3
    },
    {
      id: "excellent_outcome",
      title: "Optimal Care Provider",
      description: "Achieve an excellent patient outcome",
      icon: <Brain className="h-6 w-6 text-green-500" />,
      unlocked: gameState.outcome?.result === "Excellent Outcome"
    },
    {
      id: "comeback_kid",
      title: "Clinical Recovery",
      description: "Bring patient back from critical status to elevated",
      icon: <Heart className="h-6 w-6 text-red-500" />,
      unlocked: gameState.decisions.some((d, i, arr) => 
        i > 0 && 
        arr[i-1].patientStatus === "critical" && 
        d.patientStatus === "elevated"
      )
    }
  ];
  
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Achievements</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        {unlockedAchievements.length > 0 ? (
          <div className="space-y-4">
            {unlockedAchievements.map((achievement) => (
              <div 
                key={achievement.id}
                className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100"
              >
                <div className="mr-3">
                  {achievement.icon}
                </div>
                <div>
                  <h3 className="font-bold">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p>No achievements unlocked yet!</p>
            <p className="text-sm text-gray-500 mt-2">
              Keep playing to earn achievements and improve your skills.
            </p>
          </div>
        )}
        
        <div className="mt-6 flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onClose}
          >
            Close
          </Button>
          <Button 
            className="flex-1"
            onClick={() => {
              const shareText = `I unlocked ${unlockedAchievements.length} achievements in the ICP Management Simulation! #SkilldémyChallenge`;
              alert(`Share Text: ${shareText}`);
              onClose();
            }}
          >
            Share Achievements
          </Button>
        </div>
      </div>
    </div>
  );
};