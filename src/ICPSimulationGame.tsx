// Full game implementation (with logic + UI/UX polish + animation + feedback)
import React, { useState } from 'react';
import { Brain, PhoneCall, Sparkles, Trophy } from 'lucide-react';
import { scenarios } from './data/scenarios';
import GameInterface from './components/GameInterface';
import { GameOverScreen } from './components/GameOverScreen';
import { Leaderboard } from './components/Leaderboard';
import { Achievements } from './components/Achievements';
import { Certificate } from './components/Certificate';
import { SocialShare } from './components/SocialShare';
import { updateVitalsBasedOnOutcome, determineOutcome, getBadgeAndRank, formatTime } from './utils/gameUtils';

interface Scenario {
  id: string;
  title: string;
  description: string;
  question: string;
  options: {
    text: string;
    outcome: "Positive" | "Negative" | "Neutral";
    feedback: string;
  }[];
  doctorAdvice?: string;
}

interface Outcome {
  result: "Poor Outcome" | "Moderate Outcome" | "Excellent Outcome";
  description: string;
}

interface GameState {
  patientName: string;
  age: number;
  occupation: string;
  doctorCallsRemaining: number;
  icpStatus: "normal" | "elevated" | "critical" | "herniation";
  gcsScore: number;
  bp: string;
  heartRate: number;
  respiratoryPattern: string;
  pupilRight: string;
  pupilLeft: string;
  motorResponse: string;
  currentStage: string;
  currentScenarioIndex: number;
  decisions: { scenario: string; decision: { outcome: "Positive" | "Negative" | "Neutral" } }[];
  gameOver: boolean;
  outcome: Outcome | null;
  showDoctorAdvice: boolean;
  doctorAdvice: string;
  showFeedback: boolean;
  lastDecision: number | null;
  score: number;
  totalPossibleScore: number;
  bonusPoints: number;
  timeTaken: number;
  gameStartTime: Date;
  decisionTimes: number[];
  showConfetti: boolean;
  showOutcome: boolean;
}

const ICPSimulationGame = () => {
  const [gameState, setGameState] = useState<GameState>({
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
    decisionTimes: [],
    showConfetti: false,
    showOutcome: false // newly added state
  });

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [playerName, setPlayerName] = useState("");

  const [waitingForNext, setWaitingForNext] = useState(false);

  const makeDecision = (optionIndex: number) => {
    const decisionTime = new Date().getTime() - gameState.gameStartTime.getTime();
    
    const updatedDecisions = [...gameState.decisions, {
      scenario: scenarios[gameState.currentScenarioIndex].id,
      decision: {
        outcome: scenarios[gameState.currentScenarioIndex].options[optionIndex].outcome
      }
    }];
    
    const outcome = determineOutcome(updatedDecisions, gameState.icpStatus);
    const updatedVitals = updateVitalsBasedOnOutcome(gameState, outcome);

    const isCorrect = outcome.result === "Excellent Outcome";
    const updatedScore = isCorrect ? gameState.score + 100 : gameState.score;
    const updatedBonus = isCorrect && decisionTime < 5000 ? gameState.bonusPoints + 50 : gameState.bonusPoints;

    setGameState(prev => ({
      ...prev,
      ...updatedVitals,
      decisions: updatedDecisions,
      decisionTimes: [...prev.decisionTimes, decisionTime],
      lastDecision: optionIndex,
      outcome: outcome,
      score: updatedScore,
      bonusPoints: updatedBonus,
      showFeedback: true,
      showConfetti: isCorrect && decisionTime < 5000,
      showOutcome: true
    }));

    setWaitingForNext(true);
  };

  const callDoctor = () => {
    if (gameState.doctorCallsRemaining > 0) {
      const currentScenario = scenarios[gameState.currentScenarioIndex] as Scenario;
      const advice = currentScenario.doctorAdvice || "Refer to current scenario guidance...";
      setGameState({
        ...gameState,
        doctorCallsRemaining: gameState.doctorCallsRemaining - 1,
        showDoctorAdvice: true,
        doctorAdvice: advice
      });
    }
  };

  const continueToNextScenario = () => {
    const isLastScenario = gameState.currentScenarioIndex === scenarios.length - 1;
    setGameState({
      ...gameState,
      showDoctorAdvice: false,
      doctorAdvice: "",
      showFeedback: false,
      outcome: null,
      currentScenarioIndex: isLastScenario ? gameState.currentScenarioIndex : gameState.currentScenarioIndex + 1,
      gameOver: isLastScenario,
      showConfetti: false,
      showOutcome: false
    });
    setWaitingForNext(false);
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
      decisionTimes: [],
      showConfetti: false,
      showOutcome: false
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

      {gameState.showConfetti && (
        <div className="text-center text-green-500 font-semibold animate-bounce">
          🎉 Bonus Achieved for Fast & Accurate Decision!
        </div>
      )}

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
        <div className="animate-fade-in transition-all duration-500 ease-in-out">
          <div className="flex justify-center mb-4">
            <Trophy className="h-10 w-10 text-yellow-400 animate-bounce" />
          </div>
          <Leaderboard 
            gameState={gameState}
            playerName={playerName}
            setPlayerName={setPlayerName}
            onClose={() => setShowLeaderboard(false)}
            getBadgeAndRank={getBadgeAndRank}
            formatTime={formatTime}
          />
        </div>
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
