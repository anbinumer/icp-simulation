import React, { useState } from 'react';
import { scenarios } from './data/scenarios';

const ICPSimulationGame = () => {
  const [gameState, setGameState] = useState({
    patientName: "Sarah Chen",
    age: 28,
    occupation: "Software Engineer",
    doctorCallsRemaining: 3,
    icpStatus: "Stable",
    gcsScore: 15,
    bp: "120/80",
    heartRate: 75,
    temperature: "37°C",
    respiratoryPattern: "Normal",
    pupilRight: "Reactive",
    pupilLeft: "Reactive",
    consciousness: "Alert",
    motorResponse: "Obeys Commands",
    verbalResponse: "Oriented",
    eyeResponse: "Spontaneous",
    intracranialPressure: 12,
    oxygenSaturation: "98%",
    currentScenario: scenarios[0],
    scenarioIndex: 0,
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

  const restartGame = () => {
    setGameState({
      patientName: "Sarah Chen",
      age: 28,
      occupation: "Software Engineer",
      doctorCallsRemaining: 3,
      icpStatus: "Stable",
      gcsScore: 15,
      bp: "120/80",
      heartRate: 75,
      temperature: "37°C",
      respiratoryPattern: "Normal",
      pupilRight: "Reactive",
      pupilLeft: "Reactive",
      consciousness: "Alert",
      motorResponse: "Obeys Commands",
      verbalResponse: "Oriented",
      eyeResponse: "Spontaneous",
      intracranialPressure: 12,
      oxygenSaturation: "98%",
      currentScenario: scenarios[0],
      scenarioIndex: 0,
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
  };

  return (
    <div>
      <h1>ICP Simulation Game</h1>
      <p>Patient: {gameState.patientName}</p>
      <button onClick={restartGame}>Restart Game</button>
    </div>
  );
};

export default ICPSimulationGame;
