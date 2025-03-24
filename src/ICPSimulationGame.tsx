// Full game implementation (with logic + UI/UX polish)
import React, { useState } from 'react';
import { Brain, PhoneCall } from 'lucide-react';
import { scenarios } from './data/scenarios';
import { PatientStatusMonitor } from './components/PatientStatusMonitor';
import { ScoreDisplay } from './components/ScoreDisplay';
import { GameInterface } from './components/GameInterface';
import { GameOverScreen } from './components/GameOverScreen';
import { Leaderboard } from './components/Leaderboard';
import { Achievements } from './components/Achievements';
import { Certificate } from './components/Certificate';
import { SocialShare } from './components/SocialShare';
import { updateVitalsBasedOnOutcome, determineOutcome, getBadgeAndRank, formatTime } from './utils/gameUtils';

const ICPSimulationGame = () => {
  const [gameState, setGameState] = useState({
    patientName: "Sarah Chen",
    age: 28,
    occupation: "Software Engineer",
    doctorCallsRemaining: 3,
    icpStatus: "elevated",
    gcsScore: 13,
    bp: "142/88",
    heartRate: 72,
    respiratoryPattern: "normal",
    pupilRight: "slightly enlarged",
    pupilLeft: "normal",
    motorResponse: "intact",
    currentStage: "initial",
    currentScenarioIndex: 0,
    decisions: [],
    gameOver: false,
    outcome: null,
    showDoctorAdvice: false,
    doctorAdvice: "",
    showFeedback: false,
    lastDecision: null,
    score: 0,
    totalPossibleScore: scenarios.length * 100,
    bonusPoints: 0,
    timeTaken: 0,
    gameStartTime: new Date(),
    decisionTimes: [] as number[]
  });

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [playerName, setPlayerName] = useState("");

  const makeDecision = (optionIndex: number) => {
    const decisionTime = new Date().getTime() - gameState.gameStartTime.getTime();
    const outcome = determineOutcome(gameState.currentScenarioIndex, optionIndex);
    const updatedVitals = updateVitalsBasedOnOutcome(gameState, outcome);

    const isCorrect = outcome.result === "correct";
    const updatedScore = isCorrect ? gameState.score + 100 : gameState.score;
    const updatedBonus = isCorrect && decisionTime < 5000 ? gameState.bonusPoints + 50 : gameState.bonusPoints;

    const isLastScenario = gameState.currentScenarioIndex === scenarios.length - 1;

    setGameState({
      ...gameState,
      ...updatedVitals,
      currentScenarioIndex: isLastScenario ? gameState.currentScenarioIndex : gameState.currentScenarioIndex + 1,
      decisions: [...gameState.decisions, optionIndex],
      decisionTimes: [...gameState.decisionTimes, decisionTime],
      lastDecision: optionIndex,
      score: updatedScore,
      bonusPoints: updatedBonus,
      gameOver: isLastScenario,
      outcome: isLastScenario ? outcome : null
    });
  };

  const callDoctor = () => {
    if (gameState.doctorCallsRemaining > 0) {
      setGameState({
        ...gameState,
        doctorCallsRemaining: gameState.doctorCallsRemaining - 1,
        showDoctorAdvice: true,
        doctorAdvice: "Refer to current scenario guidance..." // fallback text
      });
    }
  };

  const continueToNextScenario = () => {
    setGameState({
      ...gameState,
      showDoctorAdvice: false,
      doctorAdvice: ""
    });
  };

  const restartGame = () => {
    setGameState({
      ...gameState,
      currentScenarioIndex: 0,
      decisions: [],
      gameOver: false,
      outcome: null,
      showDoctorAdvice: false,
      doctorAdvice: "",
      showFeedback: false,
      lastDecision: null,
      score: 0,
      bonusPoints: 0,
      timeTaken: 0,
      gameStartTime: new Date(),
      decisionTimes: []
    });
    setShowLeaderboard(false);
    setShowAchievements(false);
    setShowCertificate(false);
    setShowShareModal(false);
  };

  const currentScenario = scenarios[gameState.currentScenarioIndex];

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center space-x-2">
        <Brain className="h-8 w-8 text-blue-600 animate-pulse" />
        <h1 className="text-2xl font-bold text-blue-600">ICP Management Simulation: Sarah Chen's Case</h1>
      </div>

      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center space-x-2">
          <PhoneCall className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium">Doctor Calls Remaining: {gameState.doctorCallsRemaining}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium mr-2">Patient Status:</span>
          <span className={`inline-block w-3 h-3 rounded-full transition ${
            gameState.icpStatus === "normal" ? "bg-green-500" :
            gameState.icpStatus === "elevated" ? "bg-yellow-500" :
            gameState.icpStatus === "critical" ? "bg-red-500" :
            "bg-red-800"
          }`}></span>
          <span className="text-sm font-medium capitalize">{gameState.icpStatus}</span>
        </div>
      </div>

      {gameState.gameOver ? (
        <GameOverScreen 
          gameState={gameState}
          playerName={playerName}
          setPlayerName={setPlayerName}
          onRestart={restartGame}
          onShowLeaderboard={() => setShowLeaderboard(true)}
          onShowAchievements={() => setShowAchievements(true)}
          onShowCertificate={() => setShowCertificate(true)}
          onShowShare={() => setShowShareModal(true)}
          getBadgeAndRank={getBadgeAndRank}
          formatTime={formatTime}
        />
      ) : (
        <GameInterface 
          gameState={gameState}
          currentScenario={currentScenario}
          scenariosCount={scenarios.length}
          onMakeDecision={makeDecision}
          onCallDoctor={callDoctor}
          onContinue={continueToNextScenario}
        />
      )}

      <div className="text-center text-sm text-gray-500 mt-6 border-t pt-4">
        <p>This simulation contributes to your Continuing Professional Development in Neuroscience Nursing.</p>
      </div>

      {showLeaderboard && (
        <Leaderboard 
          gameState={gameState}
          playerName={playerName}
          setPlayerName={setPlayerName}
          onClose={() => setShowLeaderboard(false)}
          getBadgeAndRank={getBadgeAndRank}
          formatTime={formatTime}
        />
      )}

      {showAchievements && (
        <Achievements
          gameState={gameState}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {showCertificate && (
        <Certificate
          playerName={playerName}
          gameState={gameState}
          onClose={() => setShowCertificate(false)}
          getBadgeAndRank={getBadgeAndRank}
        />
      )}

      {showShareModal && (
        <SocialShare
          gameState={gameState}
          onClose={() => setShowShareModal(false)}
          getBadgeAndRank={getBadgeAndRank}
        />
      )}
    </div>
  );
};

export default ICPSimulationGame;
