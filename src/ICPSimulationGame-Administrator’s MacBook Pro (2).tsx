// src/ICPSimulationGame.tsx
import React, { useState, useEffect } from 'react';
import { Brain, PhoneCall, Sparkles } from 'lucide-react';
import { scenarios } from './data/scenarios';
import { GameInterface } from './components/GameInterface';
import { GameOverScreen } from './components/GameOverScreen';
import { Leaderboard } from './components/Leaderboard';
import { Achievements } from './components/Achievements';
import { Certificate } from './components/Certificate';
import { SocialShare } from './components/SocialShare';
import { updateVitalsBasedOnOutcome, determineOutcome, getBadgeAndRank, formatTime } from './utils/gameUtils';

// Define ICPStatus type to ensure consistency
type ICPStatus = "normal" | "elevated" | "critical" | "herniation";

const ICPSimulationGame = () => {
  // State for the game
  const [gameState, setGameState] = useState({
    patientName: "Sarah Chen",
    age: 28,
    occupation: "Software Engineer",
    doctorCallsRemaining: 3,
    icpStatus: "elevated" as ICPStatus, // Using the defined type
    gcsScore: 13, // Glasgow Coma Scale (3-15)
    bp: "142/88",
    heartRate: 72,
    respiratoryPattern: "normal",
    pupilRight: "slightly enlarged",
    pupilLeft: "normal",
    motorResponse: "intact",
    currentStage: "initial", // initial, deterioration, critical, resolution
    currentScenarioIndex: 0,
    decisions: [],
    gameOver: false,
    outcome: null,
    showDoctorAdvice: false,
    doctorAdvice: "",
    showFeedback: false,
    lastDecision: null,
    
    // Scoring-related properties
    score: 0,
    totalPossibleScore: scenarios.length * 100, // Each scenario is worth 100 points max
    bonusPoints: 0,
    timeTaken: 0,
    gameStartTime: new Date(),
    decisionTimes: [],
    showConfetti: false,
  });

  // Modal visibility states
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [playerName, setPlayerName] = useState("");

  // Theme setup effect
  useEffect(() => {
    // Set dark theme on the body
    document.body.classList.add('gaming-dark');
    
    // Background ambient sound - only initialize in browser environment
    let ambientSound: HTMLAudioElement | undefined;
    
    // Check if code is running in browser environment
    if (typeof window !== 'undefined') {
      ambientSound = new Audio('/sounds/ambient.mp3');
      ambientSound.volume = 0.1;
      ambientSound.loop = true;
      ambientSound.play().catch(e => console.log('Ambient sound autoplay prevented'));
    }
    
    // Cleanup function
    return () => {
      document.body.classList.remove('gaming-dark');
      if (ambientSound) {
        ambientSound.pause();
      }
    };
  }, []);

  const makeDecision = (optionIndex: number) => {
    const currentScenario = scenarios[gameState.currentScenarioIndex];
    const decision = currentScenario.options[optionIndex];
    
    // Calculate decision time
    const decisionTime = new Date().getTime() - gameState.gameStartTime.getTime();
    const updatedDecisionTimes = [...gameState.decisionTimes, decisionTime];
    
    // Update patient state based on decision outcome
    const updatedVitals = updateVitalsBasedOnOutcome(gameState, decision.outcome);
    
    // Update decisions history with current patient status
    const updatedDecisions = [...gameState.decisions, {
      scenario: currentScenario.id,
      decision: decision,
      timeToDecide: decisionTime,
      patientStatus: updatedVitals.icpStatus as ICPStatus // Add type assertion here
    }];
    
    // Calculate points for this decision
    let decisionPoints = 0;
    let bonusPoints = gameState.bonusPoints;
    
    switch(decision.outcome) {
      case "Positive":
        decisionPoints = 100; // Full points for best decision
        bonusPoints += 25; // Bonus for making the best choice
        break;
      case "Neutral":
        decisionPoints = 50; // Half points for acceptable decision
        break;
      case "Negative":
        decisionPoints = 0; // No points for poor decision
        break;
      default:
        decisionPoints = 0;
        break;
    }
    
    // Apply time bonus/penalty
    let timeBonus = 0;
    let showConfetti = false;
    if (decision.outcome === "Positive" && decisionTime < 30000) { // 30 seconds threshold
      timeBonus = Math.floor((30000 - decisionTime) / 1000); // 1 point per second under 30
      bonusPoints += timeBonus;
      showConfetti = true;
    }
    
    // Calculate total score so far
    const updatedScore = gameState.score + decisionPoints;
    
    // Check if game should end
    const isLastScenario = gameState.currentScenarioIndex >= scenarios.length - 1;
    const isHerniation = updatedVitals.icpStatus === "herniation";
    const gameEnded = isLastScenario || isHerniation;
    
    // Calculate outcome if game is over
    let finalOutcome = null;
    if (gameEnded) {
      finalOutcome = determineOutcome(updatedDecisions, updatedVitals.icpStatus as ICPStatus); // Add type assertion
      
      // Add completion bonus if patient survived
      if (updatedVitals.icpStatus !== "herniation") {
        bonusPoints += 100; // Bonus for completing without herniation
      }
    }
    
    // Calculate total time taken
    const totalTime = gameState.timeTaken + decisionTime;
    
    // Update game state
    setGameState({
      ...gameState,
      ...updatedVitals,
      decisions: updatedDecisions,
      decisionTimes: updatedDecisionTimes,
      currentScenarioIndex: isLastScenario ? gameState.currentScenarioIndex : gameState.currentScenarioIndex + 1,
      gameOver: gameEnded,
      outcome: finalOutcome,
      showFeedback: true,
      lastDecision: decision,
      score: updatedScore,
      bonusPoints: bonusPoints,
      timeTaken: totalTime,
      // Reset the game start time for the next decision timing
      gameStartTime: new Date(),
      showConfetti: showConfetti
    });
  };

  // Function to call doctor for advice
  const callDoctor = () => {
    if (gameState.doctorCallsRemaining <= 0) {
      setGameState({
        ...gameState,
        showDoctorAdvice: true,
        doctorAdvice: "This is your fourth call. Dr. Rodriguez sounds exhausted: \"I'm being called into emergency surgery. Dr. Wilson will be taking over Sarah's case. Please make this clinical decision based on your nursing judgment - I trust your assessment skills. Remember your ICP management protocol.\""
      });
      return;
    }
    
    // Reduce available doctor calls
    const updatedCalls = gameState.doctorCallsRemaining - 1;
    
    // Get current scenario
    const currentScenario = scenarios[gameState.currentScenarioIndex];
    let advice = "";
    
    // Generate advice based on current scenario
    switch(currentScenario.id) {
      case "initial":
        advice = "I'd recommend establishing a thorough baseline neurological assessment first. Document GCS components, pupil size and reactivity, and vital signs. Position the head of bed at 30° and continue monitoring closely.";
        break;
      case "monitoring":
        advice = "These changes (pupillary asymmetry, rising BP, decreasing HR) suggest early Cushing's triad and increasing ICP. Notify me immediately of these changes and prepare for possible interventions.";
        break;
      case "intervention":
        advice = "Administer mannitol as ordered, ensure head of bed elevation at 30°, and prepare for possible intubation and hyperventilation. The goal is to reduce ICP while maintaining cerebral perfusion pressure.";
        break;
      case "critical":
        advice = "We need to secure the airway immediately. Prepare for rapid sequence intubation. The patient is showing signs of significant decompensation and needs hyperventilation to temporarily reduce ICP while we prepare for surgery.";
        break;
      case "resolution":
        advice = "Maintain head elevation during transport, continue all ICP management strategies, and ensure continuous monitoring. Every minute counts now - focus on a safe, efficient transfer to the OR.";
        break;
      default:
        advice = "Continue monitoring the patient closely and notify me of any changes in neurological status.";
        break;
    }
    
    // Update game state with doctor's advice
    setGameState({
      ...gameState,
      doctorCallsRemaining: updatedCalls,
      showDoctorAdvice: true,
      doctorAdvice: advice
    });
  };

  // Function to continue to next scenario/close feedback
  const continueGame = () => {
    setGameState({
      ...gameState,
      showFeedback: false,
      showDoctorAdvice: false,
      doctorAdvice: "",
      showConfetti: false
    });
  };

  // Function to restart the game
  const restartGame = () => {
    setGameState({
      patientName: "Sarah Chen",
      age: 28,
      occupation: "Software Engineer",
      doctorCallsRemaining: 3,
      icpStatus: "elevated" as ICPStatus, // Using the defined type 
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
      
      // Reset scoring-related properties
      score: 0,
      totalPossibleScore: scenarios.length * 100, // This was missing
      bonusPoints: 0,
      timeTaken: 0,
      gameStartTime: new Date(),
      decisionTimes: [],
      showConfetti: false
    });
    
    // Also reset modal states
    setShowLeaderboard(false);
    setShowAchievements(false);
    setShowCertificate(false);
    setShowShareModal(false);
  };

  // Get current scenario
  const currentScenario = scenarios[gameState.currentScenarioIndex];

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4 space-y-6 gaming-dark min-h-screen">
      <div className="glass p-4 rounded-lg border border-blue-800 mb-6">
        <div className="flex items-center space-x-3">
          <Brain className="h-10 w-10 text-blue-400 animate-pulse" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            ICP Management Simulation: Sarah Chen's Case
          </h1>
        </div>
      </div>

      {gameState.showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-24 w-24 text-yellow-400 animate-pulse" />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between glass p-3 rounded-lg border border-blue-800">
        <div className="flex items-center space-x-2">
          <PhoneCall className="h-5 w-5 text-blue-400" />
          <span className="text-sm font-medium text-blue-200">Doctor Calls Remaining: {gameState.doctorCallsRemaining}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium mr-2 text-blue-200">Patient Status:</span>
          <span className={`inline-block w-3 h-3 rounded-full transition-colors duration-500 ${
            gameState.icpStatus === "normal" ? "bg-green-500" :
            gameState.icpStatus === "elevated" ? "bg-yellow-500" :
            gameState.icpStatus === "critical" ? "bg-red-500" :
            "bg-purple-800"
          }`}></span>
          <span className="text-sm font-medium capitalize text-blue-200">{gameState.icpStatus}</span>
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
          onContinue={continueGame}
        />
      )}
      
      <div className="text-center text-sm text-blue-300 mt-6 glass p-3 rounded-lg border border-blue-800">
        <p>This simulation contributes to your Continuing Professional Development in Neuroscience Nursing.</p>
      </div>
      
      {/* Modals */}
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