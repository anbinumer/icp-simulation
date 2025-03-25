// components/GameOverScreen.jsx
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, RotateCcw, CheckCircle, AlertCircle, Share2, Trophy, Award, Star } from 'lucide-react';
import Confetti from 'react-confetti';

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
  useEffect(() => {
    // Play success or failure sound
    const sound = new Audio(gameState.outcome?.result === "Excellent Outcome" ? 
                           '/sounds/success.mp3' : '/sounds/gameover.mp3');
    sound.volume = 0.3;
    sound.play();
  }, [gameState.outcome]);

  // Calculate total score for visual displays
  const totalScore = gameState.score + gameState.bonusPoints;
  const badgeInfo = getBadgeAndRank(totalScore, gameState.totalPossibleScore, gameState.icpStatus);
  
  return (
    <div className="w-full relative">
      {/* Success confetti for excellent outcomes */}
      {gameState.outcome?.result === "Excellent Outcome" && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
        />
      )}
      
      <Card className="w-full glass border-blue-700 bg-gray-900 bg-opacity-90 animate-fade-in">
        <CardHeader className={
          gameState.outcome?.result === "Excellent Outcome" ? "bg-gradient-to-r from-green-900 to-green-700" :
          gameState.outcome?.result === "Moderate Outcome" ? "bg-gradient-to-r from-yellow-900 to-yellow-700" :
          "bg-gradient-to-r from-red-900 to-red-700"
        }>
          <CardTitle className="text-white text-2xl flex items-center">
            {gameState.outcome?.result === "Excellent Outcome" ? (
              <CheckCircle className="h-7 w-7 text-green-400 mr-3 animate-pulse" />
            ) : gameState.outcome?.result === "Moderate Outcome" ? (
              <AlertCircle className="h-7 w-7 text-yellow-400 mr-3 animate-pulse" />
            ) : (
              <AlertCircle className="h-7 w-7 text-red-400 mr-3 animate-pulse" />
            )}
            {gameState.outcome?.result}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <p className="text-lg mb-4 text-blue-100">{gameState.outcome?.description}</p>
          
          {/* Score Summary Card */}
          <div className="glass p-6 rounded-lg mb-6 border border-blue-700 bg-blue-900 bg-opacity-30">
            <h3 className="text-xl font-bold text-center mb-6 text-blue-300">Final Results</h3>
            
            {/* Badge and rank */}
            <div className="text-center mb-8">
              <div className="inline-block rounded-full glass p-6 mb-4 border border-blue-500 animate-glow">
                {gameState.icpStatus === "herniation" ? (
                  <AlertCircle className="h-16 w-16 text-red-500" />
                ) : totalScore / gameState.totalPossibleScore >= 0.8 ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                ) : (
                  <Brain className="h-16 w-16 text-blue-500" />
                )}
              </div>
              <div className="text-xl font-bold text-blue-200 mb-1">{badgeInfo.badge}</div>
              <div className="text-sm text-gray-400">{badgeInfo.rank}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center glass p-4 rounded-lg shadow-lg border border-blue-700">
                <div className="text-3xl font-bold text-blue-300 mb-1 flex justify-center items-center">
                  {totalScore}
                  <Trophy className="h-6 w-6 text-yellow-400 ml-2" />
                </div>
                <div className="text-xs text-gray-400">TOTAL POINTS</div>
              </div>
              <div className="text-center glass p-4 rounded-lg shadow-lg border border-blue-700">
                <div className="text-3xl font-bold text-blue-300 mb-1">
                  {formatTime(gameState.timeTaken)}
                </div>
                <div className="text-xs text-gray-400">COMPLETION TIME</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-blue-900">
                <span className="text-blue-200">Base Score:</span>
                <span className="font-bold text-white">{gameState.score}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-blue-900">
                <span className="text-blue-200">Bonus Points:</span>
                <span className="font-bold text-white flex items-center">
                  {gameState.bonusPoints}
                  {gameState.bonusPoints > 0 && (
                    <Star className="h-4 w-4 text-yellow-400 ml-2 animate-pulse" />
                  )}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-blue-900">
                <span className="text-blue-200">Doctor Calls Used:</span>
                <span className="font-bold text-white">{3 - gameState.doctorCallsRemaining} of 3</span>
              </div>
              <div className="flex justify-between py-2 border-b border-blue-900">
                <span className="text-blue-200">Patient Final Status:</span>
                <span className={`font-bold ${
                  gameState.icpStatus === "normal" ? "text-green-400" :
                  gameState.icpStatus === "elevated" ? "text-yellow-400" :
                  gameState.icpStatus === "critical" ? "text-orange-400" :
                  "text-red-400"
                }`}>
                  {gameState.icpStatus.charAt(0).toUpperCase() + gameState.icpStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Decision Path */}
          <div className="glass p-4 rounded-lg mb-4 border border-blue-700">
            <h3 className="font-bold mb-4 text-blue-300">Your Decision Path:</h3>
            <div className="space-y-3">
              {gameState.decisions.map((d, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg ${
                    d.decision.outcome === "Positive" ? "bg-green-900 bg-opacity-30 border border-green-800" :
                    d.decision.outcome === "Negative" ? "bg-red-900 bg-opacity-30 border border-red-800" :
                    "bg-yellow-900 bg-opacity-30 border border-yellow-800"
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="font-medium">
                      {scenarios.find(s => s.id === d.scenario)?.title}: {d.decision.text}
                    </div>
                    <div className={
                      d.decision.outcome === "Positive" ? "text-green-400" :
                      d.decision.outcome === "Negative" ? "text-red-400" :
                      "text-yellow-400"
                    }>
                      {d.decision.outcome}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Response time: {formatTime(d.timeToDecide)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Patient journey visualization */}
          <div className="glass p-6 rounded-lg mb-6 border border-blue-700">
            <h3 className="font-bold mb-4 text-blue-300">Patient Journey:</h3>
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 transform -translate-y-1/2 z-0"></div>
              <div className="relative z-10 flex justify-between">
                {['initial', 'monitoring', 'intervention', 'critical', 'resolution'].map((stage, index) => {
                  // Find if there's a decision for this stage
                  const decision = gameState.decisions.find(d => d.scenario === stage);
                  
                  // Determine color based on decision outcome
                  let color = "bg-gray-600"; // default - not reached yet
                  
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
                      <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs border-2 border-gray-800 shadow-lg`}>
                        {index + 1}
                      </div>
                      <span className="text-xs mt-2 text-center text-blue-200 capitalize max-w-16 truncate" title={stage}>
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Button 
              className="w-full glass bg-blue-700 hover:bg-blue-600 text-white transition-colors border border-blue-600"
              onClick={onShowLeaderboard}
            >
              <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
              Leaderboard
            </Button>
            
            <Button 
              variant="outline"
              className="w-full glass text-blue-300 border-blue-700 hover:bg-blue-900 hover:bg-opacity-50"
              onClick={onShowAchievements}
            >
              <Award className="h-5 w-5 mr-2 text-blue-400" />
              Achievements
            </Button>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-blue-300 mb-2">
              Your Name (for Certificate)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="flex-1 px-3 py-2 border border-blue-700 bg-gray-800 rounded text-white"
                maxLength={40}
              />
              <Button 
                onClick={onShowCertificate}
                disabled={!playerName.trim()}
                className="glass bg-blue-700 hover:bg-blue-600 text-white transition-colors border border-blue-600 disabled:opacity-50"
              >
                Get Certificate
              </Button>
            </div>
          </div>
          
          <Button 
            className="w-full glass bg-blue-700 hover:bg-blue-600 mt-4 text-white transition-colors border border-blue-600"
            onClick={onShowShare}
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share Results
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full glass mt-4 text-blue-300 border-blue-700 hover:bg-blue-900 hover:bg-opacity-50"
            onClick={onRestart}
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Restart Simulation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};