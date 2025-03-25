// src/utils/gameUtils.js
// Helper functions for the ICP Simulation

// Format time in minutes and seconds
export const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
};

// Update vitals based on decision outcome
export const updateVitalsBasedOnOutcome = (state, outcome) => {
  let updatedState = { ...state };
  
  // Update ICP status based on decision outcome
  switch(outcome) {
    case "Positive":
      if (updatedState.icpStatus === "critical") {
        updatedState.icpStatus = "elevated";
      }
      break;
    case "Negative":
      if (updatedState.icpStatus === "elevated") {
        updatedState.icpStatus = "critical";
      } else if (updatedState.icpStatus === "critical") {
        updatedState.icpStatus = "herniation";
      }
      break;
    case "Neutral":
      // No change to ICP status
      break;
    default:
      break;
  }
  
  // Update vital signs based on new ICP status
  switch(updatedState.icpStatus) {
    case "normal":
      updatedState.bp = "120/80";
      updatedState.heartRate = 70;
      updatedState.respiratoryPattern = "normal";
      updatedState.pupilRight = "3mm, reactive";
      updatedState.pupilLeft = "3mm, reactive";
      updatedState.gcsScore = 15;
      break;
    case "elevated":
      updatedState.bp = "150/90";
      updatedState.heartRate = 65;
      updatedState.respiratoryPattern = "irregular";
      updatedState.pupilRight = "4mm, sluggish";
      updatedState.pupilLeft = "3mm, reactive";
      updatedState.gcsScore = 12;
      break;
    case "critical":
      updatedState.bp = "180/95";
      updatedState.heartRate = 55;
      updatedState.respiratoryPattern = "Cheyne-Stokes";
      updatedState.pupilRight = "5mm, minimally reactive";
      updatedState.pupilLeft = "3.5mm, sluggish";
      updatedState.gcsScore = 8;
      break;
    case "herniation":
      updatedState.bp = "200/110";
      updatedState.heartRate = 45;
      updatedState.respiratoryPattern = "ataxic";
      updatedState.pupilRight = "6mm, fixed";
      updatedState.pupilLeft = "5mm, minimally reactive";
      updatedState.gcsScore = 5;
      break;
    default:
      break;
  }
  
  return updatedState;
};

// Determine final outcome based on decisions
export const determineOutcome = (decisions, icpStatus) => {
  // Count positive decisions
  const positiveDecisions = decisions.filter(
    d => d.decision.outcome === "Positive"
  ).length;
  
  // Determine final outcome based on patient status and decisions
  if (icpStatus === "herniation") {
    return {
      result: "Poor Outcome",
      description: "Despite interventions, Sarah experienced herniation. She underwent emergency surgery but suffered significant brain damage. She remains in a persistent vegetative state."
    };
  } else if (positiveDecisions >= 3) {
    return {
      result: "Excellent Outcome",
      description: "Your timely interventions and proper management helped Sarah through this critical period. After surgery and rehabilitation, she makes a good recovery with minimal deficits and is able to return to work part-time within 6 months."
    };
  } else if (positiveDecisions >= 2) {
    return {
      result: "Moderate Outcome",
      description: "Sarah survives the acute event but experiences moderate neurological deficits. With extensive rehabilitation, she regains most functions but has persistent cognitive challenges and cannot return to her previous occupation."
    };
  } else {
    return {
      result: "Poor Outcome",
      description: "Sarah survives but with severe neurological deficits. She requires long-term care and has significant disability."
    };
  }
};

// Function to determine badge and rank based on score
export const getBadgeAndRank = (score, totalPossible, icpStatus) => {
  const scorePercentage = (score / totalPossible) * 100;
  
  let rank = '';
  let badge = '';
  
  if (icpStatus === "herniation") {
    rank = "Novice Clinician";
    badge = "First Responder";
  } else if (scorePercentage >= 90) {
    rank = "Neuroscience Specialist";
    badge = "Brain Trauma Champion";
  } else if (scorePercentage >= 80) {
    rank = "Senior Clinician";
    badge = "Critical Care Expert";
  } else if (scorePercentage >= 70) {
    rank = "Clinical Practitioner";
    badge = "Neurological First Responder";
  } else if (scorePercentage >= 60) {
    rank = "Healthcare Professional";
    badge = "ICP Management Trainee";
  } else {
    rank = "Nursing Student";
    badge = "Clinical Apprentice";
  }
  
  return { rank, badge };
};