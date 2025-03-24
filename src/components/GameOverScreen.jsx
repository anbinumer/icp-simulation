// src/components/GameOverScreen.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, RotateCcw, CheckCircle, AlertCircle, Share2 } from 'lucide-react';
import { scenarios } from '../data/scenarios';

export const GameOverScreen = ({ 
  gameState, 
  playerName, 
  setPlayerName, 
  onRestart, 
  onShowLeaderboard, 
  onShowAchievements, 
  onShowCertificate, 
  onShowShare, 
  getBadgeAndRank, 
  formatTime 
}) => {
  return (
    <Card className="w-full">
      <CardHeader className={
        gameState.outcome?.result === "Excellent Outcome" ? "bg-green-50" :
        gameState.outcome?.result === "Moderate Outcome" ? "bg-yellow-50" :
        "bg-red-50"
      }>
        <CardTitle className={
          gameState.outcome?.result === "Excellent Outcome" ? "text-green-800" :
          gameState.outcome?.result === "Moderate Outcome" ? "text-yellow-800" :
          "text-red-800"
        }>
          {gameState.outcome?.result}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="mb-4">{gameState.outcome?.description}</p>
        
        {/* Score Summary Card */}
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-bold text-center mb-4">Final Score</h3>
          
          {/* Display badge and rank */}
          <div className="text-center mb-6">
            <div className="inline-block rounded-full bg-blue-100 p-4 mb-2">
              {gameState.icpStatus === "herniation" ? (
                <AlertCircle className="h-12 w-12 text-red-500" />
              ) : (gameState.score + gameState.bonusPoints) / gameState.totalPossibleScore >= 0.8 ? (
                <CheckCircle className="h-12 w-12 text-green-500" />
              ) : (
                <Brain className="h-12 w-12 text-blue-500" />
              )}
            </div>
            <div className="text-lg font-bold">{getBadgeAndRank(gameState.score + gameState.bonusPoints, gameState.totalPossibleScore, gameState.icpStatus).badge}</div>
            <div className="text-sm text-gray-600">{getBadgeAndRank(gameState.score + gameState.bonusPoints, gameState.totalPossibleScore, gameState.icpStatus).rank}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600">
                {gameState.score + gameState.bonusPoints}
              </div>
              <div className="text-xs text-gray-500">TOTAL POINTS</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600">
                {formatTime(gameState.timeTaken)}
              </div>
              <div className="text-xs text-gray-500">COMPLETION TIME</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-blue-100">
              <span>Base Score:</span>
              <span className="font-bold">{gameState.score}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-blue-100">
              <span>Bonus Points:</span>
              <span className="font-bold">{gameState.bonusPoints}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-blue-100">
              <span>Doctor Calls Used:</span>
              <span className="font-bold">{3 - gameState.doctorCallsRemaining} of 3</span>
            </div>
            <div className="flex justify-between py-2 border-b border-blue-100">
              <span>Patient Final Status:</span>
              <span className={`font-bold ${
                gameState.icpStatus === "normal" ? "text-green-600" :
                gameState.icpStatus === "elevated" ? "text-yellow-600" :
                gameState.icpStatus === "critical" ? "text-orange-600" :
                "text-red-600"
              }`}>
                {gameState.icpStatus.charAt(0).toUpperCase() + gameState.icpStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="font-bold mb-2">Your Decision Path:</h3>
          <ul className="space-y-2 list-disc pl-5">
            {gameState.decisions.map((d, index) => (
              <li key={index} className="text-sm">
                {scenarios.find(s => s.id === d.scenario).title}: {d.decision.text}
                <span className={
                  d.decision.outcome === "Positive" ? " text-green-600 ml-2" :
                  d.decision.outcome === "Negative" ? " text-red-600 ml-2" :
                  " text-yellow-600 ml-2"
                }>
                  ({d.decision.outcome})
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {formatTime(d.timeToDecide)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Patient journey visualization */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-bold mb-3">Patient Journey:</h3>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 transform -translate-y-1/2 z-0"></div>
            <div className="relative z-10 flex justify-between">
              {['initial', 'monitoring', 'intervention', 'critical', 'resolution'].map((stage, index) => {
                // Find if there's a decision for this stage
                const decision = gameState.decisions.find(d => d.scenario === stage);
                
                // Determine color based on decision outcome
                let color = "bg-gray-300"; // default - not reached yet
                
                if (decision) {
                  color = decision.decision.outcome === "Positive" ? "bg-green-500" :
                          decision.decision.outcome === "Negative" ? "bg-red-500" :
                          "bg-yellow-500";
                } else if (gameState.currentScenarioIndex === index && !gameState.gameOver) {
                  // Current stage
                  color = "bg-blue-500";
                }
                
                return (
                  <div key={stage} className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full ${color} flex items-center justify-center text-white text-xs`}>
                      {index + 1}
                    </div>
                    <span className="text-xs mt-1 text-center capitalize max-w-16 truncate" title={stage}>
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="space-y-3 mt-6">
          <Button 
            className="w-full"
            onClick={onShowLeaderboard}
          >
            View Leaderboard
          </Button>
          
          <Button 
            variant="outline"
            className="w-full"
            onClick={onShowAchievements}
          >
            View Achievements
          </Button>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name (for Certificate)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded"
                maxLength={40}
              />
              <Button 
                onClick={onShowCertificate}
                disabled={!playerName.trim()}
              >
                Get Certificate
              </Button>
            </div>
          </div>
          
          <Button 
            className="w-full"
            onClick={onShowShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onRestart}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart Simulation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};