// src/ICPSimulationGame.tsx
import React, { useState } from 'react';
import { Brain, PhoneCall, Sparkles, Heart, Activity, AlertCircle } from 'lucide-react';
import { scenarios } from './data/scenarios';
import GameInterface from './components/GameInterface';
import { GameOverScreen } from './components/GameOverScreen';
import { Leaderboard } from './components/Leaderboard';
import { Achievements } from './components/Achievements';
import { Certificate } from './components/Certificate';
import { SocialShare } from './components/SocialShare';
import { updateVitalsBasedOnOutcome, determineOutcome, getBadgeAndRank, formatTime } from './utils/gameUtils';
import './styles/gaming-theme.css';

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
  const [showResources, setShowResources] = useState(false);

  // Removed all useEffect and browser-specific APIs

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
      totalPossibleScore: scenarios.length * 100,
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
    setShowResources(false);
  };

  // Get current scenario
  const currentScenario = scenarios[gameState.currentScenarioIndex];

  // Status indicator color classes
  const getStatusClass = (status: ICPStatus) => {
    switch(status) {
      case "normal": return "status-normal";
      case "elevated": return "status-elevated";
      case "critical": return "status-critical";
      case "herniation": return "status-herniation";
      default: return "status-elevated";
    }
  };

  return (
    <div className="gaming-theme flex flex-col w-full max-w-6xl mx-auto p-4 space-y-4 min-h-screen">
      <div className="header-card">
        <Brain className="h-10 w-10 text-white" />
        <h1 className="text-2xl font-bold">
          ICP Management Simulation: Sarah Chen's Case
        </h1>
      </div>

      <div className="card flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PhoneCall className="h-5 w-5 text-blue-400" />
          <span className="text-sm font-medium">Doctor Calls Remaining: {gameState.doctorCallsRemaining}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium mr-2">Patient Status:</span>
          <span className={`status-badge ${getStatusClass(gameState.icpStatus)}`}>
            {gameState.icpStatus.charAt(0).toUpperCase() + gameState.icpStatus.slice(1)}
          </span>
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
        <div className="game-interface-container flex flex-col md:flex-row gap-4">
          <div className="main-game-area flex-1">
            <div className="card">
              <h2 className="text-xl font-semibold mb-2">
                {currentScenario.title}
              </h2>
              <div className="mb-3">
                <span className="text-sm text-blue-400">Scenario {gameState.currentScenarioIndex + 1} of {scenarios.length}</span>
              </div>
              
              <div className="progress-indicator">
                {scenarios.map((_, index) => (
                  <div 
                    key={index} 
                    className={`progress-step ${index === gameState.currentScenarioIndex ? 'active' : index < gameState.currentScenarioIndex ? 'completed' : ''}`}
                  />
                ))}
              </div>
              
              <div className="scenario-content my-4">
                <p className="text-gray-200">{currentScenario.description}</p>
              </div>
              
              <div className="card vital-monitor bg-slate-800">
                <h3 className="text-lg font-medium mb-3 text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-400" />
                  Patient Vitals Monitor
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="vital-item">
                    <span className="vital-label">Heart Rate</span>
                    <span className={`vital-value ${gameState.heartRate < 60 ? 'critical' : ''}`}>
                      {gameState.heartRate} bpm
                    </span>
                  </div>
                  <div className="vital-item">
                    <span className="vital-label">Blood Pressure</span>
                    <span className={`vital-value ${parseInt(gameState.bp.split('/')[0]) > 160 ? 'critical' : ''}`}>
                      {gameState.bp}
                    </span>
                  </div>
                  <div className="vital-item">
                    <span className="vital-label">GCS Score</span>
                    <span className={`vital-value ${gameState.gcsScore < 9 ? 'critical' : gameState.gcsScore < 13 ? 'warning' : ''}`}>
                      {gameState.gcsScore}/15
                    </span>
                  </div>
                  <div className="vital-item">
                    <span className="vital-label">ICP Range</span>
                    <span className={`vital-value ${gameState.icpStatus === 'critical' || gameState.icpStatus === 'herniation' ? 'critical' : gameState.icpStatus === 'elevated' ? 'warning' : ''}`}>
                      {gameState.icpStatus === 'normal' ? '5-15 mmHg' : 
                       gameState.icpStatus === 'elevated' ? '16-20 mmHg' : 
                       gameState.icpStatus === 'critical' ? '21-30 mmHg' : '>40 mmHg'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="vital-item">
                    <span className="vital-label">Right Pupil</span>
                    <span className="vital-value">{gameState.pupilRight}</span>
                  </div>
                  <div className="vital-item">
                    <span className="vital-label">Left Pupil</span>
                    <span className="vital-value">{gameState.pupilLeft}</span>
                  </div>
                </div>
              </div>
              
              {!gameState.showFeedback && !gameState.showDoctorAdvice && (
                <div className="decision-options mt-4">
                  <h3 className="text-lg font-medium mb-3">What is your next action?</h3>
                  {currentScenario.options.map((option, index) => (
                    <button 
                      key={index}
                      className="decision-button"
                      onClick={() => makeDecision(index)}
                    >
                      {option.text}
                    </button>
                  ))}
                  
                  <button className="call-doctor-button" onClick={callDoctor}>
                    <PhoneCall className="h-4 w-4" />
                    Call Doctor ({gameState.doctorCallsRemaining} calls left)
                  </button>
                </div>
              )}
              
              {gameState.showDoctorAdvice && (
                <div className="doctor-advice card mt-4 bg-blue-900">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <PhoneCall className="h-5 w-5 mr-2" />
                    Doctor's Advice
                  </h3>
                  <p className="text-gray-200 mb-4">{gameState.doctorAdvice}</p>
                  <button 
                    className="call-doctor-button"
                    onClick={continueGame}
                  >
                    Continue
                  </button>
                </div>
              )}
              
              {gameState.showFeedback && gameState.lastDecision && (
                <div className={`feedback card mt-4 ${
                  gameState.lastDecision.outcome === "Positive" ? "bg-green-900" : 
                  gameState.lastDecision.outcome === "Neutral" ? "bg-yellow-900" : "bg-red-900"
                }`}>
                  <h3 className="text-lg font-medium mb-2">Feedback</h3>
                  <p className="text-gray-200 mb-4">{gameState.lastDecision.feedback}</p>
                  <button 
                    className="call-doctor-button"
                    onClick={continueGame}
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="game-sidebar w-full md:w-80">
            <div className="card">
              <div className="score-display mb-4">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-yellow-400" />
                  Score
                </h3>
                <div className="text-3xl font-bold text-blue-400">{gameState.score}</div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <span className="text-sm text-gray-400">Base</span>
                    <div className="text-lg">{gameState.score - gameState.bonusPoints}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Bonus</span>
                    <div className="text-lg">{gameState.bonusPoints}</div>
                  </div>
                </div>
              </div>
              
              <button
                className="call-doctor-button mb-4 w-full justify-center"
                onClick={() => setShowResources(!showResources)}
              >
                {showResources ? "Hide Clinical Resources" : "Show Clinical Resources"}
              </button>
              
              {showResources && (
                <div className="clinical-resources">
                  <h3 className="text-xl font-medium mb-3">Clinical Resources</h3>
                  
                  <div className="resource-section">
                    <h4 className="resource-title">ICP NORMAL RANGES</h4>
                    <ul className="resource-list">
                      <li>Normal: 5-15 mmHg</li>
                      <li>Elevated: 16-20 mmHg</li>
                      <li>Critical: 21-40 mmHg</li>
                      <li>Severe: &gt;40 mmHg (high risk of herniation)</li>
                    </ul>
                  </div>
                  
                  <div className="resource-section">
                    <h4 className="resource-title">CUSHING'S TRIAD</h4>
                    <ul className="resource-list">
                      <li>Hypertension (↑ BP)</li>
                      <li>Bradycardia (↓ HR)</li>
                      <li>Irregular breathing pattern</li>
                    </ul>
                  </div>
                  
                  <div className="resource-section">
                    <h4 className="resource-title">ICP MANAGEMENT</h4>
                    <ul className="resource-list">
                      <li>Elevate head of bed 30-45°</li>
                      <li>Maintain neutral head/neck alignment</li>
                      <li>Minimize noxious stimuli</li>
                      <li>Osmotic therapy (mannitol, hypertonic saline)</li>
                      <li>CSF drainage via EVD if placed</li>
                      <li>Controlled hyperventilation (temporary)</li>
                      <li>Surgical decompression (if medical management fails)</li>
                    </ul>
                  </div>
                  
                  <div className="resource-section">
                    <h4 className="resource-title">HERNIATION WARNING SIGNS</h4>
                    <ul className="resource-list">
                      <li>Unilateral or bilateral pupil dilation</li>
                      <li>Loss of pupillary reflex</li>
                      <li>Decorticate or decerebrate posturing</li>
                      <li>Rapid decline in GCS</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center text-sm text-blue-300 mt-6 card">
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