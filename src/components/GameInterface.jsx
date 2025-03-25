// components/GameInterface.jsx
import React, { useState, useEffect } from 'react';
import { PhoneCall, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { PatientStatusMonitor } from './PatientStatusMonitor';
import { ScoreDisplay } from './ScoreDisplay';

export const GameInterface = ({ 
  gameState, 
  currentScenario, 
  scenariosCount, 
  onMakeDecision, 
  onCallDoctor, 
  onContinue 
}) => {
  // Sound effects
  const [sounds] = useState({
    buttonHover: new Audio('/sounds/hover.mp3'),
    buttonClick: new Audio('/sounds/click.mp3'),
    success: new Audio('/sounds/success.mp3'),
    error: new Audio('/sounds/error.mp3'),
    phoneRing: new Audio('/sounds/phone.mp3')
  });
  
  // Set low volume
  useEffect(() => {
    Object.values(sounds).forEach(sound => {
      sound.volume = 0.2;
    });
  }, [sounds]);
  
  // Play sounds on events
  const playSound = (soundName) => {
    sounds[soundName].currentTime = 0;
    sounds[soundName].play();
  };
  
  // Staggered animation for options
  const [optionsVisible, setOptionsVisible] = useState(false);
  useEffect(() => {
    // Short delay to create nice entrance effect
    const timer = setTimeout(() => {
      setOptionsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentScenario]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main scenario panel */}
      <div className="col-span-1 md:col-span-2 glass rounded-lg overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-5">
          <h2 className="text-xl font-bold text-white">{currentScenario.title}</h2>
          <div className="text-sm text-blue-200">Scenario {gameState.currentScenarioIndex + 1} of {scenariosCount}</div>
        </div>
        <div className="p-6 bg-gray-900 bg-opacity-80">
          {/* Score Display */}
          <ScoreDisplay 
            score={gameState.score}
            bonusPoints={gameState.bonusPoints}
            currentScenarioIndex={gameState.currentScenarioIndex}
            totalScenarios={scenariosCount}
          />
          
          {/* Patient Status Monitor */}
          <PatientStatusMonitor status={gameState} />
          
          {/* Scenario Description */}
          <div className="mb-6 animate-fade-in">
            <p className="mb-4 leading-relaxed">{currentScenario.description}</p>
            
            {/* Vital Signs */}
            <div className="glass p-4 rounded-lg mb-4">
              <h3 className="font-bold mb-2 text-blue-400">Patient Status:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-900 p-3 rounded-lg">
                  <span className="text-gray-400 text-sm">BP:</span>
                  <span className="font-mono ml-2">{gameState.bp}</span>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg">
                  <span className="text-gray-400 text-sm">HR:</span>
                  <span className="font-mono ml-2">{gameState.heartRate}</span>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg">
                  <span className="text-gray-400 text-sm">RR:</span>
                  <span className="font-mono ml-2">{gameState.respiratoryPattern}</span>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg">
                  <span className="text-gray-400 text-sm">GCS:</span>
                  <span className="font-mono ml-2">{gameState.gcsScore}</span>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg col-span-2">
                  <span className="text-gray-400 text-sm">Pupils:</span>
                  <span className="font-mono ml-2">R: {gameState.pupilRight}, L: {gameState.pupilLeft}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decision Point */}
          {!gameState.showFeedback && !gameState.showDoctorAdvice && (
            <div className="animate-fade-in">
              <h3 className="font-bold mb-4 text-xl text-blue-300">{currentScenario.question}</h3>
              <div className="space-y-4">
                {currentScenario.options.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-4 rounded border border-blue-700 hover:border-blue-400 
                              hover:bg-blue-900 hover:bg-opacity-30 transition-all duration-300
                              ${optionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                    onClick={() => {
                      playSound('buttonClick');
                      onMakeDecision(index);
                    }}
                    onMouseEnter={() => playSound('buttonHover')}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
              
              <div className="mt-6">
                <button
                  className="flex items-center px-4 py-3 rounded bg-blue-800 hover:bg-blue-700 transition-colors 
                            border border-blue-600 text-white"
                  onClick={() => {
                    playSound('phoneRing');
                    onCallDoctor();
                  }}
                  disabled={gameState.doctorCallsRemaining <= 0}
                  onMouseEnter={() => playSound('buttonHover')}
                >
                  <PhoneCall className="w-5 h-5 mr-2" />
                  Call Doctor ({gameState.doctorCallsRemaining} {gameState.doctorCallsRemaining === 1 ? "call" : "calls"} left)
                </button>
              </div>
            </div>
          )}
          
          {/* Doctor Advice - Modal Style */}
          {gameState.showDoctorAdvice && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
              <div className="glass bg-blue-900 bg-opacity-90 p-6 rounded-lg max-w-lg transform animate-slide-in">
                <div className="flex items-start mb-4">
                  <PhoneCall className="h-6 w-6 text-blue-400 mr-3 mt-1" />
                  <h3 className="font-bold text-xl text-white">Doctor's Advice:</h3>
                </div>
                <p className="italic text-blue-100 mb-6">{gameState.doctorAdvice}</p>
                <button 
                  className="w-full px-4 py-3 bg-blue-700 hover:bg-blue-600 rounded text-white font-bold transition-colors"
                  onClick={() => {
                    playSound('buttonClick');
                    onContinue();
                  }}
                  onMouseEnter={() => playSound('buttonHover')}
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          
          {/* Decision Feedback - Modal Style */}
          {gameState.showFeedback && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
              <div 
                className={`glass p-6 rounded-lg max-w-lg transform animate-slide-in ${
                  gameState.lastDecision.outcome === "Positive" ? "bg-green-900 bg-opacity-90" :
                  gameState.lastDecision.outcome === "Negative" ? "bg-red-900 bg-opacity-90" :
                  "bg-yellow-900 bg-opacity-90"
                }`}>
                <div className="flex items-start mb-4">
                  {gameState.lastDecision.outcome === "Positive" ? (
                    <CheckCircle className="h-6 w-6 text-green-400 mr-3 mt-1" />
                  ) : gameState.lastDecision.outcome === "Negative" ? (
                    <XCircle className="h-6 w-6 text-red-400 mr-3 mt-1" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-yellow-400 mr-3 mt-1" />
                  )}
                  <h3 className="font-bold text-xl text-white">
                    {gameState.lastDecision.outcome === "Positive" ? "Correct Decision" :
                     gameState.lastDecision.outcome === "Negative" ? "Critical Error" :
                     "Acceptable Approach"}
                  </h3>
                </div>
                <p className="text-white mb-6">{gameState.lastDecision.feedback}</p>
                <button 
                  className="w-full px-4 py-3 bg-blue-700 hover:bg-blue-600 rounded text-white font-bold transition-colors"
                  onClick={() => {
                    playSound('buttonClick');
                    onContinue();
                  }}
                  onMouseEnter={() => playSound('buttonHover')}
                >
                  Continue to Next Step
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Clinical Resources Panel */}
      <div className="col-span-1 glass rounded-lg overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-5">
          <h2 className="text-xl font-bold text-white">Clinical Resources</h2>
        </div>
        <div className="p-4 bg-gray-900 bg-opacity-80 h-[calc(100%-80px)] overflow-y-auto">
          <div className="glass p-4 rounded-lg mb-4">
            <h3 className="font-bold text-sm uppercase text-blue-400 mb-2">ICP Normal Ranges</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                Normal: 5-15 mmHg
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                Elevated: 16-20 mmHg
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                Critical: 21-40 mmHg
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-800 mr-2"></div>
                Severe: &gt;40 mmHg (high risk of herniation)
              </li>
            </ul>
          </div>
          
          <div className="glass p-4 rounded-lg mb-4">
            <h3 className="font-bold text-sm uppercase text-blue-400 mb-2">Cushing's Triad</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                Hypertension (↑ BP)
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                Bradycardia (↓ HR)
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                Irregular breathing pattern
              </li>
            </ul>
          </div>
          
          <div className="glass p-4 rounded-lg mb-4">
            <h3 className="font-bold text-sm uppercase text-blue-400 mb-2">ICP Management</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                Elevate head of bed 30-45°
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                Maintain neutral head/neck alignment
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                Minimize noxious stimuli
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                Osmotic therapy (mannitol, hypertonic saline)
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                CSF drainage via EVD if placed
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                Controlled hyperventilation (temporary)
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                Surgical decompression (if medical management fails)
              </li>
            </ul>
          </div>
          
          <div className="glass p-4 rounded-lg">
            <h3 className="font-bold text-sm uppercase text-blue-400 mb-2">Herniation Warning Signs</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                Unilateral or bilateral pupil dilation
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                Loss of pupillary reflex
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                Decorticate or decerebrate posturing
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                Rapid decline in GCS
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                Cushing's triad (late sign)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInterface;